using TireStore.Application.Abstractions;
using TireStore.Application.Common;
using TireStore.Domain.Entities;

namespace TireStore.Application.Orders;

public sealed class PricingOptions
{
    public decimal FeeRate { get; set; } = 0.07m;
    public int Installments { get; set; } = 4;
}

public sealed record OrderLineInput(int ProductId, int Quantity);
public sealed record QuoteInput(List<OrderLineInput>? Items, int? ShopId = null, string? PaymentMode = "Installments", int InstallmentCount = 4);
public sealed record CreateOrderInput(int ShopId, int? FleetId, List<OrderLineInput>? Items, string? FleetPlate = null, string? FleetType = null, string? PaymentMode = "Installments", int InstallmentCount = 4);
public sealed record DeliveryWindowInput(string Date, int StartHour);
public sealed record SellerDeliveryInput(string Code);
public sealed record QuoteDto(decimal Subtotal, decimal Fee, decimal Total, decimal DownPayment, decimal FinancedPrincipal, decimal FirstInstallment, decimal NextInstallment, decimal LastInstallment, int Installments, bool FirstPaymentAtPurchase, string PaymentMode, bool CreditEligible);

public sealed record PayInstallmentInput(string? Gateway);

public sealed class OrderService(IOrderRepository orders, IProductRepository products, ICreditRepository credits, IInstallmentPlanRepository installmentPlans)
{
    private const string CodeAlphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

    public QuoteDto Quote(QuoteInput input)
    {
        var shopId = input.ShopId ?? 1;
        return BuildQuote(ResolveLines(input.Items, shopId).Lines, shopId, input.PaymentMode, input.InstallmentCount, credits.Get(), allowCreditPreview: true);
    }

    public Order Create(CreateOrderInput input)
    {
        var (lines, quantities) = ResolveLines(input.Items, input.ShopId);
        var credit = credits.Get();
        var quote = BuildQuote(lines, input.ShopId, input.PaymentMode, input.InstallmentCount, credit);
        if (quote.PaymentMode == "Installments")
        {
            if (credit.Status != "Approved") throw new ValidationException("اعتبار شما هنوز فعال نشده است.");
            if (quote.FinancedPrincipal <= 0) throw new ValidationException("اعتبار کافی نیست؛ برای ادامه روش پرداخت نقدی را انتخاب کنید.");
            if (input.FleetId is null or <= 0) throw new ValidationException("خرید اقساطی باید به ناوگان متصل به اعتبار مرتبط باشد.");
        }
        if (!products.TryReserveStock(input.ShopId, quantities)) throw new ValidationException("موجودی محصول در این فروشگاه کافی نیست.");
        if (quote.PaymentMode == "Installments") credits.AddUsed(quote.FinancedPrincipal);

        var id = orders.NextOrderId();
        var order = new Order
        {
            Id = id, ShopId = input.ShopId, FleetId = quote.PaymentMode == "Cash" ? null : input.FleetId,
            FleetPlate = quote.PaymentMode == "Cash" ? "" : input.FleetPlate?.Trim() ?? "", FleetType = quote.PaymentMode == "Cash" ? "" : input.FleetType?.Trim() ?? "",
            Items = lines, Subtotal = quote.Subtotal, Fee = quote.Fee, Total = quote.Total,
            DownPayment = quote.DownPayment, FinancedPrincipal = quote.FinancedPrincipal,
            PaymentMode = quote.PaymentMode, InstallmentCount = quote.Installments,
            Status = OrderStatus.AwaitingSellerApproval,
            ProformaNumber = $"PF-{DateTimeOffset.UtcNow:yyMMdd}-{id:D4}"
        };
        var installments = new List<Installment>();
        for (var number = 1; number <= quote.Installments; number++)
        {
            installments.Add(new Installment
            {
                OrderId = order.Id, Number = number,
                Amount = quote.Installments == 1 ? quote.Total : number == 1 ? quote.FirstInstallment : number == quote.Installments ? quote.LastInstallment : quote.NextInstallment,
                DueDate = order.CreatedAt.AddMonths(number - 1),
                Status = number == 1 ? "DueAtPurchase" : "Upcoming"
            });
        }
        return orders.Add(order, installments);
    }

    public IReadOnlyList<Order> List() => orders.GetAll().OrderByDescending(o => o.CreatedAt).ToList();

    public Order Get(int id) => orders.Get(id) ?? throw new NotFoundException("سفارش یافت نشد.");

