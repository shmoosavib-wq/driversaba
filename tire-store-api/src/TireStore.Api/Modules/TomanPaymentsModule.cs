using System.Globalization;
using TireStore.Application.Payments;

namespace TireStore.Api.Modules;

public static class TomanPaymentsModule
{
    public static IEndpointRouteBuilder MapTomanPaymentsModule(this IEndpointRouteBuilder endpoints)
    {
        var store = endpoints.MapGroup("/api/store");

        store.MapPost("/installments/{id:int}/payment", async (PaymentService service, int id, CancellationToken cancellationToken) =>
            Results.Ok(await service.StartAsync(id, cancellationToken)));

        store.MapPost("/payments/toman/callback", async (HttpRequest request, PaymentService service, CancellationToken cancellationToken) =>
        {
            var form = await request.ReadFormAsync(cancellationToken);
            var amountParsed = long.TryParse(form["amount"], NumberStyles.Integer, CultureInfo.InvariantCulture, out var amount);
            var statusParsed = int.TryParse(form["status"], NumberStyles.Integer, CultureInfo.InvariantCulture, out var status);
            var callback = new TomanCallbackDto(
                form["uuid"].ToString(),
                form["tracker_id"].ToString(),
                amountParsed && statusParsed ? amount : 0,
                amountParsed && statusParsed ? status : 0);
            var result = await service.HandleCallbackAsync(callback, cancellationToken);
            return Results.Redirect(service.ToReturnUrl(result));
        });

        store.MapGet("/payments/mock/{trackerId}", (PaymentService service, string trackerId) =>
            Results.Content(service.MockCheckoutHtml(trackerId), "text/html; charset=utf-8"));
        store.MapPost("/payments/mock/{trackerId}/success", (PaymentService service, string trackerId) =>
            Results.Redirect(service.ToReturnUrl(service.CompleteMock(trackerId, true))));
        store.MapPost("/payments/mock/{trackerId}/fail", (PaymentService service, string trackerId) =>
            Results.Redirect(service.ToReturnUrl(service.CompleteMock(trackerId, false))));

        return endpoints;
    }
}
