using TireStore.Application.Abstractions;
using TireStore.Application.Common;
using TireStore.Application.Orders;

namespace TireStore.Application.Payments;

public sealed class TomanPaymentOptions
{
    public string Mode { get; set; } = "Toman";
    public bool AllowMock { get; set; }
    public bool MockAutoSuccess { get; set; }
    public string ApiBaseUrl { get; set; } = "https://ipg-staging.toman.ir";
    public string AuthUrl { get; set; } = "https://auth.qbitpay.org/oauth2/token/";
    public string ClientId { get; set; } = "";
    public string ClientSecret { get; set; } = "";
    public string Username { get; set; } = "";
    public string Password { get; set; } = "";
    public string CallbackUrl { get; set; } = "";
    public string FrontendReturnUrl { get; set; } = "http://localhost:3000/tire-store";
    public string PublicApiBaseUrl { get; set; } = "http://localhost:5188";
    public string MobileNumber { get; set; } = "";
    public string TerminalNumber { get; set; } = "";
}

public sealed record PaymentStartDto(string CheckoutUrl, string Provider);
public sealed record PaymentResultDto(bool Success, int OrderId, int InstallmentNumber, string View);
public sealed record TomanCallbackDto(string Uuid, string TrackerId, long AmountInRials, int Status);

