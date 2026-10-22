namespace TireStore.Api.Modules;

public sealed record CreateStoreInput(string Name, string Address, string? ContactPhone);
public sealed record UpdateStoreInput(string Name, string Address, string? ContactPhone, bool IsActive);
public sealed record CreateStoreUserInput(string Username, string DisplayName, int StoreId, string RoleCode);
public sealed record MembershipActiveInput(bool IsActive);
