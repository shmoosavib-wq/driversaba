using Microsoft.Extensions.DependencyInjection;
using TireStore.Application.Credits;
using TireStore.Application.Orders;
using TireStore.Application.Payments;
using TireStore.Application.Products;

namespace TireStore.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services, PricingOptions pricing)
    {
        services.AddSingleton(pricing);
        services.AddScoped<ProductService>();
        services.AddScoped<ProductBrandService>();
        services.AddScoped<OrderService>();
        services.AddScoped<PaymentService>();
        services.AddScoped<CreditService>();
        return services;
    }
}
