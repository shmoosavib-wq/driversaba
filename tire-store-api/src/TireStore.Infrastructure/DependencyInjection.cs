using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using TireStore.Application.AdminAccess;
using TireStore.Application.Abstractions;
using TireStore.Application.Payments;

namespace TireStore.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        string databaseProvider,
        string connectionString,
        bool seedDemoData)
    {
        switch (databaseProvider.Trim().ToUpperInvariant())
        {
            case "SQLITE":
                var databasePath = connectionString.Split(';')
                    .FirstOrDefault(part => part.Trim().StartsWith("Data Source=", StringComparison.OrdinalIgnoreCase))?
                    .Split('=', 2)[1].Trim();
                if (!string.IsNullOrWhiteSpace(databasePath) && !databasePath.Equals(":memory:", StringComparison.OrdinalIgnoreCase))
                    Directory.CreateDirectory(Path.GetDirectoryName(Path.GetFullPath(databasePath))!);
                services.AddDbContextFactory<StoreDatabase>(options => options.UseSqlite(connectionString));
                break;
            case "SQLSERVER":
                services.AddDbContextFactory<StoreDatabase>(options => options.UseSqlServer(
                    connectionString,
                    sqlServer => sqlServer.MigrationsAssembly(typeof(StoreDatabase).Assembly.FullName)));
                break;
            default:
                throw new InvalidOperationException("Database:Provider must be Sqlite or SqlServer.");
        }

        services.AddSingleton<IAdminAccessRepository, AdminAccessStore>();
        services.AddSingleton<IAdminPasswordHasher, AdminPasswordHasher>();
        services.AddSingleton<AdminAccessService>();
        services.AddSingleton<EfStore>(sp => new EfStore(
            sp.GetRequiredService<IDbContextFactory<StoreDatabase>>(),
            seedDemoData));
        services.AddSingleton<IProductRepository>(sp => sp.GetRequiredService<EfStore>());
        services.AddSingleton<IBrandRepository>(sp => sp.GetRequiredService<EfStore>());
        services.AddSingleton<IShopRepository>(sp => sp.GetRequiredService<EfStore>());
        services.AddSingleton<InMemoryStore>();
        services.AddSingleton<ICreditRepository>(sp => sp.GetRequiredService<InMemoryStore>());
        services.AddSingleton<IOrderRepository>(sp => sp.GetRequiredService<InMemoryStore>());
        services.AddSingleton<HttpClient>();
        services.AddSingleton<TomanPaymentGateway>();
        services.AddSingleton<ITomanPaymentGateway>(sp => sp.GetRequiredService<TomanPaymentGateway>());
        return services;
    }
}
