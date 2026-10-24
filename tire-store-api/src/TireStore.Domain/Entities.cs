namespace TireStore.Domain.Entities;

public sealed class Product
{
    public int Id { get; set; }
    public string Brand { get; set; } = "";
    public string Model { get; set; } = "";
    public string Size { get; set; } = "";
    public int Width { get; set; }
    public int Profile { get; set; }
    public string Rim { get; set; } = "";
    public string Pattern { get; set; } = "";
    public string AxlePosition { get; set; } = "";
    public string LoadIndex { get; set; } = "";
    public string Noise { get; set; } = "";
    public int Year { get; set; }
    public string Country { get; set; } = "";
    public string Warranty { get; set; } = "";
    public int WarrantyMonths { get; set; }

    public decimal Price { get; set; }
    public decimal CompareAtPrice { get; set; }
    public int Stock { get; set; }
    public string Description { get; set; } = "";
    public List<string> Images { get; set; } = new();
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public Product Clone()
    {
        var copy = (Product)MemberwiseClone();
        copy.Images = new List<string>(Images);
        return copy;
    }
}

public sealed class ProductBrand
{
    public int Id { get; set; }
    public string NameFa { get; set; } = "";
    public string NameEn { get; set; } = "";
    public bool IsActive { get; set; } = true;
}

public sealed record Shop(int Id, string Name, string Address, int ProductCount);

public sealed class StoreInstallmentPlan
{
    public int StoreId { get; set; }
    public int InstallmentCount { get; set; }
    public decimal FeeRate { get; set; }
    public bool IsActive { get; set; }
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
    public string UpdatedBy { get; set; } = "";
}

public sealed record Credit(decimal Limit, decimal Used, string Status);

public sealed record CreditRequestState(int FleetId, decimal Amount, string Status, DateTimeOffset CreatedAt);

public static class OrderStatus
{
    public const string AwaitingFirstPayment = "AwaitingFirstPayment";
    public const string AwaitingSellerApproval = "AwaitingSellerApproval";
    public const string Approved = "Approved";
    public const string Rejected = "Rejected";
    public const string AwaitingDriverConfirm = "AwaitingDriverConfirm";
    public const string Delivered = "Delivered";
}

public sealed record OrderItem(int ProductId, string Title, string Size, int Quantity, decimal UnitPrice);

public sealed class Order
{
    public int Id { get; init; }
    public int ShopId { get; init; }
    public int? FleetId { get; init; }
    public string FleetPlate { get; init; } = "";
    public string FleetType { get; init; } = "";
    public List<OrderItem> Items { get; init; } = new();
    public decimal Subtotal { get; init; }
    public decimal Fee { get; init; }
    public decimal Total { get; init; }
    public decimal DownPayment { get; init; }
    public decimal FinancedPrincipal { get; init; }
    public string PaymentMode { get; init; } = "Installments";
    public int InstallmentCount { get; init; } = 4;
    public string Status { get; set; } = OrderStatus.AwaitingFirstPayment;
    public string ProformaNumber { get; init; } = "";
    public DateTimeOffset? DeliveryFrom { get; set; }
    public DateTimeOffset? DeliveryTo { get; set; }
    public DateTimeOffset? DeliveredAt { get; set; }
    public string? DeliveryCode { get; set; }
    public DateTimeOffset CreatedAt { get; init; } = DateTimeOffset.UtcNow;
}

public sealed class Installment
{
    public int Id { get; set; }
    public int OrderId { get; init; }
    public int Number { get; init; }
    public decimal Amount { get; init; }
    public DateTimeOffset DueDate { get; init; }
    public string Status { get; set; } = "Upcoming";
    public DateTimeOffset? PaidAt { get; set; }
    public string? Gateway { get; set; }
    public string? PaymentTrackerId { get; set; }
    public string? ExternalPaymentId { get; set; }
    public string? PaymentStatus { get; set; }
}
