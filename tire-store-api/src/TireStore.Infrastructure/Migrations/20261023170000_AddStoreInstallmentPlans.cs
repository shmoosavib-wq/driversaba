using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TireStore.Infrastructure.Migrations;

[DbContext(typeof(StoreDatabase))]
[Migration("20261023170000_AddStoreInstallmentPlans")]
public partial class AddStoreInstallmentPlans : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "StoreInstallmentPlans",
            columns: table => new
            {
                StoreId = table.Column<int>(type: "int", nullable: false),
                InstallmentCount = table.Column<int>(type: "int", nullable: false),
                FeeRate = table.Column<decimal>(type: "decimal(9,6)", precision: 9, scale: 6, nullable: false),
                IsActive = table.Column<bool>(type: "bit", nullable: false),
                UpdatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                UpdatedBy = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_StoreInstallmentPlans", x => new { x.StoreId, x.InstallmentCount });
                table.ForeignKey(
                    name: "FK_StoreInstallmentPlans_Stores_StoreId",
                    column: x => x.StoreId,
                    principalTable: "Stores",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateIndex(
            name: "IX_StoreInstallmentPlans_StoreId_IsActive",
            table: "StoreInstallmentPlans",
            columns: new[] { "StoreId", "IsActive" });

        migrationBuilder.Sql("""
            INSERT INTO StoreInstallmentPlans (StoreId, InstallmentCount, FeeRate, IsActive, UpdatedAt, UpdatedBy)
            SELECT Id, 2, 0.070000, 0, SYSUTCDATETIME(), N'system' FROM Stores;
            INSERT INTO StoreInstallmentPlans (StoreId, InstallmentCount, FeeRate, IsActive, UpdatedAt, UpdatedBy)
            SELECT Id, 4, 0.070000, 1, SYSUTCDATETIME(), N'system' FROM Stores;
            """);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(name: "StoreInstallmentPlans");
    }

    protected override void BuildTargetModel(ModelBuilder modelBuilder)
    {
        modelBuilder
            .HasAnnotation("ProductVersion", "8.0.22")
            .HasAnnotation("Relational:MaxIdentifierLength", 128);
        SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);
        modelBuilder.Entity("TireStore.Domain.Entities.StoreInstallmentPlan", entity =>
        {
            entity.Property<int>("StoreId").HasColumnType("int");
            entity.Property<int>("InstallmentCount").HasColumnType("int");
            entity.Property<decimal>("FeeRate").HasPrecision(9, 6).HasColumnType("decimal(9,6)");
            entity.Property<bool>("IsActive").HasColumnType("bit");
            entity.Property<DateTimeOffset>("UpdatedAt").HasColumnType("datetimeoffset");
            entity.Property<string>("UpdatedBy").IsRequired().HasMaxLength(64).HasColumnType("nvarchar(64)");
            entity.HasKey("StoreId", "InstallmentCount");
            entity.HasIndex("StoreId", "IsActive");
            entity.ToTable("StoreInstallmentPlans");
        });
        modelBuilder.Entity("TireStore.Domain.Entities.StoreInstallmentPlan", entity =>
        {
            entity.HasOne("TireStore.Infrastructure.StoreRow", null)
                .WithMany()
                .HasForeignKey("StoreId")
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();
        });
    }
}
