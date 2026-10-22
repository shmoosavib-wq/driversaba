using System.Text.RegularExpressions;
using TireStore.Application.Abstractions;
using TireStore.Application.Common;
using TireStore.Domain.Entities;

namespace TireStore.Application.Products;

public sealed record ProductDto(
    int Id, string Brand, string Model, string Size, int Width, int Profile, string Rim,
    string Pattern, string AxlePosition, string LoadIndex, string Noise, int Year, string Country,
    string Warranty, int WarrantyMonths, decimal Price, decimal CompareAtPrice, int Stock,
    string Description, IReadOnlyList<string> Images, DateTimeOffset CreatedAt)
{
    public static ProductDto From(Product p) => new(
        p.Id, p.Brand, p.Model, p.Size, p.Width, p.Profile, p.Rim, p.Pattern, p.AxlePosition, p.LoadIndex, p.Noise,
        p.Year, p.Country, p.Warranty, p.WarrantyMonths, p.Price, p.CompareAtPrice, p.Stock, p.Description,
        p.Images.ToArray(), p.CreatedAt);
}

public sealed record ProductInput(
    string? Brand, string? Model, string? Size, int Width, int Profile, string? Rim,
    string? Pattern, string? AxlePosition, string? LoadIndex, string? Noise, int Year, string? Country,
    string? Warranty, int WarrantyMonths, decimal Price, decimal CompareAtPrice, int Stock,
    string? Description, List<string>? Images);

public sealed record ProductQuery(string? Q, int? ShopId, int Page = 1, int PageSize = 10);

public sealed record ProductBrandDto(int Id, string NameFa, string NameEn);

public sealed class ProductBrandService(IBrandRepository brands)
{
    public IReadOnlyList<ProductBrandDto> GetActive() => brands.GetActiveBrands()
        .Select(brand => new ProductBrandDto(brand.Id, brand.NameFa, brand.NameEn)).ToList();
}

public sealed class ProductService(IProductRepository products)
{
    public const int MaxImages = 6;
    public const decimal MinDiscountPercent = 5m;
    public const decimal MaxDiscountPercent = 70m;
    private const decimal MaxStoredPrice = 9_999_999_999_999_999.99m;
    private const int MaxImageLength = 4_500_000;
    private static readonly Regex SizePattern = new(@"^(\d+)/(\d+)\s*Z?R?(\d+)$", RegexOptions.IgnoreCase | RegexOptions.Compiled);

    public PagedResult<ProductDto> Search(ProductQuery query)
    {
        var page = Math.Max(1, query.Page);
        var pageSize = Math.Clamp(query.PageSize, 1, 100);
        var term = TextNormalizer.ForSearch(query.Q);
        if (term.Length == 0)
        {
            var result = products.GetPage(query.ShopId, page, pageSize);
            return new PagedResult<ProductDto>(result.Items.Select(ProductDto.From).ToList(), result.Total, page, pageSize);
        }

        var filtered = products.GetSearchCandidates(query.ShopId)
            .Where(product => TextNormalizer.ForSearch(
                $"{product.Brand} {product.Model} {product.Size} {product.Pattern} {product.AxlePosition} {product.Country} {product.Width} {product.Profile} {product.Rim}")
                .Contains(term))
            .OrderByDescending(product => product.CreatedAt)
            .ThenByDescending(product => product.Id)
            .ToList();
        var offset = (long)(page - 1) * pageSize;
        var pageCandidates = offset >= filtered.Count
            ? new List<ProductSearchCandidate>()
            : filtered.Skip((int)offset).Take(pageSize).ToList();
        var productsById = products.GetByIds(pageCandidates.Select(product => product.Id).ToArray(), query.ShopId)
            .ToDictionary(product => product.Id);
        var items = pageCandidates
            .Where(candidate => productsById.ContainsKey(candidate.Id))
            .Select(candidate => ProductDto.From(productsById[candidate.Id]))
            .ToList();
        return new PagedResult<ProductDto>(items, filtered.Count, page, pageSize);
    }

    public IReadOnlyList<ProductDto> List(ProductQuery query) => Filter(query).Select(ProductDto.From).ToList();

    public ProductDto Get(int id) => ProductDto.From(products.Get(id) ?? throw new NotFoundException("محصول یافت نشد."));
    public ProductDto Get(int id, int shopId) => ProductDto.From(products.Get(id, shopId) ?? throw new NotFoundException("محصول یافت نشد."));

    public ProductDto Create(ProductInput input) => ProductDto.From(products.Add(ToEntity(input)));
    public ProductDto Create(ProductInput input, int shopId) => ProductDto.From(products.Add(ToEntity(input), shopId));

