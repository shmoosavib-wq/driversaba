using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TireStore.Application.AdminAccess;
using TireStore.Domain.Entities;

namespace TireStore.Infrastructure;

public sealed class AdminAccessStore(IDbContextFactory<StoreDatabase> databaseFactory) : IAdminAccessRepository
{
    public StoreAdminUser? FindUserByNormalizedUsername(string normalizedUsername)
    {
        using var db = databaseFactory.CreateDbContext();
        return db.StoreAdminUsers.AsNoTracking().SingleOrDefault(user => user.NormalizedUsername == normalizedUsername);
    }

    public StoreAdminUser? FindUserById(string userId)
    {
        using var db = databaseFactory.CreateDbContext();
        return db.StoreAdminUsers.AsNoTracking().SingleOrDefault(user => user.Id == userId);
    }

    public AdminPrincipal? GetPrincipal(string userId)
    {
        using var db = databaseFactory.CreateDbContext();
        var user = db.StoreAdminUsers.AsNoTracking().SingleOrDefault(item => item.Id == userId && item.IsActive);
        if (user is null) return null;

        var platformRoleIds = db.StoreAdminUserRoles.AsNoTracking()
            .Where(link => link.UserId == userId).Select(link => link.RoleId).ToList();
        var memberships = db.StoreAdminMemberships.AsNoTracking()
            .Where(membership => membership.UserId == userId && membership.IsActive)
            .Join(db.Stores.AsNoTracking().Where(store => store.IsActive), membership => membership.StoreId, store => store.Id,
                (membership, store) => new { membership.Id, membership.StoreId }).ToList();
        var membershipIds = memberships.Select(membership => membership.Id).ToList();
        var membershipRoleIds = db.StoreAdminMembershipRoles.AsNoTracking()
            .Where(link => membershipIds.Contains(link.MembershipId)).Select(link => link.RoleId).Distinct().ToList();
        var allRoleIds = platformRoleIds.Concat(membershipRoleIds).Distinct().ToList();
        var roles = db.StoreAdminRoles.AsNoTracking().Where(role => allRoleIds.Contains(role.Id)).ToList();
        var permissions = db.StoreAdminRolePermissions.AsNoTracking()
            .Where(link => allRoleIds.Contains(link.RoleId)).Select(link => link.PermissionCode)
            .Distinct().OrderBy(code => code).ToList();

        return new AdminPrincipal(
            user.Id,
            user.Username,
            user.DisplayName,
            user.SecurityStamp,
            user.MustChangePassword,
            roles.Select(role => role.Code).Distinct().OrderBy(code => code).ToList(),
            permissions,
            memberships.Select(membership => membership.StoreId).Distinct().OrderBy(id => id).ToList());
    }

    public bool HasPlatformSuperAdmin()
    {
        using var db = databaseFactory.CreateDbContext();
        return db.StoreAdminUserRoles.AsNoTracking().Any(link =>
            db.StoreAdminRoles.Any(role => role.Id == link.RoleId && role.Code == "platform.super-admin") &&
            db.StoreAdminUsers.Any(user => user.Id == link.UserId && user.IsActive));
    }

    public void CreatePlatformSuperAdmin(StoreAdminUser user)
    {
        using var db = databaseFactory.CreateDbContext();
        using var transaction = db.Database.BeginTransaction();
        var role = db.StoreAdminRoles.Single(item => item.Code == "platform.super-admin" && item.Scope == "platform");
        if (db.StoreAdminUserRoles.Any(link => link.RoleId == role.Id))
            throw new InvalidOperationException("مدیر کل اولیه قبلاً ساخته شده است.");
        db.StoreAdminUsers.Add(user);
        db.SaveChanges();
        db.StoreAdminUserRoles.Add(new StoreAdminUserRole { UserId = user.Id, RoleId = role.Id });
        db.StoreAdminAuditLogs.Add(new StoreAdminAuditLog
        {
            ActorUserId = user.Id,
            ActionCode = "platform.super-admin.bootstrap",
            TargetType = "user",
            TargetId = user.Id,
            CreatedAt = DateTimeOffset.UtcNow
        });
        db.SaveChanges();
        transaction.Commit();
    }

    public void IncrementFailedLogin(string userId, int lockoutThreshold, DateTimeOffset currentTime, DateTimeOffset lockoutUntilUtc)
    {
        using var db = databaseFactory.CreateDbContext();
        db.StoreAdminUsers
            .Where(user => user.Id == userId && (user.LockoutUntilUtc == null || user.LockoutUntilUtc <= currentTime))
            .ExecuteUpdate(update => update
                .SetProperty(user => user.FailedLoginCount, user => user.FailedLoginCount + 1)
                .SetProperty(user => user.LockoutUntilUtc, user =>
                    user.FailedLoginCount + 1 >= lockoutThreshold ? lockoutUntilUtc : user.LockoutUntilUtc));
    }

