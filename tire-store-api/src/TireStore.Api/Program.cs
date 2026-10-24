using TireStore.Application;
using TireStore.Application.AdminAccess;
using TireStore.Application.Abstractions;
using TireStore.Application.Common;
using TireStore.Application.Credits;
using TireStore.Application.Orders;
using TireStore.Application.Payments;
using TireStore.Application.Products;
using TireStore.Application.InstallmentPlans;
using TireStore.Api.Modules;
using TireStore.Infrastructure;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

var bootstrapAdmin = args.Contains("--bootstrap-super-admin", StringComparer.Ordinal);
var migrateStoreDatabase = args.Contains("--migrate-store-database", StringComparer.Ordinal);
var hostArgs = args.Where(argument =>
    !string.Equals(argument, "--bootstrap-super-admin", StringComparison.Ordinal) &&
    !string.Equals(argument, "--migrate-store-database", StringComparison.Ordinal)).ToArray();
var builder = WebApplication.CreateBuilder(hostArgs);

var pricing = builder.Configuration.GetSection("Pricing").Get<PricingOptions>() ?? new PricingOptions();
var tomanPayment = builder.Configuration.GetSection("TomanPayment").Get<TomanPaymentOptions>() ?? new TomanPaymentOptions();
tomanPayment.AllowMock = builder.Environment.IsDevelopment() && tomanPayment.Mode.Equals("Mock", StringComparison.OrdinalIgnoreCase);
var databaseProvider = builder.Configuration["Database:Provider"] ??
    (builder.Environment.IsDevelopment() ? "Sqlite" : "SqlServer");
if (!databaseProvider.Equals("Sqlite", StringComparison.OrdinalIgnoreCase) &&
    !databaseProvider.Equals("SqlServer", StringComparison.OrdinalIgnoreCase))
    throw new InvalidOperationException("Database:Provider must be Sqlite or SqlServer.");
if (!builder.Environment.IsDevelopment() && !databaseProvider.Equals("SqlServer", StringComparison.OrdinalIgnoreCase))
    throw new InvalidOperationException("SQLite is supported only in Development. Configure the SQL Server provider for this environment.");
databaseProvider = databaseProvider.Equals("Sqlite", StringComparison.OrdinalIgnoreCase) ? "Sqlite" : "SqlServer";

var databaseConnection = databaseProvider.Equals("SqlServer", StringComparison.OrdinalIgnoreCase)
    ? builder.Configuration.GetConnectionString("StoreSqlServer")
    : builder.Configuration.GetConnectionString("StoreDatabase") ?? "Data Source=App_Data/tire-store.db";
if (string.IsNullOrWhiteSpace(databaseConnection))
    throw new InvalidOperationException("Configure ConnectionStrings:StoreSqlServer before starting with SQL Server.");

builder.Services.AddApplication(pricing).AddInfrastructure(
    databaseProvider,
    databaseConnection,
    builder.Environment.IsDevelopment());
builder.Services.AddSingleton(tomanPayment);

var origins = builder.Configuration.GetSection("Cors:Origins").Get<string[]>() ?? Array.Empty<string>();
if (origins.Length == 0 && builder.Environment.IsDevelopment())
    origins = ["http://localhost:5173", "http://localhost:3000"];
if (origins.Length == 0)
    throw new InvalidOperationException("Configure Cors:Origins with the explicit browser origins before starting outside Development.");