    public Order Approve(int id)
    {
        var order = Get(id);
        if (order.Status != OrderStatus.AwaitingSellerApproval) throw new ValidationException("پیش‌فاکتور در وضعیت تایید فروشنده نیست.");
        order.Status = OrderStatus.AwaitingFirstPayment;
        return order;
    }

    public Order Reject(int id)
    {
        var order = Get(id);
        if (order.Status is OrderStatus.Approved or OrderStatus.Rejected or OrderStatus.AwaitingDriverConfirm or OrderStatus.Delivered) throw new ValidationException("امکان رد این سفارش وجود ندارد.");
        var refunded = orders.GetInstallments()
            .Where(i => i.OrderId == id && i.Status == "Paid")
            .Sum(i => Math.Round((i.Number == 1 ? Math.Max(0, i.Amount - order.DownPayment) : i.Amount) * order.FinancedPrincipal / Math.Max(1, order.Total - order.DownPayment)));
        order.Status = OrderStatus.Rejected;
        products.ReleaseStock(order.ShopId, order.Items.Select(i => (i.ProductId, i.Quantity)).ToList());
        if (order.PaymentMode == "Installments") credits.AddUsed(-(order.FinancedPrincipal - refunded));
        return order;
    }

    public Order SetDeliveryWindow(int id, DeliveryWindowInput input)
    {
        var order = Get(id);
        if (order.Status != OrderStatus.Approved) throw new ValidationException("بازه‌ی تحویل پس از پرداخت قسط اول و تا پیش از تحویل قابل ثبت یا ویرایش است.");
        var tehran = TimeSpan.FromMinutes(210);
        if (!DateOnly.TryParseExact(input.Date, "yyyy-MM-dd", out var day)) throw new ValidationException("تاریخ تحویل نامعتبر است.");
        if (input.StartHour is not (8 or 12 or 16 or 20)) throw new ValidationException("بازه‌ی ساعتی باید یکی از ۸ تا ۱۲، ۱۲ تا ۱۶، ۱۶ تا ۲۰ یا ۲۰ تا ۲۴ باشد.");
        var today = DateOnly.FromDateTime(DateTimeOffset.UtcNow.ToOffset(tehran).DateTime);
        if (day < today) throw new ValidationException("تاریخ تحویل نمی‌تواند گذشته باشد.");
        var start = new DateTimeOffset(day.ToDateTime(TimeOnly.MinValue), tehran).AddHours(input.StartHour);
        order.DeliveryFrom = start;
        order.DeliveryTo = start.AddHours(4);
        return order;
    }

    public Order SellerDeliver(int id, string? code)
    {
        var order = Get(id);
        if (order.Status != OrderStatus.Approved) throw new ValidationException("سفارش آماده‌ی تحویل نیست.");
        if (order.DeliveryFrom is null) throw new ValidationException("راننده هنوز بازه‌ی تحویل را مشخص نکرده است.");
        var expectedCode = order.DeliveryCode?.Replace("BNPL-", "", StringComparison.OrdinalIgnoreCase);
        if (string.IsNullOrWhiteSpace(code) || !string.Equals(expectedCode, code.Trim(), StringComparison.OrdinalIgnoreCase))
            throw new ValidationException("کد تحویل با سفارش مطابقت ندارد.");
        order.Status = OrderStatus.AwaitingDriverConfirm;
        return order;
    }

    public Order DriverConfirm(int id)
    {
        var order = Get(id);
        if (order.Status != OrderStatus.AwaitingDriverConfirm) throw new ValidationException("فروشنده هنوز تحویل سفارش را تایید نکرده است.");
        order.Status = OrderStatus.Delivered;
        order.DeliveredAt = DateTimeOffset.UtcNow;
        return order;
    }

    public IReadOnlyList<Installment> Installments() => orders.GetInstallments().OrderBy(i => i.DueDate).ToList();

    public Installment ValidatePayment(int id)
    {
        var installment = orders.GetInstallment(id) ?? throw new NotFoundException("قسط یافت نشد.");
        if (installment.Status == "Paid") throw new ValidationException("این قسط قبلاً پرداخت شده است.");
        var order = Get(installment.OrderId);
        if (order.Status == OrderStatus.Rejected) throw new ValidationException("سفارش رد شده است.");
        if (order.Status == OrderStatus.AwaitingSellerApproval) throw new ValidationException("پیش‌فاکتور هنوز توسط فروشنده تایید نشده است.");
        if (installment.Number == 1 && order.Status != OrderStatus.AwaitingFirstPayment) throw new ValidationException("قسط اول در وضعیت پرداخت نیست.");
        if (installment.Number > 1 && order.Status is not (OrderStatus.Approved or OrderStatus.AwaitingDriverConfirm or OrderStatus.Delivered)) throw new ValidationException("ابتدا قسط اول باید پرداخت شود.");
        return installment;
    }

