using TireStore.Application.Abstractions;
using TireStore.Application.Common;
using TireStore.Application.Orders;
using TireStore.Domain.Entities;

namespace TireStore.Application.Credits;

public sealed record CreditDto(decimal Limit, decimal Used, string Status, decimal FeeRate, int Installments, bool FirstPaymentAtPurchase, int? FleetId, bool LimitEnforced);

public sealed record CreditApproveInput(decimal Limit);

public sealed record CreditRequestInput(int FleetId, decimal Amount);

public sealed class CreditService(ICreditRepository credits, PricingOptions pricing)
{
    public CreditDto Get()
    {
        var credit = credits.Get();
        return new CreditDto(credit.Limit, credit.Used, credit.Status, pricing.FeeRate, pricing.Installments, true, credits.GetRequest()?.FleetId, pricing.EnforceCreditLimit);
    }

    public CreditDto Approve(CreditApproveInput input)
    {
        if (credits.GetRequest() is null) throw new ValidationException("درخواست اعتباری ثبت نشده است.");
        if (input.Limit <= 0) throw new ValidationException("سقف اعتبار نامعتبر است.");
        credits.Approve(input.Limit);
        return Get();
    }

    public CreditRequestState Request(CreditRequestInput input)
    {
        if (input.FleetId <= 0 || input.Amount <= 0) throw new ValidationException("ناوگان و مبلغ اعتبار الزامی است.");
        var state = new CreditRequestState(input.FleetId, input.Amount, "Pending", DateTimeOffset.UtcNow);
        credits.SetRequest(state);
        return state;
    }
}