    public void ResetFailedLogin(string userId)
    {
        using var db = databaseFactory.CreateDbContext();
        db.StoreAdminUsers.Where(user => user.Id == userId).ExecuteUpdate(update => update
            .SetProperty(user => user.FailedLoginCount, 0)
            .SetProperty(user => user.LockoutUntilUtc, (DateTimeOffset?)null));
    }

    public void ReplacePassword(string userId, string passwordHash, string securityStamp)
    {
        using var db = databaseFactory.CreateDbContext();
        db.StoreAdminUsers.Where(user => user.Id == userId).ExecuteUpdate(update => update
            .SetProperty(user => user.PasswordHash, passwordHash)
            .SetProperty(user => user.SecurityStamp, securityStamp)
            .SetProperty(user => user.MustChangePassword, false)
            .SetProperty(user => user.FailedLoginCount, 0)
            .SetProperty(user => user.LockoutUntilUtc, (DateTimeOffset?)null));
    }

    public bool IsCurrentSessionValid(string userId, string securityStamp)
    {
        using var db = databaseFactory.CreateDbContext();
        return db.StoreAdminUsers.AsNoTracking().Any(user =>
            user.Id == userId && user.IsActive && user.SecurityStamp == securityStamp);
    }

    public bool HasPermission(string userId, string permissionCode, int? storeId)
    {
        using var db = databaseFactory.CreateDbContext();
        var permission = db.StoreAdminPermissions.AsNoTracking().SingleOrDefault(item => item.Code == permissionCode);
        if (permission is null) return false;

        var platformRoleIds = db.StoreAdminUserRoles.AsNoTracking().Where(link => link.UserId == userId)
            .Join(db.StoreAdminRoles.AsNoTracking().Where(role => role.Scope == "platform"), link => link.RoleId, role => role.Id,
                (link, role) => role.Id).ToList();
        var roleIds = platformRoleIds;
        if (permission.Scope == "store")
        {
            if (storeId is null || !db.Stores.AsNoTracking().Any(store => store.Id == storeId && store.IsActive)) return false;
            var membershipIds = db.StoreAdminMemberships.AsNoTracking()
                .Where(membership => membership.UserId == userId && membership.StoreId == storeId && membership.IsActive)
                .Select(membership => membership.Id).ToList();
            var storeRoleIds = db.StoreAdminMembershipRoles.AsNoTracking()
                .Where(link => membershipIds.Contains(link.MembershipId))
                .Join(db.StoreAdminRoles.AsNoTracking().Where(role => role.Scope == "store"), link => link.RoleId, role => role.Id,
                    (link, role) => role.Id).ToList();
            roleIds = roleIds.Concat(storeRoleIds).Distinct().ToList();
        }
        else if (storeId is not null)
        {
            return false;
        }

        return db.StoreAdminRolePermissions.AsNoTracking().Any(link =>
            roleIds.Contains(link.RoleId) && link.PermissionCode == permissionCode);
    }

    public IReadOnlyList<AdminStoreInfo> GetStores()
    {
        using var db = databaseFactory.CreateDbContext();
        var counts = db.StoreInventory.AsNoTracking().GroupBy(row => row.StoreId)
            .Select(group => new { StoreId = group.Key, Count = group.Count() })
            .ToDictionary(item => item.StoreId, item => item.Count);
        return db.Stores.AsNoTracking().OrderBy(store => store.Name)
            .Select(store => new AdminStoreInfo(store.Id, store.Name, store.Address, store.ContactPhone, store.IsActive,
                counts.GetValueOrDefault(store.Id))).ToList();
    }

    public AdminStoreInfo CreateStore(string name, string address, string contactPhone, string actorUserId)
    {
        using var db = databaseFactory.CreateDbContext();
        using var transaction = db.Database.BeginTransaction();
        var store = new StoreRow { Name = name, Address = address, ContactPhone = contactPhone, IsActive = true };
        db.Stores.Add(store);
        db.SaveChanges();
        AddAudit(db, actorUserId, "platform.store.create", "store", store.Id.ToString());
        db.SaveChanges();
        transaction.Commit();
        return new AdminStoreInfo(store.Id, store.Name, store.Address, store.ContactPhone, store.IsActive, 0);
    }

    public AdminStoreInfo UpdateStore(int storeId, string name, string address, string contactPhone, bool isActive, string actorUserId)
    {
        using var db = databaseFactory.CreateDbContext();
        using var transaction = db.Database.BeginTransaction();
        var store = db.Stores.SingleOrDefault(item => item.Id == storeId)
            ?? throw new KeyNotFoundException("فروشگاه پیدا نشد.");
        store.Name = name;
        store.Address = address;
        store.ContactPhone = contactPhone;
        store.IsActive = isActive;
        if (!isActive)
        {
            var memberIds = db.StoreAdminMemberships.Where(membership => membership.StoreId == storeId)
                .Select(membership => membership.UserId).ToList();
            foreach (var member in db.StoreAdminUsers.Where(user => memberIds.Contains(user.Id)).ToList())
                member.SecurityStamp = Guid.NewGuid().ToString("N");
        }
        AddAudit(db, actorUserId, isActive ? "platform.store.update" : "platform.store.deactivate", "store", store.Id.ToString());
        db.SaveChanges();
        transaction.Commit();
        var count = db.StoreInventory.AsNoTracking().Count(row => row.StoreId == storeId);
        return new AdminStoreInfo(store.Id, store.Name, store.Address, store.ContactPhone, store.IsActive, count);
    }