origins = origins.Select(origin =>
{
    if (!Uri.TryCreate(origin.Trim(), UriKind.Absolute, out var parsedOrigin) ||
        (parsedOrigin.Scheme != Uri.UriSchemeHttp && parsedOrigin.Scheme != Uri.UriSchemeHttps) ||
        parsedOrigin.AbsolutePath != "/" ||
        !string.IsNullOrEmpty(parsedOrigin.Query) ||
        !string.IsNullOrEmpty(parsedOrigin.Fragment) ||
        !string.IsNullOrEmpty(parsedOrigin.UserInfo))
        throw new InvalidOperationException("Cors:Origins must contain only absolute HTTP or HTTPS origins without paths or credentials.");
    if (!builder.Environment.IsDevelopment() && parsedOrigin.Scheme != Uri.UriSchemeHttps)
        throw new InvalidOperationException("Cors:Origins must use HTTPS outside Development.");
    return parsedOrigin.GetLeftPart(UriPartial.Authority);
}).Distinct(StringComparer.OrdinalIgnoreCase).ToArray();
builder.Services.AddCors(o => o.AddDefaultPolicy(p => p.WithOrigins(origins).AllowAnyHeader().AllowAnyMethod().AllowCredentials()));
builder.Services.AddAntiforgery(options =>
{
    options.HeaderName = "X-CSRF-TOKEN";
    options.Cookie.Name = "TireStore.Admin.Antiforgery";
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.Strict;
    options.Cookie.SecurePolicy = builder.Environment.IsDevelopment()
        ? CookieSecurePolicy.SameAsRequest
        : CookieSecurePolicy.Always;
});
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Cookie.Name = "TireStore.Admin.Session";
        options.Cookie.HttpOnly = true;
        options.Cookie.SameSite = SameSiteMode.Lax;
        options.Cookie.SecurePolicy = builder.Environment.IsDevelopment()
            ? CookieSecurePolicy.SameAsRequest
            : CookieSecurePolicy.Always;
        options.ExpireTimeSpan = TimeSpan.FromHours(8);
        options.SlidingExpiration = true;
        options.Events.OnRedirectToLogin = context =>
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return Task.CompletedTask;
        };
        options.Events.OnRedirectToAccessDenied = context =>
        {
            context.Response.StatusCode = StatusCodes.Status403Forbidden;
            return Task.CompletedTask;
        };
        options.Events.OnValidatePrincipal = context =>
        {
            var userId = context.Principal?.FindFirstValue(ClaimTypes.NameIdentifier);
            var stamp = context.Principal?.FindFirstValue("security_stamp");
            var repository = context.HttpContext.RequestServices.GetRequiredService<IAdminAccessRepository>();
            if (userId is null || stamp is null || !repository.IsCurrentSessionValid(userId, stamp))
            {
                context.RejectPrincipal();
                return context.HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            }
            return Task.CompletedTask;
        };
    });
builder.Services.AddAuthorization();

var app = builder.Build();

if (migrateStoreDatabase)
{
    if (!databaseProvider.Equals("SqlServer", StringComparison.OrdinalIgnoreCase))
        throw new InvalidOperationException("--migrate-store-database requires the SqlServer provider.");
    using var database = app.Services.GetRequiredService<IDbContextFactory<StoreDatabase>>().CreateDbContext();
    database.Database.Migrate();
    Console.WriteLine("Tire Store SQL Server migrations applied.");
    return;
}

_ = app.Services.GetRequiredService<EfStore>();

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.Use(async (context, next) =>
{
    try { await next(); }
    catch (ValidationException ex) { context.Response.StatusCode = 400; await context.Response.WriteAsJsonAsync(new { message = ex.Message }); }
    catch (NotFoundException ex) { context.Response.StatusCode = 404; await context.Response.WriteAsJsonAsync(new { message = ex.Message }); }
    catch (ArgumentException ex) { context.Response.StatusCode = 400; await context.Response.WriteAsJsonAsync(new { message = ex.Message }); }
    catch (KeyNotFoundException ex) { context.Response.StatusCode = 404; await context.Response.WriteAsJsonAsync(new { message = ex.Message }); }
    catch (InvalidOperationException ex) { context.Response.StatusCode = 409; await context.Response.WriteAsJsonAsync(new { message = ex.Message }); }
});

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));
app.MapGet("/health/ready", async (IDbContextFactory<StoreDatabase> databaseFactory, CancellationToken cancellationToken) =>
{
    try
    {
        await using var database = await databaseFactory.CreateDbContextAsync(cancellationToken);
        if (!await database.Database.CanConnectAsync(cancellationToken))
            return Results.StatusCode(StatusCodes.Status503ServiceUnavailable);
        if (database.Database.IsSqlServer() && (await database.Database.GetPendingMigrationsAsync(cancellationToken)).Any())
            return Results.StatusCode(StatusCodes.Status503ServiceUnavailable);
        return Results.Ok(new { status = "ready" });
    }
    catch (Exception)
    {
        return Results.StatusCode(StatusCodes.Status503ServiceUnavailable);
    }
});