    public Installment CompleteVerifiedPayment(int id, string gateway)
    {
        var installment = orders.GetInstallment(id) ?? throw new NotFoundException("قسط یافت نشد.");
        if (installment.Status == "Paid") return installment;
        ValidatePayment(id);
        var order = Get(installment.OrderId);
        installment.Status = "Paid";
        installment.PaidAt = DateTimeOffset.UtcNow;
        installment.Gateway = gateway;
        if (installment.Number == 1 && order.Status == OrderStatus.AwaitingFirstPayment)
        {
            order.Status = OrderStatus.Approved;
            order.DeliveryCode = "BNPL-" + new string(Enumerable.Range(0, 5).Select(_ => CodeAlphabet[Random.Shared.Next(CodeAlphabet.Length)]).ToArray());
        }
        return installment;
    }

    private (List<OrderItem> Lines, List<(int ProductId, int Quantity)> Quantities) ResolveLines(List<OrderLineInput>? items, int shopId)
    {
        if (items is null || items.Count == 0) throw new ValidationException("سبد خرید خالی است.");
        var lines = new List<OrderItem>();
        var quantities = new List<(int, int)>();
        foreach (var item in items)
        {
            var product = products.Get(item.ProductId, shopId);
            if (product is null || item.Quantity < 1) throw new ValidationException("محصول یا تعداد نامعتبر است.");
            lines.Add(new OrderItem(product.Id, $"{product.Brand} {product.Model}", product.Size, item.Quantity, product.Price));
            quantities.Add((product.Id, item.Quantity));
        }
        return (lines, quantities);
    }

    private QuoteDto BuildQuote(List<OrderItem> lines, int shopId, string? paymentMode = "Installments", int installmentCount = 4, Credit? credit = null, bool allowCreditPreview = false)
    {
        var mode = string.Equals(paymentMode, "Cash", StringComparison.OrdinalIgnoreCase) ? "Cash" : "Installments";
        if (mode == "Installments" && installmentCount is not (2 or 4))
            throw new ValidationException("تعداد اقساط باید ۲، ۳ یا ۴ باشد.");
        var subtotal = lines.Sum(l => l.UnitPrice * l.Quantity);
        var count = mode == "Cash" ? 1 : installmentCount;
        var plan = mode == "Installments"
            ? installmentPlans.GetForStore(shopId, activeOnly: true).SingleOrDefault(item => item.InstallmentCount == installmentCount)
                ?? throw new ValidationException("این روش اقساطی برای فروشگاه فعال نیست.")
            : null;
        var availableCredit = credit?.Status == "Approved"
            ? Math.Max(0, credit.Limit - credit.Used)
            : 0;
        if (mode == "Installments" && availableCredit <= 0 && !allowCreditPreview)
            throw new ValidationException("اعتبار اقساطی فعالی ندارید؛ روش پرداخت نقدی را انتخاب کنید.");
        var creditEligible = mode == "Cash" || availableCredit > 0;
        var financedPrincipal = mode == "Cash" ? 0 : Math.Min(subtotal, creditEligible ? availableCredit : subtotal);
        var downPayment = mode == "Cash" ? 0 : subtotal - financedPrincipal;
        var fee = mode == "Cash" ? 0 : Math.Round(financedPrincipal * plan!.FeeRate);
        var total = subtotal + fee;
        var financedScheduleTotal = total - downPayment;
        var firstScheduled = count == 1 ? total : Math.Ceiling(financedScheduleTotal / count);
        var first = count == 1 ? firstScheduled : downPayment + firstScheduled;
        var next = count > 1 ? Math.Round((financedScheduleTotal - firstScheduled) / (count - 1)) : 0;
        var last = count > 1 ? financedScheduleTotal - firstScheduled - next * (count - 2) : 0;
        return new QuoteDto(subtotal, fee, total, downPayment, financedPrincipal, first, next, last, count, count == 1, mode, creditEligible);
    }
}