    public IReadOnlyList<AdminStoreUserInfo> GetStoreUsers(int? storeId)
    {
        using var db = databaseFactory.CreateDbContext();
        var query = from membership in db.StoreAdminMemberships.AsNoTracking()
                    join user in db.StoreAdminUsers.AsNoTracking() on membership.UserId equals user.Id
                    join membershipRole in db.StoreAdminMembershipRoles.AsNoTracking() on membership.Id equals membershipRole.MembershipId
                    join role in db.StoreAdminRoles.AsNoTracking() on membershipRole.RoleId equals role.Id
                    where storeId == null || membership.StoreId == storeId
                    orderby membership.CreatedAt descending
                    select new AdminStoreUserInfo(membership.Id, user.Id, membership.StoreId, user.Username, user.DisplayName,
                        role.Code, role.Name, membership.IsActive && user.IsActive, membership.CreatedAt);
        return query.ToList();
    }

    public IReadOnlyList<AdminRoleInfo> GetStoreRoles()
    {
        using var db = databaseFactory.CreateDbContext();
        return db.StoreAdminRoles.AsNoTracking().Where(role => role.Scope == "store")
            .OrderBy(role => role.Name).Select(role => new AdminRoleInfo(role.Code, role.Name)).ToList();
    }

    public AdminStoreUserInfo CreateStoreUser(StoreAdminUser user, int storeId, string roleCode, string actorUserId)
    {
        using var db = databaseFactory.CreateDbContext();
        using var transaction = db.Database.BeginTransaction();
        if (!db.Stores.Any(store => store.Id == storeId && store.IsActive))
            throw new KeyNotFoundException("فروشگاه فعال پیدا نشد.");
        var role = db.StoreAdminRoles.SingleOrDefault(item => item.Code == roleCode && item.Scope == "store")
            ?? throw new ArgumentException("نقش فروشگاهی معتبر نیست.");
        if (db.StoreAdminUsers.Any(item => item.NormalizedUsername == user.NormalizedUsername))
            throw new InvalidOperationException("این نام کاربری قبلاً ثبت شده است.");

        db.StoreAdminUsers.Add(user);
        db.SaveChanges();
        var membership = new StoreAdminMembership { UserId = user.Id, StoreId = storeId, IsActive = true };
        db.StoreAdminMemberships.Add(membership);
        db.SaveChanges();
        db.StoreAdminMembershipRoles.Add(new StoreAdminMembershipRole { MembershipId = membership.Id, RoleId = role.Id });
        AddAudit(db, actorUserId, "platform.store-user.create", "membership", membership.Id.ToString());
        db.SaveChanges();
        transaction.Commit();
        return new AdminStoreUserInfo(membership.Id, user.Id, storeId, user.Username, user.DisplayName,
            role.Code, role.Name, true, membership.CreatedAt);
    }

    public void SetMembershipActive(int membershipId, bool isActive, string actorUserId)
    {
        using var db = databaseFactory.CreateDbContext();
        using var transaction = db.Database.BeginTransaction();
        var membership = db.StoreAdminMemberships.SingleOrDefault(item => item.Id == membershipId)
            ?? throw new KeyNotFoundException("عضویت پیدا نشد.");
        membership.IsActive = isActive;
        var user = db.StoreAdminUsers.Single(item => item.Id == membership.UserId);
        user.SecurityStamp = Guid.NewGuid().ToString("N");
        AddAudit(db, actorUserId, isActive ? "platform.store-user.activate" : "platform.store-user.deactivate", "membership", membership.Id.ToString());
        db.SaveChanges();
        transaction.Commit();
    }

    private static void AddAudit(StoreDatabase db, string actorUserId, string actionCode, string targetType, string targetId) =>
        db.StoreAdminAuditLogs.Add(new StoreAdminAuditLog
        {
            ActorUserId = actorUserId,
            ActionCode = actionCode,
            TargetType = targetType,
            TargetId = targetId,
            CreatedAt = DateTimeOffset.UtcNow
        });
}

public sealed class AdminPasswordHasher : IAdminPasswordHasher
{
    private readonly PasswordHasher<StoreAdminUser> hasher = new();

    public string Hash(StoreAdminUser user, string password) => hasher.HashPassword(user, password);

    public bool Verify(StoreAdminUser user, string passwordHash, string password) =>
        hasher.VerifyHashedPassword(user, passwordHash, password) != PasswordVerificationResult.Failed;
}
