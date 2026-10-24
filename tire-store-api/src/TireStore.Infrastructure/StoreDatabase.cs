using System.Text.Json;
using System.Data;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using TireStore.Application.Abstractions;
using TireStore.Application.Common;
using TireStore.Domain.Entities;

namespace TireStore.Infrastructure;

public sealed class StoreDatabase(DbContextOptions<StoreDatabase> options) : DbContext(options)
{
    public DbSet<StoreRow> Stores => Set<StoreRow>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductBrand> ProductBrands => Set<ProductBrand>();
    public DbSet<StoreInventoryRow> StoreInventory => Set<StoreInventoryRow>();
    public DbSet<StoreInstallmentPlan> StoreInstallmentPlans => Set<StoreInstallmentPlan>();
    public DbSet<StoreAdminUser> StoreAdminUsers => Set<StoreAdminUser>();
    public DbSet<StoreAdminRole> StoreAdminRoles => Set<StoreAdminRole>();
    public DbSet<StoreAdminPermission> StoreAdminPermissions => Set<StoreAdminPermission>();
    public DbSet<StoreAdminUserRole> StoreAdminUserRoles => Set<StoreAdminUserRole>();
    public DbSet<StoreAdminMembership> StoreAdminMemberships => Set<StoreAdminMembership>();
    public DbSet<StoreAdminMembershipRole> StoreAdminMembershipRoles => Set<StoreAdminMembershipRole>();
    public DbSet<StoreAdminRolePermission> StoreAdminRolePermissions => Set<StoreAdminRolePermission>();
    public DbSet<StoreAdminAuditLog> StoreAdminAuditLogs => Set<StoreAdminAuditLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var imagesConverter = new ValueConverter<List<string>, string>(
            images => JsonSerializer.Serialize(images, (JsonSerializerOptions?)null),
            json => JsonSerializer.Deserialize<List<string>>(json, (JsonSerializerOptions?)null) ?? new List<string>());

