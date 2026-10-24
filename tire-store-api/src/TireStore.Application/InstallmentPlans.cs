using TireStore.Application.Abstractions;
using TireStore.Application.Common;
using TireStore.Domain.Entities;

namespace TireStore.Application.InstallmentPlans;

public sealed record InstallmentPlanDto(int StoreId, int InstallmentCount, decimal FeeRate, bool IsActive, DateTimeOffset UpdatedAt);
public sealed record InstallmentPlanInput(int InstallmentCount, decimal FeeRate, bool IsActive);
public sealed record SaveInstallmentPlansInput(IReadOnlyList<InstallmentPlanInput>? Plans);

public sealed class InstallmentPlanService(IInstallmentPlanRepository plans, IShopRepository shops)
{
    public IReadOnlyList<InstallmentPlanDto> GetForStore(int storeId, bool activeOnly = false)
    {
        EnsureStoreExists(storeId);
        return plans.GetForStore(storeId, activeOnly)
            .OrderBy(plan => plan.InstallmentCount)
            .Select(ToDto)
            .ToList();
    }

    public IReadOnlyList<InstallmentPlanDto> SaveForStore(int storeId, SaveInstallmentPlansInput input, string actorUserId)
    {
        EnsureStoreExists(storeId);
        if (string.IsNullOrWhiteSpace(actorUserId)) throw new ValidationException("کاربر مدیر معتبر نیست.");
        if (input.Plans is null || input.Plans.Count != 2 || input.Plans.Select(plan => plan.InstallmentCount).Order().SequenceEqual(new[] { 2, 4 }) is false)
            throw new ValidationException("برای هر فروشگاه باید تنظیم ۲ قسطه و ۴ قسطه ارسال شود.");
        if (input.Plans.Any(plan => plan.FeeRate is < 0 or > 1 || decimal.Round(plan.FeeRate, 4) != plan.FeeRate))
            throw new ValidationException("کارمزد باید بین صفر تا ۱۰۰ درصد و حداکثر تا چهار رقم اعشار باشد.");

        var updatedAt = DateTimeOffset.UtcNow;
        var records = input.Plans.Select(plan => new StoreInstallmentPlan
        {
            StoreId = storeId,
            InstallmentCount = plan.InstallmentCount,
            FeeRate = plan.FeeRate,
            IsActive = plan.IsActive,
            UpdatedAt = updatedAt,
            UpdatedBy = actorUserId
        }).ToList();
        plans.SaveForStore(storeId, records, actorUserId);
        return records.OrderBy(plan => plan.InstallmentCount).Select(ToDto).ToList();
    }

    private void EnsureStoreExists(int storeId)
    {
        if (storeId < 1 || shops.GetAll().All(shop => shop.Id != storeId))
            throw new NotFoundException("فروشگاه پیدا نشد.");
    }

    private static InstallmentPlanDto ToDto(StoreInstallmentPlan plan) =>
        new(plan.StoreId, plan.InstallmentCount, plan.FeeRate, plan.IsActive, plan.UpdatedAt);
}
