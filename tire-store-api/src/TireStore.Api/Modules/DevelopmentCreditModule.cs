using System.Net;
using TireStore.Application.Credits;

namespace TireStore.Api.Modules;

public static class DevelopmentCreditModule
{
    public static WebApplication MapDevelopmentCredit(this WebApplication app)
    {
        if (!app.Environment.IsDevelopment() || !app.Configuration.GetValue<bool>("Demo:EnableCreditApproval"))
            return app;

        app.MapPost("/api/store/credit/demo-approve", (HttpContext context, CreditService service) =>
        {
            var remoteAddress = context.Connection.RemoteIpAddress;
            var localAddress = context.Connection.LocalIpAddress;
            var origin = context.Request.Headers.Origin.ToString();
            if (remoteAddress is null || localAddress is null ||
                !IPAddress.IsLoopback(remoteAddress) || !IPAddress.IsLoopback(localAddress) ||
                context.Request.Host.Host is not ("localhost" or "127.0.0.1" or "[::1]") ||
                origin is not ("http://localhost:3000" or "http://127.0.0.1:3000"))
                return Results.StatusCode(StatusCodes.Status403Forbidden);

            if (service.Get().Status == "Approved") return Results.Ok(service.Get());
            if (service.Get().Status != "Pending")
                return Results.BadRequest(new { message = "ابتدا درخواست اعتبار را ثبت کنید." });

            return Results.Ok(service.Approve(new CreditApproveInput(150000000m)));
        });
        return app;
    }
}