        modelBuilder.Entity<StoreRow>(entity =>
        {
            entity.ToTable("Stores");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Name).HasMaxLength(160).IsRequired();
            entity.Property(x => x.Address).HasMaxLength(300).IsRequired();
            entity.Property(x => x.ContactPhone).HasMaxLength(32);
        });

        modelBuilder.Entity<StoreInstallmentPlan>(entity =>
        {
            entity.ToTable("StoreInstallmentPlans");
            entity.HasKey(x => new { x.StoreId, x.InstallmentCount });
            entity.Property(x => x.FeeRate).HasPrecision(9, 6);
            entity.Property(x => x.UpdatedBy).HasMaxLength(64).IsRequired();
            entity.HasOne<StoreRow>().WithMany().HasForeignKey(x => x.StoreId).OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(x => new { x.StoreId, x.IsActive });
        });

        modelBuilder.Entity<StoreAdminUser>(entity =>
        {
            entity.ToTable("StoreAdminUsers");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Username).HasMaxLength(64).IsRequired();
            entity.Property(x => x.NormalizedUsername).HasMaxLength(64).IsRequired();
            entity.Property(x => x.DisplayName).HasMaxLength(120).IsRequired();
            entity.Property(x => x.PasswordHash).IsRequired();
            entity.Property(x => x.SecurityStamp).HasMaxLength(64).IsRequired();
            entity.HasIndex(x => x.NormalizedUsername).IsUnique();
        });

        modelBuilder.Entity<StoreAdminRole>(entity =>
        {
            entity.ToTable("StoreAdminRoles");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Code).HasMaxLength(100).IsRequired();
            entity.Property(x => x.Name).HasMaxLength(120).IsRequired();
            entity.Property(x => x.Scope).HasMaxLength(20).IsRequired();
            entity.HasIndex(x => new { x.Code, x.Scope }).IsUnique();
        });

        modelBuilder.Entity<StoreAdminPermission>(entity =>
        {
            entity.ToTable("StoreAdminPermissions");
            entity.HasKey(x => x.Code);
            entity.Property(x => x.Code).HasMaxLength(120);
            entity.Property(x => x.Name).HasMaxLength(160).IsRequired();
            entity.Property(x => x.Scope).HasMaxLength(20).IsRequired();
        });

        modelBuilder.Entity<StoreAdminUserRole>(entity =>
        {
            entity.ToTable("StoreAdminUserRoles");
            entity.HasKey(x => new { x.UserId, x.RoleId });
            entity.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(x => x.Role).WithMany().HasForeignKey(x => x.RoleId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<StoreAdminMembership>(entity =>
        {
            entity.ToTable("StoreAdminMemberships");
            entity.HasKey(x => x.Id);
            entity.HasIndex(x => new { x.UserId, x.StoreId }).IsUnique();
            entity.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne<StoreRow>().WithMany().HasForeignKey(x => x.StoreId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<StoreAdminMembershipRole>(entity =>
        {
            entity.ToTable("StoreAdminMembershipRoles");
            entity.HasKey(x => new { x.MembershipId, x.RoleId });
            entity.HasOne(x => x.Membership).WithMany().HasForeignKey(x => x.MembershipId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(x => x.Role).WithMany().HasForeignKey(x => x.RoleId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<StoreAdminRolePermission>(entity =>
        {
            entity.ToTable("StoreAdminRolePermissions");
            entity.HasKey(x => new { x.RoleId, x.PermissionCode });
            entity.HasOne(x => x.Role).WithMany().HasForeignKey(x => x.RoleId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(x => x.Permission).WithMany().HasForeignKey(x => x.PermissionCode).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<StoreAdminAuditLog>(entity =>
        {
            entity.ToTable("StoreAdminAuditLogs");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.ActorUserId).HasMaxLength(64).IsRequired();
            entity.Property(x => x.ActionCode).HasMaxLength(120).IsRequired();
            entity.Property(x => x.TargetType).HasMaxLength(100).IsRequired();
            entity.Property(x => x.TargetId).HasMaxLength(100).IsRequired();
            entity.HasIndex(x => x.CreatedAt);
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.ToTable("Products");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Brand).HasMaxLength(100).IsRequired();
            entity.Property(x => x.Model).HasMaxLength(160).IsRequired();
            entity.Property(x => x.Size).HasMaxLength(40).IsRequired();
            entity.Property(x => x.Images).HasConversion(imagesConverter).Metadata.SetValueComparer(
                new ValueComparer<List<string>>(
                    (left, right) => left!.SequenceEqual(right!),
                    value => value.Aggregate(0, (hash, item) => HashCode.Combine(hash, item.GetHashCode())),
                    value => value.ToList()));
            entity.HasIndex(x => new { x.Brand, x.Model, x.Size });
            entity.Ignore(x => x.Stock);
            entity.Ignore(x => x.Price);
            entity.Ignore(x => x.CompareAtPrice);
        });

        modelBuilder.Entity<ProductBrand>(entity =>
        {
            entity.ToTable("ProductBrands");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.NameFa).HasMaxLength(100).IsRequired();
            entity.Property(x => x.NameEn).HasMaxLength(100).IsRequired();
            entity.HasIndex(x => x.NameFa).IsUnique();
            entity.HasIndex(x => x.NameEn).IsUnique();
        });

        modelBuilder.Entity<StoreInventoryRow>(entity =>
        {
            entity.ToTable("StoreInventory");
            entity.HasKey(x => new { x.StoreId, x.ProductId });
            entity.HasOne<StoreRow>().WithMany().HasForeignKey(x => x.StoreId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne<Product>().WithMany().HasForeignKey(x => x.ProductId).OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(x => x.ProductId);
        });
    }
}

public sealed class StoreRow
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Address { get; set; } = "";
    public string ContactPhone { get; set; } = "";
    public bool IsActive { get; set; } = true;
}

public sealed class StoreInventoryRow
{
    public int StoreId { get; set; }
    public int ProductId { get; set; }
    public int Quantity { get; set; }
    public decimal Price { get; set; }
    public decimal CompareAtPrice { get; set; }
}

public sealed class EfStore : IProductRepository, IShopRepository, IBrandRepository
{
    private const int AdminStoreId = 1;
    private readonly IDbContextFactory<StoreDatabase> databaseFactory;
    private readonly bool seedDemoData;

    public EfStore(IDbContextFactory<StoreDatabase> databaseFactory, bool seedDemoData)
    {
        this.databaseFactory = databaseFactory;
        this.seedDemoData = seedDemoData;
        Initialize();
    }

    public IReadOnlyList<Product> GetAll(int? shopId = null)
    {
        using var db = databaseFactory.CreateDbContext();
        var products = db.Products.AsNoTracking().ToList().OrderByDescending(p => p.CreatedAt).ThenByDescending(p => p.Id).ToList();
        var targetStore = shopId ?? AdminStoreId;
        var inventories = db.StoreInventory.AsNoTracking().Where(s => s.StoreId == targetStore).ToDictionary(s => s.ProductId);
        return products.Where(p => shopId is null || inventories.ContainsKey(p.Id))
            .Select(p => WithInventory(p, inventories.GetValueOrDefault(p.Id))).ToList();
    }

    public PagedResult<Product> GetPage(int? shopId, int page, int pageSize)
    {
        using var db = databaseFactory.CreateDbContext();
        IQueryable<Product> query = db.Products.AsNoTracking();
        if (shopId is not null)
            query = query.Where(product => db.StoreInventory.Any(inventory => inventory.StoreId == shopId && inventory.ProductId == product.Id));

        var total = query.Count();
        var offset = (long)(page - 1) * pageSize;
        if (offset >= total || offset > int.MaxValue)
            return new PagedResult<Product>(Array.Empty<Product>(), total, page, pageSize);

        var products = db.Database.IsSqlite()
            ? query.ToList()
                .OrderByDescending(product => product.CreatedAt)
                .ThenByDescending(product => product.Id)
                .Skip((int)offset)
                .Take(pageSize)
                .ToList()
            : query.OrderByDescending(product => product.CreatedAt)
                .ThenByDescending(product => product.Id)
                .Skip((int)offset)
                .Take(pageSize)
                .ToList();
        var productIds = products.Select(product => product.Id).ToArray();
        var targetStore = shopId ?? AdminStoreId;
        var inventories = db.StoreInventory.AsNoTracking()
            .Where(inventory => inventory.StoreId == targetStore && productIds.Contains(inventory.ProductId))
            .ToDictionary(inventory => inventory.ProductId);
        var items = products.Select(product => WithInventory(product, inventories.GetValueOrDefault(product.Id))).ToList();
        return new PagedResult<Product>(items, total, page, pageSize);
    }

    public IReadOnlyList<ProductSearchCandidate> GetSearchCandidates(int? shopId)
    {
        using var db = databaseFactory.CreateDbContext();
        IQueryable<Product> query = db.Products.AsNoTracking();
        if (shopId is not null)
            query = query.Where(product => db.StoreInventory.Any(inventory => inventory.StoreId == shopId && inventory.ProductId == product.Id));

        return query.Select(product => new ProductSearchCandidate(
            product.Id, product.Brand, product.Model, product.Size, product.Pattern, product.AxlePosition,
            product.Country, product.Width, product.Profile, product.Rim, product.CreatedAt))
            .ToList();
    }

    public IReadOnlyList<Product> GetByIds(IReadOnlyCollection<int> ids, int? shopId = null)
    {
        if (ids.Count == 0) return Array.Empty<Product>();

        using var db = databaseFactory.CreateDbContext();
        var productIds = ids.Distinct().ToArray();
        IQueryable<Product> query = db.Products.AsNoTracking().Where(product => productIds.Contains(product.Id));
        if (shopId is not null)
            query = query.Where(product => db.StoreInventory.Any(inventory => inventory.StoreId == shopId && inventory.ProductId == product.Id));

        var products = query.ToDictionary(product => product.Id);
        var targetStore = shopId ?? AdminStoreId;
        var inventories = db.StoreInventory.AsNoTracking()
            .Where(inventory => inventory.StoreId == targetStore && productIds.Contains(inventory.ProductId))
            .ToDictionary(inventory => inventory.ProductId);
        return ids.Distinct()
            .Where(products.ContainsKey)
            .Select(id => WithInventory(products[id], inventories.GetValueOrDefault(id)))
            .ToList();
    }

    public Product? Get(int id, int? shopId = null)
    {
        using var db = databaseFactory.CreateDbContext();
        var product = db.Products.AsNoTracking().FirstOrDefault(p => p.Id == id);
        if (product is null) return null;
        var inventory = db.StoreInventory.AsNoTracking().FirstOrDefault(s => s.StoreId == (shopId ?? AdminStoreId) && s.ProductId == id);
        if (shopId is not null && inventory is null) return null;
        return WithInventory(product, inventory);
    }

    public Product Add(Product product)
    {
        using var db = databaseFactory.CreateDbContext();
        product.CreatedAt = DateTimeOffset.UtcNow;
        var stock = product.Stock;
        var price = product.Price;
        var compareAtPrice = product.CompareAtPrice;
        product.Stock = 0;
        product.Price = 0;
        product.CompareAtPrice = 0;
        db.Products.Add(product);
        db.SaveChanges();
        db.StoreInventory.Add(new StoreInventoryRow { StoreId = AdminStoreId, ProductId = product.Id, Quantity = stock, Price = price, CompareAtPrice = compareAtPrice });
        db.SaveChanges();
        return WithInventory(product, new StoreInventoryRow { Quantity = stock, Price = price, CompareAtPrice = compareAtPrice });
    }

    public Product Add(Product product, int shopId)
    {
        if (shopId < 1) throw new ArgumentException("فروشگاه نامعتبر است.");
        using var db = databaseFactory.CreateDbContext();
        using var transaction = db.Database.BeginTransaction();
        if (!db.Stores.Any(store => store.Id == shopId && store.IsActive))
            throw new KeyNotFoundException("فروشگاه فعال پیدا نشد.");
        product.CreatedAt = DateTimeOffset.UtcNow;
        var stock = product.Stock;
        var price = product.Price;
        var compareAtPrice = product.CompareAtPrice;
        product.Stock = 0;
        product.Price = 0;
        product.CompareAtPrice = 0;
        db.Products.Add(product);
        db.SaveChanges();
        db.StoreInventory.Add(new StoreInventoryRow { StoreId = shopId, ProductId = product.Id, Quantity = stock, Price = price, CompareAtPrice = compareAtPrice });
        db.SaveChanges();
        transaction.Commit();
        return WithInventory(product, new StoreInventoryRow { Quantity = stock, Price = price, CompareAtPrice = compareAtPrice });
    }

    public Product? Update(int id, Product product)
    {
        using var db = databaseFactory.CreateDbContext();
        var existing = db.Products.FirstOrDefault(p => p.Id == id);
        if (existing is null) return null;
        var createdAt = existing.CreatedAt;
        var stock = product.Stock;
        var price = product.Price;
        var compareAtPrice = product.CompareAtPrice;
        product.Stock = 0;
        product.Price = 0;
        product.CompareAtPrice = 0;
        existing.Brand = product.Brand;
        existing.Model = product.Model;
        existing.Size = product.Size;
        existing.Width = product.Width;
        existing.Profile = product.Profile;
        existing.Rim = product.Rim;
        existing.Pattern = product.Pattern;
        existing.AxlePosition = product.AxlePosition;
        existing.LoadIndex = product.LoadIndex;
        existing.Noise = product.Noise;
        existing.Year = product.Year;
        existing.Country = product.Country;
        existing.Warranty = product.Warranty;
        existing.WarrantyMonths = product.WarrantyMonths;
        existing.Description = product.Description;
        existing.Images = product.Images.ToList();
        existing.CreatedAt = createdAt;
        var inventory = db.StoreInventory.FirstOrDefault(s => s.StoreId == AdminStoreId && s.ProductId == id);
        if (inventory is null) db.StoreInventory.Add(new StoreInventoryRow { StoreId = AdminStoreId, ProductId = id, Quantity = stock, Price = price, CompareAtPrice = compareAtPrice });
        else { inventory.Quantity = stock; inventory.Price = price; inventory.CompareAtPrice = compareAtPrice; }
        db.SaveChanges();
        return WithInventory(existing, inventory ?? new StoreInventoryRow { Quantity = stock, Price = price, CompareAtPrice = compareAtPrice });
    }

    public Product? Update(int id, Product product, int shopId)
    {
        using var db = databaseFactory.CreateDbContext();
        using var transaction = db.Database.BeginTransaction();
        var inventory = db.StoreInventory.SingleOrDefault(row => row.StoreId == shopId && row.ProductId == id);
        if (inventory is null) return null;
        if (db.StoreInventory.Count(row => row.ProductId == id) > 1)
            throw new InvalidOperationException("این محصول بین چند فروشگاه مشترک است؛ برای جلوگیری از تغییر اطلاعات سایر فروشگاه‌ها ابتدا محصول را مستقل کنید.");
        var existing = db.Products.SingleOrDefault(item => item.Id == id);
        if (existing is null) return null;
        CopyProductFields(product, existing);
        inventory.Quantity = product.Stock;
        inventory.Price = product.Price;
        inventory.CompareAtPrice = product.CompareAtPrice;
        db.SaveChanges();
        transaction.Commit();
        return WithInventory(existing, inventory);
    }

    public bool Delete(int id)
    {
        using var db = databaseFactory.CreateDbContext();
        var product = db.Products.FirstOrDefault(p => p.Id == id);
        if (product is null) return false;
        db.Products.Remove(product);
        db.SaveChanges();
        return true;
    }

    public bool Delete(int id, int shopId)
    {
        using var db = databaseFactory.CreateDbContext();
        using var transaction = db.Database.BeginTransaction();
        var inventory = db.StoreInventory.SingleOrDefault(row => row.StoreId == shopId && row.ProductId == id);
        if (inventory is null) return false;
        db.StoreInventory.Remove(inventory);
        if (!db.StoreInventory.Any(row => row.ProductId == id))
        {
            var product = db.Products.SingleOrDefault(item => item.Id == id);
            if (product is not null) db.Products.Remove(product);
        }
        db.SaveChanges();
        transaction.Commit();
        return true;
    }

    private static void CopyProductFields(Product source, Product target)
    {
        target.Brand = source.Brand;
        target.Model = source.Model;
        target.Size = source.Size;
        target.Width = source.Width;
        target.Profile = source.Profile;
        target.Rim = source.Rim;
        target.Pattern = source.Pattern;
        target.AxlePosition = source.AxlePosition;
        target.LoadIndex = source.LoadIndex;
        target.Noise = source.Noise;
        target.Year = source.Year;
        target.Country = source.Country;
        target.Warranty = source.Warranty;
        target.WarrantyMonths = source.WarrantyMonths;
        target.Description = source.Description;
        target.Images = source.Images.ToList();
    }

    public bool TryReserveStock(int shopId, IReadOnlyCollection<(int ProductId, int Quantity)> lines)
    {
        if (lines.Count == 0) return false;
        var quantities = AggregateStockLines(lines);
        using var db = databaseFactory.CreateDbContext();
        using var transaction = db.Database.BeginTransaction();
        foreach (var line in quantities)
        {
            var updated = db.StoreInventory
                .Where(row => row.StoreId == shopId && row.ProductId == line.ProductId && row.Quantity >= line.Quantity)
                .ExecuteUpdate(update => update.SetProperty(row => row.Quantity, row => row.Quantity - line.Quantity));
            if (updated != 1) return false;
        }
        transaction.Commit();
        return true;
    }

    public void ReleaseStock(int shopId, IReadOnlyCollection<(int ProductId, int Quantity)> lines)
    {
        var quantities = AggregateStockLines(lines);
        using var db = databaseFactory.CreateDbContext();
        using var transaction = db.Database.BeginTransaction();
        foreach (var line in quantities)
        {
            db.StoreInventory
                .Where(row => row.StoreId == shopId && row.ProductId == line.ProductId)
                .ExecuteUpdate(update => update.SetProperty(row => row.Quantity, row => row.Quantity + line.Quantity));
        }
        transaction.Commit();
    }

    private static IReadOnlyList<(int ProductId, int Quantity)> AggregateStockLines(
        IReadOnlyCollection<(int ProductId, int Quantity)> lines)
    {
        if (lines.Any(line => line.ProductId < 1 || line.Quantity < 1))
            throw new ArgumentException("Product IDs and stock quantities must be positive.", nameof(lines));

        return lines.GroupBy(line => line.ProductId)
            .Select(group => (group.Key, group.Aggregate(0, (total, line) => checked(total + line.Quantity))))
            .ToList();
    }

    public IReadOnlyList<Shop> GetAll()
    {
        using var db = databaseFactory.CreateDbContext();
        var counts = db.StoreInventory.AsNoTracking().GroupBy(row => row.StoreId)
            .Select(group => new { StoreId = group.Key, Count = group.Count() }).ToDictionary(x => x.StoreId, x => x.Count);
        return db.Stores.AsNoTracking().OrderBy(store => store.Id)
            .Select(store => new Shop(store.Id, store.Name, store.Address, counts.GetValueOrDefault(store.Id))).ToList();
    }

    public bool HasProduct(int shopId, int productId)
    {
        using var db = databaseFactory.CreateDbContext();
        return db.StoreInventory.Any(row => row.StoreId == shopId && row.ProductId == productId);
    }

    private void Initialize()
    {
        using var db = databaseFactory.CreateDbContext();
        var isSqlite = db.Database.IsSqlite();
        if (isSqlite)
        {
            db.Database.EnsureCreated();
            EnsureAccessSchema(db);
            EnsureBrandSchema(db);
            EnsureInstallmentPlanSchema(db);
        }
        else
        {
            var pendingMigrations = db.Database.GetPendingMigrations().ToList();
            if (pendingMigrations.Count > 0)
                throw new InvalidOperationException("SQL Server schema is not up to date. Run the --migrate-store-database command before starting the API.");
        }

        SeedBrands(db);
        SeedAccessControl(db);
        if (!isSqlite || !seedDemoData || db.Stores.Any())
        {
            SeedInstallmentPlans(db);
            return;
        }

        var connection = db.Database.GetDbConnection();
        var closeConnection = connection.State != ConnectionState.Open;
        if (closeConnection) connection.Open();
        var hasAxlePosition = false;
        using (var command = connection.CreateCommand())
        {
            command.CommandText = "PRAGMA table_info('Products')";
            using var reader = command.ExecuteReader();
            while (reader.Read())
                if (string.Equals(reader.GetString(1), "AxlePosition", StringComparison.OrdinalIgnoreCase)) hasAxlePosition = true;
        }
        if (closeConnection) connection.Close();
        EnsureStoreColumn(db, "ContactPhone", "TEXT NOT NULL DEFAULT ''");
        EnsureStoreColumn(db, "IsActive", "INTEGER NOT NULL DEFAULT 1");
        if (!hasAxlePosition) db.Database.ExecuteSqlRaw("ALTER TABLE Products ADD COLUMN AxlePosition TEXT NOT NULL DEFAULT ''");
        EnsureInventoryColumn(db, "CompareAtPrice", "TEXT NOT NULL DEFAULT '0'");
        db.Stores.AddRange(
            new StoreRow { Id = 1, Name = "فروشگاه لاستیک مرکزی", Address = "تهران، خیابان آزادی" },
            new StoreRow { Id = 2, Name = "پارس راد تایر", Address = "تهران، شهرک صنعتی" },
            new StoreRow { Id = 3, Name = "تایرلند البرز", Address = "کرج، جاده مخصوص" });
        db.SaveChanges();

        Seed(db, "GALAXY", "MFS101", "315/80R22.5", 315, 80, "R22.5", "ترکشن", "156/150L", "72dB", 2025, "اندونزی", 24, 14_000_000m, 20, [1, 2, 3], 16_800_000m);
        Seed(db, "CHAOYANG", "CR602", "295/80R22.5", 295, 80, "R22.5", "جاده‌ای", "152/149M", "70dB", 2025, "چین", 18, 9_900_000m, 20, [1, 2]);
        Seed(db, "NEXEN TIRE", "SB202", "275/70R22.5", 275, 70, "R22.5", "همه‌منظوره", "148/145M", "69dB", 2024, "کره جنوبی", 12, 6_900_000m, 20, [1, 2, 3]);
        SeedInstallmentPlans(db);
    }

    private static void EnsureInstallmentPlanSchema(StoreDatabase db)
    {
        db.Database.ExecuteSqlRaw("""
            CREATE TABLE IF NOT EXISTS StoreInstallmentPlans (
                StoreId INTEGER NOT NULL,
                InstallmentCount INTEGER NOT NULL,
                FeeRate TEXT NOT NULL,
                IsActive INTEGER NOT NULL,
                UpdatedAt TEXT NOT NULL,
                UpdatedBy TEXT NOT NULL,
                PRIMARY KEY (StoreId, InstallmentCount),
                FOREIGN KEY (StoreId) REFERENCES Stores(Id) ON DELETE CASCADE
            );
            CREATE INDEX IF NOT EXISTS IX_StoreInstallmentPlans_StoreId_IsActive
            ON StoreInstallmentPlans(StoreId, IsActive);
            """);
    }

    private static void SeedInstallmentPlans(StoreDatabase db)
    {
        var now = DateTimeOffset.UtcNow;
        var storeIds = db.Stores.AsNoTracking().Select(store => store.Id).ToList();
        var configured = db.StoreInstallmentPlans.AsNoTracking()
            .Where(plan => storeIds.Contains(plan.StoreId))
            .Select(plan => new { plan.StoreId, plan.InstallmentCount })
            .ToHashSet();
        foreach (var storeId in storeIds)
        {
            if (!configured.Contains(new { StoreId = storeId, InstallmentCount = 2 }))
                db.StoreInstallmentPlans.Add(new StoreInstallmentPlan { StoreId = storeId, InstallmentCount = 2, FeeRate = 0.07m, IsActive = false, UpdatedAt = now, UpdatedBy = "system" });
            if (!configured.Contains(new { StoreId = storeId, InstallmentCount = 4 }))
                db.StoreInstallmentPlans.Add(new StoreInstallmentPlan { StoreId = storeId, InstallmentCount = 4, FeeRate = 0.07m, IsActive = true, UpdatedAt = now, UpdatedBy = "system" });
        }
        if (db.ChangeTracker.HasChanges()) db.SaveChanges();
    }

    private static void EnsureBrandSchema(StoreDatabase db)
    {
        db.Database.ExecuteSqlRaw("""
            CREATE TABLE IF NOT EXISTS ProductBrands (
                Id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                NameFa TEXT NOT NULL,
                NameEn TEXT NOT NULL,
                IsActive INTEGER NOT NULL DEFAULT 1
            );
            CREATE UNIQUE INDEX IF NOT EXISTS IX_ProductBrands_NameFa ON ProductBrands(NameFa);
            CREATE UNIQUE INDEX IF NOT EXISTS IX_ProductBrands_NameEn ON ProductBrands(NameEn);
            """);
    }

    private static void SeedBrands(StoreDatabase db)
    {
        var brands = new (string NameFa, string NameEn)[]
        {
            ("جی‌تی", "GT"), ("بریجستون", "Bridgestone"), ("رودآلتون", "Road Alton"),
            ("میلور", "Milever"), ("هاپتراک", "Hoptrack"), ("روویلو", "Rovelo"),
            ("بلک‌لاین", "Black Line"), ("رازی", "Razi"), ("رودوان", "RoadOne"),
            ("MRF", "MRF"), ("لینگ‌لانگ", "Linglong"), ("پریموای", "Primoway"),
            ("مارشال", "Marshal"), ("کونتینتال", "Continental"), ("گودیر", "Goodyear")
        };
        foreach (var (nameFa, nameEn) in brands)
        {
            if (db.ProductBrands.Any(brand => brand.NameFa == nameFa)) continue;
            db.ProductBrands.Add(new ProductBrand { NameFa = nameFa, NameEn = nameEn });
        }
        db.SaveChanges();
    }

    public IReadOnlyList<ProductBrand> GetActiveBrands()
    {
        using var db = databaseFactory.CreateDbContext();
        return db.ProductBrands.AsNoTracking().Where(brand => brand.IsActive)
            .OrderBy(brand => brand.NameFa).ToList();
    }

    private static void EnsureStoreColumn(StoreDatabase db, string columnName, string definition)
    {
        var connection = db.Database.GetDbConnection();
        var closeConnection = connection.State != ConnectionState.Open;
        if (closeConnection) connection.Open();
        var exists = false;
        using (var command = connection.CreateCommand())
        {
            command.CommandText = "PRAGMA table_info('Stores')";
            using var reader = command.ExecuteReader();
            while (reader.Read())
                if (string.Equals(reader.GetString(1), columnName, StringComparison.OrdinalIgnoreCase)) exists = true;
        }
        if (closeConnection) connection.Close();
        if (!exists)
        {
            var statement = columnName switch
            {
                "ContactPhone" => "ALTER TABLE Stores ADD COLUMN ContactPhone TEXT NOT NULL DEFAULT ''",
                "IsActive" => "ALTER TABLE Stores ADD COLUMN IsActive INTEGER NOT NULL DEFAULT 1",
                _ => throw new InvalidOperationException("Unsupported store schema column.")
            };
            db.Database.ExecuteSqlRaw(statement);
        }
    }

    private static void EnsureInventoryColumn(StoreDatabase db, string columnName, string definition)
    {
        var connection = db.Database.GetDbConnection();
        var closeConnection = connection.State != ConnectionState.Open;
        if (closeConnection) connection.Open();
        var exists = false;
        using (var command = connection.CreateCommand())
        {
            command.CommandText = "PRAGMA table_info('StoreInventory')";
            using var reader = command.ExecuteReader();
            while (reader.Read())
                if (string.Equals(reader.GetString(1), columnName, StringComparison.OrdinalIgnoreCase)) exists = true;
        }
        if (closeConnection) connection.Close();
        if (!exists)
        {
            var statement = columnName switch
            {
                "CompareAtPrice" => "ALTER TABLE StoreInventory ADD COLUMN CompareAtPrice TEXT NOT NULL DEFAULT '0'",
                _ => throw new InvalidOperationException("Unsupported inventory schema column.")
            };
            db.Database.ExecuteSqlRaw(statement);
        }
    }

    private static void EnsureAccessSchema(StoreDatabase db)
    {
        db.Database.ExecuteSqlRaw("""
            CREATE TABLE IF NOT EXISTS StoreAdminUsers (
                Id TEXT NOT NULL PRIMARY KEY,
                Username TEXT NOT NULL,
                NormalizedUsername TEXT NOT NULL COLLATE NOCASE,
                DisplayName TEXT NOT NULL,
                PasswordHash TEXT NOT NULL,
                SecurityStamp TEXT NOT NULL,
                IsActive INTEGER NOT NULL DEFAULT 1,
                MustChangePassword INTEGER NOT NULL DEFAULT 0,
                FailedLoginCount INTEGER NOT NULL DEFAULT 0,
                LockoutUntilUtc TEXT NULL,
                CreatedAt TEXT NOT NULL
            );
            CREATE UNIQUE INDEX IF NOT EXISTS IX_StoreAdminUsers_NormalizedUsername ON StoreAdminUsers(NormalizedUsername);
            CREATE TABLE IF NOT EXISTS StoreAdminRoles (
                Id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                Code TEXT NOT NULL,
                Name TEXT NOT NULL,
                Scope TEXT NOT NULL,
                CONSTRAINT UQ_StoreAdminRoles_Code_Scope UNIQUE (Code, Scope)
            );
            CREATE TABLE IF NOT EXISTS StoreAdminPermissions (
                Code TEXT NOT NULL PRIMARY KEY,
                Name TEXT NOT NULL,
                Scope TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS StoreAdminUserRoles (
                UserId TEXT NOT NULL,
                RoleId INTEGER NOT NULL,
                PRIMARY KEY (UserId, RoleId),
                FOREIGN KEY (UserId) REFERENCES StoreAdminUsers(Id) ON DELETE CASCADE,
                FOREIGN KEY (RoleId) REFERENCES StoreAdminRoles(Id) ON DELETE CASCADE
            );
            CREATE TABLE IF NOT EXISTS StoreAdminMemberships (
                Id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                UserId TEXT NOT NULL,
                StoreId INTEGER NOT NULL,
                IsActive INTEGER NOT NULL DEFAULT 1,
                CreatedAt TEXT NOT NULL,
                CONSTRAINT UQ_StoreAdminMemberships_User_Store UNIQUE (UserId, StoreId),
                FOREIGN KEY (UserId) REFERENCES StoreAdminUsers(Id) ON DELETE CASCADE,
                FOREIGN KEY (StoreId) REFERENCES Stores(Id) ON DELETE CASCADE
            );
            CREATE TABLE IF NOT EXISTS StoreAdminMembershipRoles (
                MembershipId INTEGER NOT NULL,
                RoleId INTEGER NOT NULL,
                PRIMARY KEY (MembershipId, RoleId),
                FOREIGN KEY (MembershipId) REFERENCES StoreAdminMemberships(Id) ON DELETE CASCADE,
                FOREIGN KEY (RoleId) REFERENCES StoreAdminRoles(Id) ON DELETE CASCADE
            );
            CREATE TABLE IF NOT EXISTS StoreAdminRolePermissions (
                RoleId INTEGER NOT NULL,
                PermissionCode TEXT NOT NULL,
                PRIMARY KEY (RoleId, PermissionCode),
                FOREIGN KEY (RoleId) REFERENCES StoreAdminRoles(Id) ON DELETE CASCADE,
                FOREIGN KEY (PermissionCode) REFERENCES StoreAdminPermissions(Code) ON DELETE CASCADE
            );
            CREATE TABLE IF NOT EXISTS StoreAdminAuditLogs (
                Id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                ActorUserId TEXT NOT NULL,
                ActionCode TEXT NOT NULL,
                TargetType TEXT NOT NULL,
                TargetId TEXT NOT NULL,
                CreatedAt TEXT NOT NULL,
                FOREIGN KEY (ActorUserId) REFERENCES StoreAdminUsers(Id)
            );
            """);
    }

    private static void SeedAccessControl(StoreDatabase db)
    {
        var permissions = new[]
        {
            new StoreAdminPermission { Code = "platform.stores.manage", Name = "مدیریت فروشگاه‌ها", Scope = "platform" },
            new StoreAdminPermission { Code = "platform.users.manage", Name = "مدیریت کاربران", Scope = "platform" },
            new StoreAdminPermission { Code = "platform.access.manage", Name = "مدیریت دسترسی‌ها", Scope = "platform" },
            new StoreAdminPermission { Code = "credit.requests.approve", Name = "تأیید درخواست اعتبار", Scope = "platform" },
            new StoreAdminPermission { Code = "catalog.products.read", Name = "مشاهده محصولات", Scope = "store" },
            new StoreAdminPermission { Code = "catalog.products.create", Name = "افزودن محصول", Scope = "store" },
            new StoreAdminPermission { Code = "catalog.products.update", Name = "ویرایش محصول", Scope = "store" },
            new StoreAdminPermission { Code = "catalog.products.delete", Name = "حذف محصول", Scope = "store" },
            new StoreAdminPermission { Code = "orders.read", Name = "مشاهده سفارش‌ها", Scope = "store" },
            new StoreAdminPermission { Code = "orders.approve", Name = "تأیید پیش‌فاکتور", Scope = "store" },
            new StoreAdminPermission { Code = "orders.reject", Name = "رد سفارش", Scope = "store" },
            new StoreAdminPermission { Code = "orders.deliver", Name = "ثبت تحویل", Scope = "store" }
        };
        permissions = permissions.Append(new StoreAdminPermission { Code = "platform.installment-plans.manage", Name = "مدیریت شرایط اقساط", Scope = "platform" }).ToArray();
        foreach (var permission in permissions)
            if (!db.StoreAdminPermissions.Any(item => item.Code == permission.Code)) db.StoreAdminPermissions.Add(permission);

        var roleDefinitions = new[]
        {
            (Code: "platform.super-admin", Name: "مدیر کل پلتفرم", Scope: "platform"),
            (Code: "store.admin", Name: "مدیر فروشگاه", Scope: "store"),
            (Code: "store.operator", Name: "اپراتور فروشگاه", Scope: "store")
        };
        foreach (var definition in roleDefinitions)
            if (!db.StoreAdminRoles.Any(role => role.Code == definition.Code && role.Scope == definition.Scope))
                db.StoreAdminRoles.Add(new StoreAdminRole { Code = definition.Code, Name = definition.Name, Scope = definition.Scope });
        db.SaveChanges();

        var permissionCodes = permissions.Select(permission => permission.Code).ToHashSet(StringComparer.Ordinal);
        var platformRole = db.StoreAdminRoles.Single(role => role.Code == "platform.super-admin");
        var storeAdminRole = db.StoreAdminRoles.Single(role => role.Code == "store.admin");
        var operatorRole = db.StoreAdminRoles.Single(role => role.Code == "store.operator");
        var operatorPermissions = new HashSet<string>(StringComparer.Ordinal)
        {
            "catalog.products.read", "catalog.products.create", "catalog.products.update", "catalog.products.delete",
            "orders.read", "orders.approve", "orders.reject", "orders.deliver"
        };
        foreach (var rolePermission in db.StoreAdminRolePermissions.Where(link => link.RoleId == platformRole.Id || link.RoleId == storeAdminRole.Id).ToList())
        {
            var isKnown = permissionCodes.Contains(rolePermission.PermissionCode);
            if (!isKnown) db.StoreAdminRolePermissions.Remove(rolePermission);
        }
        foreach (var code in permissionCodes)
        {
            if (!db.StoreAdminRolePermissions.Any(link => link.RoleId == platformRole.Id && link.PermissionCode == code))
                db.StoreAdminRolePermissions.Add(new StoreAdminRolePermission { RoleId = platformRole.Id, PermissionCode = code });
            if (code.StartsWith("catalog.", StringComparison.Ordinal) || code.StartsWith("orders.", StringComparison.Ordinal))
            {
                if (!db.StoreAdminRolePermissions.Any(link => link.RoleId == storeAdminRole.Id && link.PermissionCode == code))
                    db.StoreAdminRolePermissions.Add(new StoreAdminRolePermission { RoleId = storeAdminRole.Id, PermissionCode = code });
                if (operatorPermissions.Contains(code) && !db.StoreAdminRolePermissions.Any(link => link.RoleId == operatorRole.Id && link.PermissionCode == code))
                    db.StoreAdminRolePermissions.Add(new StoreAdminRolePermission { RoleId = operatorRole.Id, PermissionCode = code });
            }
        }
        db.SaveChanges();
    }

    private static void Seed(StoreDatabase db, string brand, string model, string size, int width, int profile, string rim,
        string pattern, string loadIndex, string noise, int year, string country, int warrantyMonths, decimal price,
        int quantity, int[] storeIds, decimal compareAtPrice = 0)
    {
        var product = new Product
        {
            Brand = brand, Model = model, Size = size, Width = width, Profile = profile, Rim = rim,
            Pattern = pattern, LoadIndex = loadIndex, Noise = noise, Year = year, Country = country,
            Warranty = $"{warrantyMonths} ماه", WarrantyMonths = warrantyMonths, Price = price, CreatedAt = DateTimeOffset.UtcNow
        };
        db.Products.Add(product);
        db.SaveChanges();
        db.StoreInventory.AddRange(storeIds.Select(storeId => new StoreInventoryRow { StoreId = storeId, ProductId = product.Id, Quantity = quantity, Price = price, CompareAtPrice = compareAtPrice }));
        db.SaveChanges();
    }

    private static Product WithInventory(Product product, StoreInventoryRow? inventory)
    {
        product.Stock = inventory?.Quantity ?? 0;
        product.Price = inventory?.Price ?? 0;
        product.CompareAtPrice = inventory?.CompareAtPrice ?? 0;
        return product;
    }
}
