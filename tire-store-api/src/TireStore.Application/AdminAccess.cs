using TireStore.Domain.Entities;
using System.Security.Cryptography;

namespace TireStore.Application.AdminAccess;

public sealed record AdminPrincipal(
    string UserId,
    string Username,
    string DisplayName,
    string SecurityStamp,
    bool MustChangePassword,
    IReadOnlyList<string> Roles,
    IReadOnlyList<string> Permissions,
    IReadOnlyList<int> StoreIds);

public sealed record AdminLoginResult(bool Succeeded, AdminPrincipal? Principal);
public sealed record AdminStoreInfo(int Id, string Name, string Address, string ContactPhone, bool IsActive, int ProductCount);
public sealed record AdminRoleInfo(string Code, string Name);
public sealed record AdminStoreUserInfo(int MembershipId, string UserId, int StoreId, string Username, string DisplayName,
    string RoleCode, string RoleName, bool IsActive, DateTimeOffset CreatedAt);
public sealed record CreatedStoreUser(AdminStoreUserInfo User, string TemporaryPassword);

public interface IAdminAccessRepository
{
    StoreAdminUser? FindUserByNormalizedUsername(string normalizedUsername);
    StoreAdminUser? FindUserById(string userId);
    AdminPrincipal? GetPrincipal(string userId);
    bool HasPlatformSuperAdmin();
    void CreatePlatformSuperAdmin(StoreAdminUser user);
    void IncrementFailedLogin(string userId, int lockoutThreshold, DateTimeOffset currentTime, DateTimeOffset lockoutUntilUtc);
    void ResetFailedLogin(string userId);
    void ReplacePassword(string userId, string passwordHash, string securityStamp);
    bool IsCurrentSessionValid(string userId, string securityStamp);
    bool HasPermission(string userId, string permissionCode, int? storeId);
    IReadOnlyList<AdminStoreInfo> GetStores();
    AdminStoreInfo CreateStore(string name, string address, string contactPhone, string actorUserId);
    AdminStoreInfo UpdateStore(int storeId, string name, string address, string contactPhone, bool isActive, string actorUserId);
    IReadOnlyList<AdminStoreUserInfo> GetStoreUsers(int? storeId);
    IReadOnlyList<AdminRoleInfo> GetStoreRoles();
    AdminStoreUserInfo CreateStoreUser(StoreAdminUser user, int storeId, string roleCode, string actorUserId);
    void SetMembershipActive(int membershipId, bool isActive, string actorUserId);
}

public interface IAdminPasswordHasher
{
    string Hash(StoreAdminUser user, string password);
    bool Verify(StoreAdminUser user, string passwordHash, string password);
}

public sealed class AdminAccessService(IAdminAccessRepository repository, IAdminPasswordHasher passwordHasher)
{
    private const int MaxFailedAttempts = 5;
    private static readonly TimeSpan LockoutDuration = TimeSpan.FromMinutes(15);

    public AdminLoginResult Authenticate(string username, string password)
    {
        var normalizedUsername = NormalizeUsername(username);
        if (normalizedUsername.Length == 0 || password.Length == 0)
            return new AdminLoginResult(false, null);

        var user = repository.FindUserByNormalizedUsername(normalizedUsername);
        if (user is null || !user.IsActive || user.LockoutUntilUtc > DateTimeOffset.UtcNow)
            return new AdminLoginResult(false, null);

        if (!passwordHasher.Verify(user, user.PasswordHash, password))
        {
            var currentTime = DateTimeOffset.UtcNow;
            repository.IncrementFailedLogin(user.Id, MaxFailedAttempts, currentTime, currentTime.Add(LockoutDuration));
            return new AdminLoginResult(false, null);
        }

        repository.ResetFailedLogin(user.Id);
        return new AdminLoginResult(true, repository.GetPrincipal(user.Id));
    }

    public void BootstrapPlatformSuperAdmin(string username, string displayName, string password)
    {
        if (repository.HasPlatformSuperAdmin())
            throw new InvalidOperationException("مدیر کل قبلاً ساخته شده است.");

        var normalizedUsername = NormalizeUsername(username);
        var safeDisplayName = displayName.Trim();
        if (normalizedUsername.Length is < 3 or > 64 || safeDisplayName.Length is < 2 or > 120)
            throw new ArgumentException("نام کاربری یا نام نمایشی معتبر نیست.");
        if (password.Length < 8)
            throw new ArgumentException("رمز عبور مدیر کل باید حداقل ۸ کاراکتر باشد.");
        if (repository.FindUserByNormalizedUsername(normalizedUsername) is not null)
            throw new InvalidOperationException("این نام کاربری قبلاً ثبت شده است.");

        var user = new StoreAdminUser
        {
            Username = username.Trim(),
            NormalizedUsername = normalizedUsername,
            DisplayName = safeDisplayName,
            IsActive = true,
            MustChangePassword = false
        };
        user.PasswordHash = passwordHasher.Hash(user, password);
        repository.CreatePlatformSuperAdmin(user);
    }