if (bootstrapAdmin)
{
    var access = app.Services.GetRequiredService<AdminAccessService>();
    if (app.Services.GetRequiredService<IAdminAccessRepository>().HasPlatformSuperAdmin())
    {
        Console.Error.WriteLine("مدیر کل از قبل ساخته شده؛ این دستور فقط برای راه‌اندازی اولیه است.");
        return;
    }

    Console.Write("نام کاربری مدیر کل: ");
    var username = Console.ReadLine() ?? "";
    Console.Write("نام نمایشی: ");
    var displayName = Console.ReadLine() ?? "";
    Console.Write("رمز عبور (حداقل ۸ کاراکتر): ");
    var password = ReadHiddenPassword();
    Console.Write("تکرار رمز عبور: ");
    var passwordConfirmation = ReadHiddenPassword();
    if (!string.Equals(password, passwordConfirmation, StringComparison.Ordinal))
    {
        Console.Error.WriteLine("تکرار رمز عبور یکسان نیست.");
        return;
    }
    try
    {
        access.BootstrapPlatformSuperAdmin(username, displayName, password);
        Console.WriteLine("مدیر کل ساخته شد. دستور راه‌اندازی اولیه را دوباره اجرا نکنید.");
    }
    catch (Exception exception) when (exception is ArgumentException or InvalidOperationException)
    {
        Console.Error.WriteLine(exception.Message);
    }
    return;
}

app.MapAdminAuthentication();

var store = app.MapGroup("/api/store");
store.MapGet("/capabilities", () => Results.Ok(new { commerceEnabled = app.Environment.IsDevelopment() }));
store.MapGet("/shops", (IShopRepository shops) => shops.GetAll());
store.MapGet("/products", (ProductService svc, int? shopId, string? q) =>
    svc.List(new ProductQuery(q, shopId)));
store.MapGet("/installment-plans", (InstallmentPlanService service, int shopId) => service.GetForStore(shopId, activeOnly: true));
store.AllowAnonymous();

if (app.Environment.IsDevelopment())
{
    var driverCommerce = app.MapGroup("/api/store").AllowAnonymous();
    driverCommerce.MapGet("/credit", (CreditService svc) => svc.Get());
    driverCommerce.MapPost("/credit/request", (CreditService svc, CreditRequestInput input) => svc.Request(input));
    driverCommerce.MapPost("/orders/quote", (OrderService svc, QuoteInput input) => svc.Quote(input));
    driverCommerce.MapPost("/orders", (OrderService svc, CreateOrderInput input) => svc.Create(input));
    driverCommerce.MapGet("/orders", (OrderService svc) => svc.List());
    driverCommerce.MapGet("/orders/{id:int}", (OrderService svc, int id) => svc.Get(id));
    driverCommerce.MapPost("/orders/{id:int}/delivery-window", (OrderService svc, int id, DeliveryWindowInput input) => svc.SetDeliveryWindow(id, input));
    driverCommerce.MapPost("/orders/{id:int}/driver-confirm", (OrderService svc, int id) => svc.DriverConfirm(id));
    driverCommerce.MapGet("/installments", (OrderService svc, int? orderId) =>
        svc.Installments().Where(i => orderId is null || i.OrderId == orderId));
    app.MapTomanPaymentsModule();
    app.MapDevelopmentCredit();
}

var admin = app.MapGroup("/api/admin")
    .RequireAuthorization()
    .AddEndpointFilter(AdminAuthenticationModule.ValidateCsrf)
    .AddEndpointFilter(AdminAuthenticationModule.RequirePasswordChangeComplete);
if (app.Environment.IsDevelopment())
{
    admin.MapPost("/credit/approve", (CreditService svc, CreditApproveInput input) => svc.Approve(input))
        .RequirePlatformPermission("credit.requests.approve");
    admin.MapGet("/orders", (OrderService svc, int shopId) => svc.List().Where(order => order.ShopId == shopId))
        .RequireStorePermission("orders.read");
    admin.MapPost("/orders/{id:int}/approve", (OrderService svc, int id, int shopId) =>
    {
        var order = svc.Get(id);
        return order.ShopId != shopId ? Results.Forbid() : Results.Ok(svc.Approve(id));
    }).RequireStorePermission("orders.approve");
    admin.MapPost("/orders/{id:int}/reject", (OrderService svc, int id, int shopId) =>
    {
        var order = svc.Get(id);
        return order.ShopId != shopId ? Results.Forbid() : Results.Ok(svc.Reject(id));
    }).RequireStorePermission("orders.reject");
    admin.MapPost("/orders/{id:int}/seller-deliver", (OrderService svc, int id, int shopId, SellerDeliveryInput input) =>
    {
        var order = svc.Get(id);
        return order.ShopId != shopId ? Results.Forbid() : Results.Ok(svc.SellerDeliver(id, input.Code));
    }).RequireStorePermission("orders.deliver");
}
admin.MapGet("/products", (ProductService svc, string? q, int shopId, int? page, int? pageSize) =>
    svc.Search(new ProductQuery(q, shopId, page ?? 1, pageSize ?? 10)))
    .RequireStorePermission("catalog.products.read");
