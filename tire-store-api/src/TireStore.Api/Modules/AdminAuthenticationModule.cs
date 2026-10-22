using System.Security.Claims;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using TireStore.Application.AdminAccess;

namespace TireStore.Api.Modules;

public sealed record AdminLoginInput(string? Username, string? Password);
public sealed record ChangePasswordInput(string? CurrentPassword, string? NewPassword);

public static class AdminAuthenticationModule
{
    public static RouteGroupBuilder MapAdminAuthentication(this IEndpointRouteBuilder endpoints)
    {
        var auth = endpoints.MapGroup("/api/admin/auth").AddEndpointFilter(ValidateCsrf);

        auth.MapGet("/csrf", (HttpContext context, IAntiforgery antiforgery) =>
        {
            var tokens = antiforgery.GetAndStoreTokens(context);
            return Results.Ok(new { requestToken = tokens.RequestToken });
        }).AllowAnonymous();

        auth.MapPost("/login", async (HttpContext context, AdminAccessService service, AdminLoginInput input) =>
        {
            var result = service.Authenticate(input.Username ?? "", input.Password ?? "");
            if (!result.Succeeded || result.Principal is null)
                return Results.Json(new { message = "نام کاربری یا رمز عبور نادرست است." }, statusCode: StatusCodes.Status401Unauthorized);

            var identity = CreateIdentity(result.Principal);
            await context.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(identity));
            return Results.Ok(ToSession(result.Principal));
        }).AllowAnonymous();

        auth.MapGet("/me", (ClaimsPrincipal user, AdminAccessService service) =>
        {
            var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
            var principal = userId is null ? null : service.GetPrincipal(userId);
            return principal is null ? Results.Unauthorized() : Results.Ok(ToSession(principal));
        }).RequireAuthorization();

        auth.MapPost("/logout", async (HttpContext context) =>
        {
            await context.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Results.NoContent();
        }).RequireAuthorization();

        auth.MapPost("/change-password", async (HttpContext context, ClaimsPrincipal user, AdminAccessService service, ChangePasswordInput input) =>
        {
            var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId is null) return Results.Unauthorized();
            var principal = service.ChangePassword(userId, input.CurrentPassword ?? "", input.NewPassword ?? "");
            await context.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(CreateIdentity(principal)));
            return Results.Ok(ToSession(principal));
        }).RequireAuthorization();

        return auth;
    }

    public static async ValueTask<object?> ValidateCsrf(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        var method = context.HttpContext.Request.Method;
        if (HttpMethods.IsGet(method) || HttpMethods.IsHead(method) || HttpMethods.IsOptions(method))
            return await next(context);

        try
        {
            var antiforgery = context.HttpContext.RequestServices.GetRequiredService<IAntiforgery>();
            await antiforgery.ValidateRequestAsync(context.HttpContext);
        }
        catch (AntiforgeryValidationException)
        {
            return Results.BadRequest(new { message = "درخواست معتبر نیست؛ صفحه را تازه‌سازی کنید." });
        }

        return await next(context);
    }

    public static async ValueTask<object?> RequirePasswordChangeComplete(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        if (context.HttpContext.User.FindFirstValue("must_change_password") == "true")
            return Results.Json(new { message = "برای ادامه ابتدا رمز موقت را تغییر دهید.", code = "PASSWORD_CHANGE_REQUIRED" }, statusCode: StatusCodes.Status403Forbidden);
        return await next(context);
    }

    public static ClaimsIdentity CreateIdentity(AdminPrincipal principal)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, principal.UserId),
            new(ClaimTypes.Name, principal.Username),
            new("display_name", principal.DisplayName),
            new("security_stamp", principal.SecurityStamp),
            new("must_change_password", principal.MustChangePassword ? "true" : "false")
        };
        claims.AddRange(principal.Roles.Select(role => new Claim(ClaimTypes.Role, role)));
        claims.AddRange(principal.Permissions.Select(permission => new Claim("permission", permission)));
        claims.AddRange(principal.StoreIds.Select(storeId => new Claim("store_id", storeId.ToString())));
        return new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
    }

    private static object ToSession(AdminPrincipal principal) => new
    {
        userId = principal.UserId,
        username = principal.Username,
        displayName = principal.DisplayName,
        roles = principal.Roles,
        permissions = principal.Permissions,
        storeIds = principal.StoreIds,
        mustChangePassword = principal.MustChangePassword
    };
}
