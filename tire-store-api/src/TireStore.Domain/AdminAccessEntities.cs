namespace TireStore.Domain.Entities;

public sealed class StoreAdminUser
{
    public string Id { get; set; } = Guid.NewGuid().ToString("N");
    public string Username { get; set; } = "";
    public string NormalizedUsername { get; set; } = "";
    public string DisplayName { get; set; } = "";
    public string PasswordHash { get; set; } = "";
    public string SecurityStamp { get; set; } = Guid.NewGuid().ToString("N");
    public bool IsActive { get; set; } = true;
    public bool MustChangePassword { get; set; }
    public int FailedLoginCount { get; set; }
    public DateTimeOffset? LockoutUntilUtc { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
}

public sealed class StoreAdminRole
{
    public int Id { get; set; }
    public string Code { get; set; } = "";
    public string Name { get; set; } = "";
    public string Scope { get; set; } = "";
}

public sealed class StoreAdminPermission
{
    public string Code { get; set; } = "";
    public string Name { get; set; } = "";
    public string Scope { get; set; } = "";
}

public sealed class StoreAdminUserRole
{
    public string UserId { get; set; } = "";
    public StoreAdminUser User { get; set; } = null!;
    public int RoleId { get; set; }
    public StoreAdminRole Role { get; set; } = null!;
}

public sealed class StoreAdminMembership
{
    public int Id { get; set; }
    public string UserId { get; set; } = "";
    public StoreAdminUser User { get; set; } = null!;
    public int StoreId { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
}

public sealed class StoreAdminMembershipRole
{
    public int MembershipId { get; set; }
    public StoreAdminMembership Membership { get; set; } = null!;
    public int RoleId { get; set; }
    public StoreAdminRole Role { get; set; } = null!;
}

public sealed class StoreAdminRolePermission
{
    public int RoleId { get; set; }
    public StoreAdminRole Role { get; set; } = null!;
    public string PermissionCode { get; set; } = "";
    public StoreAdminPermission Permission { get; set; } = null!;
}

public sealed class StoreAdminAuditLog
{
    public long Id { get; set; }
    public string ActorUserId { get; set; } = "";
    public string ActionCode { get; set; } = "";
    public string TargetType { get; set; } = "";
    public string TargetId { get; set; } = "";
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
}