public sealed class PaymentService(
    IOrderRepository orders,
    OrderService orderService,
    ITomanPaymentGateway toman,
    TomanPaymentOptions options)
{
    public async Task<PaymentStartDto> StartAsync(int installmentId, CancellationToken cancellationToken)
    {
        var installment = orderService.ValidatePayment(installmentId);
        var mode = options.Mode.Trim();
        if (mode.Equals("Mock", StringComparison.OrdinalIgnoreCase))
        {
            if (!options.AllowMock) throw new ValidationException("شبیه‌ساز پرداخت فقط در محیط توسعه فعال است.");
            if (installment.PaymentStatus == "Pending" && installment.PaymentTrackerId is not null)
            {
                if (options.MockAutoSuccess)
                    return new PaymentStartDto(ToReturnUrl(CompleteMock(installment.PaymentTrackerId, true)), "TomanPay Test");
                return new PaymentStartDto(MockUrl(installment.PaymentTrackerId), "TomanPay Test");
            }
            installment.PaymentTrackerId = Guid.NewGuid().ToString("N");
            installment.ExternalPaymentId = null;
            installment.PaymentStatus = "Pending";
            installment.Gateway = "TomanPay Test";
            if (options.MockAutoSuccess)
                return new PaymentStartDto(ToReturnUrl(CompleteMock(installment.PaymentTrackerId, true)), "TomanPay Test");
            return new PaymentStartDto(MockUrl(installment.PaymentTrackerId), "TomanPay Test");
        }

        if (!mode.Equals("Toman", StringComparison.OrdinalIgnoreCase))
            throw new ValidationException("درگاه پرداخت پیکربندی نشده است.");
        if (installment.PaymentStatus is "VerificationPending" or "ReviewRequired")
            throw new ValidationException("نتیجه‌ی پرداخت قبلی هنوز قطعی نشده است؛ از پرداخت دوباره خودداری کن و با پشتیبانی تماس بگیر.");
        if (installment.PaymentStatus == "Pending" && installment.PaymentTrackerId is not null && installment.ExternalPaymentId is not null)
            return new PaymentStartDto(RedirectUrl(installment.ExternalPaymentId), "TomanPay");
        if (!Uri.TryCreate(options.CallbackUrl, UriKind.Absolute, out _))
            throw new ValidationException("آدرس عمومی callback درگاه تنظیم نشده است.");

        var trackerId = Guid.NewGuid().ToString("N");
        installment.PaymentTrackerId = trackerId;
        installment.ExternalPaymentId = null;
        installment.PaymentStatus = "Pending";
        installment.Gateway = "TomanPay";
        var amountInRials = checked((long)decimal.Round(installment.Amount * 10m, 0, MidpointRounding.AwayFromZero));
        try
        {
            var uuid = await toman.CreatePaymentAsync(new TomanPaymentRequest(
                amountInRials, trackerId, options.CallbackUrl,
                string.IsNullOrWhiteSpace(options.MobileNumber) ? null : options.MobileNumber,
                string.IsNullOrWhiteSpace(options.TerminalNumber) ? null : options.TerminalNumber), cancellationToken);
            installment.ExternalPaymentId = uuid;
            return new PaymentStartDto(RedirectUrl(uuid), "TomanPay");
        }
        catch
        {
            installment.PaymentStatus = "StartFailed";
            installment.PaymentTrackerId = null;
            installment.Gateway = null;
            throw new ValidationException("اتصال به درگاه تومن برقرار نشد. تنظیمات درگاه و دسترسی شبکه را بررسی کن.");
        }
    }

    public async Task<PaymentResultDto> HandleCallbackAsync(TomanCallbackDto callback, CancellationToken cancellationToken)
    {
        var installment = orders.GetInstallmentByTrackerId(callback.TrackerId);
        if (installment is null || !string.Equals(installment.ExternalPaymentId, callback.Uuid, StringComparison.OrdinalIgnoreCase))
            return new PaymentResultDto(false, 0, 0, "installments");

        var order = orderService.Get(installment.OrderId);
        var expectedAmount = checked((long)decimal.Round(installment.Amount * 10m, 0, MidpointRounding.AwayFromZero));
        if (callback.AmountInRials != expectedAmount)
        {
            installment.PaymentStatus = "ReviewRequired";
            return Result(false, order.Id, installment.Number);
        }
        if (callback.Status != 4)
        {
            MarkFailed(installment);
            return Result(false, order.Id, installment.Number);
        }
        if (installment.Status == "Paid") return Result(true, order.Id, installment.Number);

        TomanPaymentVerification verified;
        try
        {
            verified = await toman.VerifyPaymentAsync(callback.Uuid, cancellationToken);
        }
        catch
        {
            installment.PaymentStatus = "VerificationPending";
            return Result(false, order.Id, installment.Number);
        }

        if (!string.Equals(verified.Uuid, callback.Uuid, StringComparison.OrdinalIgnoreCase)
            || verified.AmountInRials != expectedAmount
            || verified.Status != 5
            || (!string.IsNullOrWhiteSpace(verified.TrackerId) && !string.Equals(verified.TrackerId, callback.TrackerId, StringComparison.Ordinal)))
        {
            installment.PaymentStatus = "ReviewRequired";
            return Result(false, order.Id, installment.Number);
        }

        try { orderService.CompleteVerifiedPayment(installment.Id, "TomanPay"); }
        catch
        {
            installment.PaymentStatus = "ReviewRequired";
            return Result(false, order.Id, installment.Number);
        }
        installment.PaymentStatus = "Verified";
        return Result(true, order.Id, installment.Number);
    }

    public PaymentResultDto CompleteMock(string trackerId, bool success)
    {
        if (!options.AllowMock || !options.Mode.Equals("Mock", StringComparison.OrdinalIgnoreCase))
            throw new NotFoundException("مسیر شبیه‌ساز پرداخت در دسترس نیست.");
        var installment = orders.GetInstallmentByTrackerId(trackerId) ?? throw new NotFoundException("پرداخت آزمایشی یافت نشد.");
        var order = orderService.Get(installment.OrderId);
        if (success)
        {
            orderService.CompleteVerifiedPayment(installment.Id, "TomanPay Test");
            installment.PaymentStatus = "Verified";
        }
        else MarkFailed(installment);
        return Result(success, order.Id, installment.Number);
    }

    public string MockCheckoutHtml(string trackerId)
    {
        if (!options.AllowMock || !options.Mode.Equals("Mock", StringComparison.OrdinalIgnoreCase))
            throw new NotFoundException("مسیر شبیه‌ساز پرداخت در دسترس نیست.");
        if (orders.GetInstallmentByTrackerId(trackerId) is null) throw new NotFoundException("پرداخت آزمایشی یافت نشد.");
        var safeId = Uri.EscapeDataString(trackerId);
        var root = $"/api/store/payments/mock/{safeId}";
        return $$"""
            <!doctype html><html lang="fa" dir="rtl"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>درگاه آزمایشی تومن</title>
            <body style="margin:0;background:#f3f7f8;font-family:Tahoma,Arial;color:#223038;display:grid;min-height:100vh;place-items:center"><main style="width:min(420px,calc(100% - 40px));box-sizing:border-box;padding:28px;background:#fff;border:1px solid #dfe8eb;border-radius:20px;box-shadow:0 12px 36px #22303812"><small style="color:#008c9a;font-weight:bold">محیط تست · TomanPay</small><h2 style="font-size:20px">پرداخت آزمایشی</h2><p style="color:#62747d;line-height:2">برای بررسی مسیر بازگشت از درگاه، یکی از نتیجه‌های تست را انتخاب کن. هیچ مبلغی جابه‌جا نمی‌شود.</p><form action="{{root}}/success" method="post"><button style="width:100%;height:48px;border:0;border-radius:12px;background:#01acbc;color:#fff;font-size:15px;font-weight:bold;cursor:pointer">شبیه‌سازی پرداخت موفق</button></form><form action="{{root}}/fail" method="post" style="margin-top:10px"><button style="width:100%;height:44px;border:1px solid #e4eaed;border-radius:12px;background:#fff;color:#6a7880;font-size:14px;cursor:pointer">شبیه‌سازی انصراف</button></form></main></body></html>
            """;
    }

    public string ToReturnUrl(PaymentResultDto result)
    {
        var view = result.Success ? result.InstallmentNumber == 1 ? "awaiting" : "installments"
            : result.InstallmentNumber == 1 ? "proforma" : "installments";
        var separator = options.FrontendReturnUrl.Contains('?') ? "&" : "?";
        return $"{options.FrontendReturnUrl}{separator}paymentResult={(result.Success ? "success" : "failed")}&view={view}&orderId={result.OrderId}";
    }

    private string MockUrl(string trackerId) => $"{options.PublicApiBaseUrl.TrimEnd('/')}/api/store/payments/mock/{Uri.EscapeDataString(trackerId)}";
    private string RedirectUrl(string uuid) => $"{options.ApiBaseUrl.TrimEnd('/')}/payments/{Uri.EscapeDataString(uuid)}/redirect";
    private static PaymentResultDto Result(bool success, int orderId, int number) => new(success, orderId, number, number == 1 ? success ? "awaiting" : "proforma" : "installments");

    private static void MarkFailed(Domain.Entities.Installment installment)
    {
        installment.PaymentStatus = "Failed";
        installment.PaymentTrackerId = null;
        installment.ExternalPaymentId = null;
        installment.Gateway = null;
    }
}