    public AdminPrincipal? GetPrincipal(string userId) => repository.GetPrincipal(userId);

    public bool IsCurrentSessionValid(string userId, string securityStamp) =>
        repository.IsCurrentSessionValid(userId, securityStamp);

    public bool HasPermission(string userId, string permissionCode, int? storeId) =>
        repository.HasPermission(userId, permissionCode, storeId);

    public IReadOnlyList<AdminStoreInfo> GetStores() => repository.GetStores();

    public AdminStoreInfo CreateStore(string name, string address, string? contactPhone, string actorUserId)
    {
        var normalizedName = name.Trim();
        var normalizedAddress = address.Trim();
        if (normalizedName.Length is < 2 or > 160 || normalizedAddress.Length is < 5 or > 300)
            throw new ArgumentException("نام فروشگاه یا نشانی معتبر نیست.");
        return repository.CreateStore(normalizedName, normalizedAddress, contactPhone?.Trim() ?? "", actorUserId);
    }

    public AdminStoreInfo UpdateStore(int storeId, string name, string address, string? contactPhone, bool isActive, string actorUserId)
    {
        var normalizedName = name.Trim();
        var normalizedAddress = address.Trim();
        if (storeId < 1 || normalizedName.Length is < 2 or > 160 || normalizedAddress.Length is < 5 or > 300)
            throw new ArgumentException("اطلاعات فروشگاه معتبر نیست.");
        return repository.UpdateStore(storeId, normalizedName, normalizedAddress, contactPhone?.Trim() ?? "", isActive, actorUserId);
    }

    public IReadOnlyList<AdminStoreUserInfo> GetStoreUsers(int? storeId) => repository.GetStoreUsers(storeId);

    public IReadOnlyList<AdminRoleInfo> GetStoreRoles() => repository.GetStoreRoles();

    public CreatedStoreUser CreateStoreUser(string username, string displayName, int storeId, string roleCode, string actorUserId)
    {
        var normalizedUsername = NormalizeUsername(username);
        var safeDisplayName = displayName.Trim();
        if (normalizedUsername.Length is < 3 or > 64 || safeDisplayName.Length is < 2 or > 120 || storeId < 1)
            throw new ArgumentException("مشخصات کاربر معتبر نیست.");
        if (!repository.GetStoreRoles().Any(role => role.Code == roleCode))
            throw new ArgumentException("نقش انتخاب‌شده معتبر نیست.");
        if (repository.FindUserByNormalizedUsername(normalizedUsername) is not null)
            throw new InvalidOperationException("این نام کاربری قبلاً ثبت شده است.");

        var temporaryPassword = Convert.ToBase64String(RandomNumberGenerator.GetBytes(24))
            .TrimEnd('=').Replace('+', '-').Replace('/', '_');
        var user = new StoreAdminUser
        {
            Username = username.Trim(),
            NormalizedUsername = normalizedUsername,
            DisplayName = safeDisplayName,
            IsActive = true,
            MustChangePassword = true
        };
        user.PasswordHash = passwordHasher.Hash(user, temporaryPassword);
        var created = repository.CreateStoreUser(user, storeId, roleCode, actorUserId);
        return new CreatedStoreUser(created, temporaryPassword);
    }

    public void SetMembershipActive(int membershipId, bool isActive, string actorUserId) =>
        repository.SetMembershipActive(membershipId, isActive, actorUserId);

    public AdminPrincipal ChangePassword(string userId, string currentPassword, string newPassword)
    {
        var user = repository.FindUserById(userId);
        if (user is null || !user.IsActive || !passwordHasher.Verify(user, user.PasswordHash, currentPassword))
            throw new InvalidOperationException("رمز فعلی نادرست است.");
        if (newPassword.Length < 8)
            throw new ArgumentException("رمز عبور جدید باید حداقل ۸ کاراکتر باشد.");
        user.SecurityStamp = Guid.NewGuid().ToString("N");
        repository.ReplacePassword(userId, passwordHasher.Hash(user, newPassword), user.SecurityStamp);
        return repository.GetPrincipal(userId) ?? throw new InvalidOperationException("حساب کاربری فعال نیست.");
    }

    private static string NormalizeUsername(string username) => username.Trim().ToUpperInvariant();
}
