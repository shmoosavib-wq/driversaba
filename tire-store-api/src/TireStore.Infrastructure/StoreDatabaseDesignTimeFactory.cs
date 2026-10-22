using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace TireStore.Infrastructure;

public sealed class StoreDatabaseDesignTimeFactory : IDesignTimeDbContextFactory<StoreDatabase>
{
    public StoreDatabase CreateDbContext(string[] args)
    {
        var connectionString = Environment.GetEnvironmentVariable("ConnectionStrings__StoreSqlServer");
        if (string.IsNullOrWhiteSpace(connectionString))
            throw new InvalidOperationException("Set ConnectionStrings__StoreSqlServer when creating or applying SQL Server migrations.");

        var options = new DbContextOptionsBuilder<StoreDatabase>()
            .UseSqlServer(connectionString, sqlServer =>
                sqlServer.MigrationsAssembly(typeof(StoreDatabase).Assembly.FullName))
            .Options;

        return new StoreDatabase(options);
    }
}