admin.MapGet("/product-brands", (ProductBrandService svc) => svc.GetActive())
    .RequireStorePermission("catalog.products.read");
admin.MapGet("/products/{id:int}", (ProductService svc, int id, int shopId) => svc.Get(id, shopId))
    .RequireStorePermission("catalog.products.read");
admin.MapPost("/products", (ProductService svc, ProductInput input, int shopId) => Results.Ok(svc.Create(input, shopId)))
    .RequireStorePermission("catalog.products.create");
admin.MapPut("/products/{id:int}", (ProductService svc, int id, ProductInput input, int shopId) => svc.Update(id, input, shopId))
    .RequireStorePermission("catalog.products.update");
admin.MapDelete("/products/{id:int}", (ProductService svc, int id, int shopId) =>
{
    svc.Delete(id, shopId);
    return Results.NoContent();
}).RequireStorePermission("catalog.products.delete");

admin.MapGet("/installment-plans", (InstallmentPlanService service, int shopId) => service.GetForStore(shopId))
    .RequirePlatformPermission("platform.installment-plans.manage");
admin.MapPut("/installment-plans/{storeId:int}", (InstallmentPlanService service, int storeId, SaveInstallmentPlansInput input, ClaimsPrincipal user) =>
{
    var actorId = user.FindFirstValue(ClaimTypes.NameIdentifier)!;
    return Results.Ok(service.SaveForStore(storeId, input, actorId));
}).RequirePlatformPermission("platform.installment-plans.manage");

var accessAdmin = admin.MapGroup("/access");
accessAdmin.MapGet("/stores", (AdminAccessService service) => service.GetStores())
    .RequirePlatformPermission("platform.stores.manage");
accessAdmin.MapPost("/stores", (AdminAccessService service, CreateStoreInput input, ClaimsPrincipal user) =>
{
    var actorId = user.FindFirstValue(ClaimTypes.NameIdentifier)!;
    return Results.Ok(service.CreateStore(input.Name, input.Address, input.ContactPhone, actorId));
}).RequirePlatformPermission("platform.stores.manage");
accessAdmin.MapPut("/stores/{storeId:int}", (AdminAccessService service, int storeId, UpdateStoreInput input, ClaimsPrincipal user) =>
{
    var actorId = user.FindFirstValue(ClaimTypes.NameIdentifier)!;
    return Results.Ok(service.UpdateStore(storeId, input.Name, input.Address, input.ContactPhone, input.IsActive, actorId));
}).RequirePlatformPermission("platform.stores.manage");
accessAdmin.MapGet("/roles", (AdminAccessService service) => service.GetStoreRoles())
    .RequirePlatformPermission("platform.access.manage");
accessAdmin.MapGet("/users", (AdminAccessService service, int? storeId) => service.GetStoreUsers(storeId))
    .RequirePlatformPermission("platform.users.manage");
accessAdmin.MapPost("/users", (AdminAccessService service, CreateStoreUserInput input, ClaimsPrincipal user) =>
{
    var actorId = user.FindFirstValue(ClaimTypes.NameIdentifier)!;
    return Results.Ok(service.CreateStoreUser(input.Username, input.DisplayName, input.StoreId, input.RoleCode, actorId));
}).RequirePlatformPermission("platform.users.manage");
accessAdmin.MapPut("/users/{membershipId:int}/active", (AdminAccessService service, int membershipId, MembershipActiveInput input, ClaimsPrincipal user) =>
{
    var actorId = user.FindFirstValue(ClaimTypes.NameIdentifier)!;
    service.SetMembershipActive(membershipId, input.IsActive, actorId);
    return Results.NoContent();
}).RequirePlatformPermission("platform.users.manage");

app.Run();

static string ReadHiddenPassword()
{
    var password = new System.Text.StringBuilder();
    while (true)
    {
        var key = Console.ReadKey(intercept: true);
        if (key.Key == ConsoleKey.Enter)
        {
            Console.WriteLine();
            return password.ToString();
        }
        if (key.Key == ConsoleKey.Backspace)
        {
            if (password.Length > 0) password.Length--;
            continue;
        }
        if (!char.IsControl(key.KeyChar)) password.Append(key.KeyChar);
    }
}
