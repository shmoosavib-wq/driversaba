using Microsoft.EntityFrameworkCore;
using TireStore.Application.Abstractions;
using TireStore.Domain.Entities;

namespace TireStore.Infrastructure;

public sealed class EfInstallmentPlanRepository(IDbContextFactory<StoreDatabase> databaseFactory) : IInstallmentPlanRepository
{
    public IReadOnlyList<StoreInstallmentPlan> GetForStore(int storeId, bool activeOnly = false)
    {
        using var db = databaseFactory.CreateDbContext();
        var query = db.StoreInstallmentPlans.AsNoTracking().Where(plan => plan.StoreId == storeId);
        if (activeOnly) query = query.Where(plan => plan.IsActive);
        return query.OrderBy(plan => plan.InstallmentCount).ToList();
    }

    public void SaveForStore(int storeId, IReadOnlyList<StoreInstallmentPlan> plans, string actorUserId)
    {
        using var db = databaseFactory.CreateDbContext();
        using var transaction = db.Database.BeginTransaction();
        if (!db.Stores.Any(store => store.Id == storeId))
            throw new KeyNotFoundException("فروشگاه پیدا نشد.");

        foreach (var submitted in plans)
        {
            var existing = db.StoreInstallmentPlans.SingleOrDefault(plan =>
                plan.StoreId == storeId && plan.InstallmentCount == submitted.InstallmentCount);
            if (existing is null)
            {
                db.StoreInstallmentPlans.Add(submitted);
                continue;
            }

            existing.FeeRate = submitted.FeeRate;
            existing.IsActive = submitted.IsActive;
            existing.UpdatedAt = submitted.UpdatedAt;
            existing.UpdatedBy = actorUserId;
        }

        db.StoreAdminAuditLogs.Add(new StoreAdminAuditLog
        {
            ActorUserId = actorUserId,
            ActionCode = "store.installment-plans.update",
            TargetType = "store",
            TargetId = storeId.ToString(System.Globalization.CultureInfo.InvariantCulture),
            CreatedAt = DateTimeOffset.UtcNow
        });
        db.SaveChanges();
        transaction.Commit();
    }
}