    public ProductDto Update(int id, ProductInput input) =>
        ProductDto.From(products.Update(id, ToEntity(input)) ?? throw new NotFoundException("محصول یافت نشد."));
    public ProductDto Update(int id, ProductInput input, int shopId) =>
        ProductDto.From(products.Update(id, ToEntity(input), shopId) ?? throw new NotFoundException("محصول یافت نشد."));

    public void Delete(int id)
    {
        if (!products.Delete(id)) throw new NotFoundException("محصول یافت نشد.");
    }
    public void Delete(int id, int shopId)
    {
        if (!products.Delete(id, shopId)) throw new NotFoundException("محصول یافت نشد.");
    }

    private IEnumerable<Product> Filter(ProductQuery query)
    {
        IEnumerable<Product> result = products.GetAll(query.ShopId);
        var term = TextNormalizer.ForSearch(query.Q);
        if (term.Length > 0)
        {
            result = result.Where(p => TextNormalizer.ForSearch(
                $"{p.Brand} {p.Model} {p.Size} {p.Pattern} {p.AxlePosition} {p.Country} {p.Width} {p.Profile} {p.Rim}").Contains(term));
        }
        return result.OrderByDescending(p => p.CreatedAt).ThenByDescending(p => p.Id);
    }

    private static Product ToEntity(ProductInput input)
    {
        var brand = input.Brand?.Trim() ?? "";
        var model = input.Model?.Trim() ?? "";
        var size = input.Size?.Trim() ?? "";
        var country = input.Country?.Trim() ?? "";
        if (brand.Length == 0 || model.Length == 0 || size.Length == 0 || country.Length == 0)
            throw new ValidationException("برند، مدل، سایز و کشور تولیدکننده الزامی است.");
        if (brand.Length > 100 || model.Length > 160 || size.Length > 40)
            throw new ValidationException("طول برند، مدل یا سایز محصول از حد مجاز بیشتر است.");
        if (input.Price <= 0) throw new ValidationException("قیمت جفت باید بیشتر از صفر باشد.");
        if (input.Price > MaxStoredPrice || input.CompareAtPrice > MaxStoredPrice)
            throw new ValidationException("قیمت محصول از محدوده قابل ذخیره بیشتر است.");
        if (input.Stock < 0) throw new ValidationException("موجودی نمی‌تواند منفی باشد.");
        if (input.WarrantyMonths < 0) throw new ValidationException("مدت گارانتی نامعتبر است.");

        var compareAtPrice = input.CompareAtPrice;
        if (compareAtPrice < 0) throw new ValidationException("قیمت قبل از تخفیف نمی‌تواند منفی باشد.");
        if (compareAtPrice > 0)
        {
            if (compareAtPrice <= input.Price)
                throw new ValidationException("قیمت قبل از تخفیف باید بیشتر از قیمت فروش باشد.");
            var discountPercent = (compareAtPrice - input.Price) / compareAtPrice * 100m;
            if (discountPercent < MinDiscountPercent)
                throw new ValidationException($"درصد تخفیف نباید کمتر از {MinDiscountPercent:0}٪ باشد.");
            if (discountPercent > MaxDiscountPercent)
                throw new ValidationException($"درصد تخفیف نباید بیشتر از {MaxDiscountPercent:0}٪ باشد.");
        }

        var images = (input.Images ?? new()).Where(i => !string.IsNullOrWhiteSpace(i)).ToList();
        if (images.Count > MaxImages) throw new ValidationException($"حداکثر {MaxImages} عکس مجاز است.");
        if (images.Any(i => i.Length > MaxImageLength)) throw new ValidationException("حجم هر عکس نباید بیشتر از ۳ مگابایت باشد.");

        int width = input.Width, profile = input.Profile;
        var rim = input.Rim?.Trim() ?? "";
        var match = SizePattern.Match(size);
        if (match.Success)
        {
            if (width == 0 && !int.TryParse(match.Groups[1].Value, out width))
                throw new ValidationException("عرض واردشده در سایز تایر معتبر نیست.");
            if (profile == 0 && !int.TryParse(match.Groups[2].Value, out profile))
                throw new ValidationException("فاق واردشده در سایز تایر معتبر نیست.");
            if (rim.Length == 0) rim = "R" + match.Groups[3].Value;
        }

        return new Product
        {
            Brand = brand, Model = model, Size = size, Width = width, Profile = profile, Rim = rim,
            Pattern = input.Pattern?.Trim() ?? "", AxlePosition = input.AxlePosition?.Trim() ?? "", LoadIndex = input.LoadIndex?.Trim() ?? "",
            Noise = input.Noise?.Trim() ?? "", Year = input.Year, Country = country,
            Warranty = input.Warranty?.Trim() ?? "", WarrantyMonths = input.WarrantyMonths,
            Price = input.Price, CompareAtPrice = compareAtPrice, Stock = input.Stock, Description = input.Description?.Trim() ?? "",
            Images = images
        };
    }
}
