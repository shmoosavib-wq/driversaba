using TireStore.Domain.Entities;
using TireStore.Application.Common;

namespace TireStore.Application.Abstractions;

public sealed record ProductSearchCandidate(
    int Id, string Brand, string Model, string Size, string Pattern, string AxlePosition,
    string Country, int Width, int Profile, string Rim, DateTimeOffset CreatedAt);

public interface IProductRepository
{
    IReadOnlyList<Product> GetAll(int? shopId = null);
    PagedResult<Product> GetPage(int? shopId, int page, int pageSize);
    IReadOnlyList<ProductSearchCandidate> GetSearchCandidates(int? shopId);
    IReadOnlyList<Product> GetByIds(IReadOnlyCollection<int> ids, int? shopId = null);
    Product? Get(int id, int? shopId = null);
    Product Add(Product product);
    Product Add(Product product, int shopId);
    Product? Update(int id, Product product);
    Product? Update(int id, Product product, int shopId);
    bool Delete(int id);
    bool Delete(int id, int shopId);
    bool TryReserveStock(int shopId, IReadOnlyCollection<(int ProductId, int Quantity)> lines);
    void ReleaseStock(int shopId, IReadOnlyCollection<(int ProductId, int Quantity)> lines);
}

public interface IBrandRepository
{
    IReadOnlyList<ProductBrand> GetActiveBrands();
}

public interface IShopRepository
{
    IReadOnlyList<Shop> GetAll();
    bool HasProduct(int shopId, int productId);
}

public interface ICreditRepository
{
    Credit Get();
    CreditRequestState? GetRequest();
    void SetRequest(CreditRequestState request);
    void Approve(decimal limit);
    void AddUsed(decimal delta);
}

public interface IOrderRepository
{
    Order Add(Order order, IReadOnlyList<Installment> installments);
    int NextOrderId();
    IReadOnlyList<Order> GetAll();
    Order? Get(int id);
    IReadOnlyList<Installment> GetInstallments();
    Installment? GetInstallment(int id);
    Installment? GetInstallmentByTrackerId(string trackerId);
}

public interface ITomanPaymentGateway
{
    Task<string> CreatePaymentAsync(TomanPaymentRequest request, CancellationToken cancellationToken);
    Task<TomanPaymentVerification> VerifyPaymentAsync(string paymentId, CancellationToken cancellationToken);
}

public sealed record TomanPaymentRequest(long AmountInRials, string TrackerId, string CallbackUrl, string? MobileNumber, string? TerminalNumber);
public sealed record TomanPaymentVerification(string Uuid, long AmountInRials, string? TrackerId, int Status);
