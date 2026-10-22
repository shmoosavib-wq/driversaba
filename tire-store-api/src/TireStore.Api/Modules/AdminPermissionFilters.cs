using System.Globalization;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using TireStore.Application.AdminAccess;

namespace TireStore.Api.Modules;

public static class AdminPermissionFilters
{
    public static RouteHandlerBuilder RequirePlatformPermission(this RouteHandlerBuilder endpoint, string permissionCode) =>
        endpoint.AddEndpointFilter((context, next) => Authorize(context, next, permissionCode, null));

    public static RouteHandlerBuilder RequireStorePermission(this RouteHandlerBuilder endpoint, string permissionCode) =>
        endpoint.AddEndpointFilter((context, next) => Authorize(context, next, permissionCode, GetStoreId));

    private static async ValueTask<object?> Authorize(
        EndpointFilterInvocationContext context,
        EndpointFilterDelegate next,
        string permissionCode,
        Func<HttpContext, int?>? getStoreId)
    {
        var userId = context.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        var storeId = getStoreId?.Invoke(context.HttpContext);
        if (userId is null || (getStoreId is not null && storeId is null))
            return Results.Forbid();

        var repository = context.HttpContext.RequestServices.GetRequiredService<IAdminAccessRepository>();
        if (!repository.HasPermission(userId, permissionCode, storeId))
            return Results.Forbid();

        return await next(context);
    }

    private static int? GetStoreId(HttpContext context)
    {
        var raw = context.Request.Query["shopId"].FirstOrDefault()
            ?? context.Request.Query["storeId"].FirstOrDefault();
        return int.TryParse(raw, NumberStyles.None, CultureInfo.InvariantCulture, out var storeId) && storeId > 0
            ? storeId
            : null;
    }
}
