using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using TireStore.Application.Abstractions;
using TireStore.Application.Payments;

namespace TireStore.Infrastructure;

public sealed class TomanPaymentGateway(HttpClient httpClient, TomanPaymentOptions settings) : ITomanPaymentGateway
{
    private readonly SemaphoreSlim tokenLock = new(1, 1);
    private string? accessToken;
    private DateTimeOffset tokenExpiresAt;

    public async Task<string> CreatePaymentAsync(TomanPaymentRequest request, CancellationToken cancellationToken)
    {
        var token = await GetAccessTokenAsync(cancellationToken);
        using var message = new HttpRequestMessage(HttpMethod.Post, new Uri(new Uri(settings.ApiBaseUrl.TrimEnd('/') + "/"), "payments"));
        message.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var payload = new Dictionary<string, object?>
        {
            ["amount"] = request.AmountInRials,
            ["callback_url"] = request.CallbackUrl,
            ["tracker_id"] = request.TrackerId,
            ["check_national_id"] = false
        };
        if (!string.IsNullOrWhiteSpace(request.MobileNumber)) payload["mobile_number"] = request.MobileNumber;
        if (!string.IsNullOrWhiteSpace(request.TerminalNumber)) payload["options"] = new { terminal_number = request.TerminalNumber };
        message.Content = JsonContent.Create(payload);
        using var response = await httpClient.SendAsync(message, cancellationToken);
        var body = await response.Content.ReadAsStringAsync(cancellationToken);
        if (!response.IsSuccessStatusCode) throw new HttpRequestException($"Toman create payment returned {(int)response.StatusCode}: {body}");
        var created = JsonSerializer.Deserialize<CreatePaymentResponse>(body, JsonOptions);
        return !string.IsNullOrWhiteSpace(created?.Uuid) ? created.Uuid : throw new InvalidOperationException("Toman response did not include a payment UUID.");
    }

    public async Task<TomanPaymentVerification> VerifyPaymentAsync(string paymentId, CancellationToken cancellationToken)
    {
        var token = await GetAccessTokenAsync(cancellationToken);
        using var message = new HttpRequestMessage(HttpMethod.Post, new Uri(new Uri(settings.ApiBaseUrl.TrimEnd('/') + "/"), $"payments/{Uri.EscapeDataString(paymentId)}/verify"));
        message.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        using var response = await httpClient.SendAsync(message, cancellationToken);
        var body = await response.Content.ReadAsStringAsync(cancellationToken);
        if (!response.IsSuccessStatusCode) throw new HttpRequestException($"Toman verify payment returned {(int)response.StatusCode}: {body}");
        var verified = JsonSerializer.Deserialize<VerifyPaymentResponse>(body, JsonOptions)
            ?? throw new InvalidOperationException("Toman verify response was empty.");
        return new TomanPaymentVerification(verified.Uuid, verified.Amount, verified.TrackerId, verified.Status);
    }

    private async Task<string> GetAccessTokenAsync(CancellationToken cancellationToken)
    {
        if (!string.IsNullOrWhiteSpace(accessToken) && tokenExpiresAt > DateTimeOffset.UtcNow.AddMinutes(1)) return accessToken;
        await tokenLock.WaitAsync(cancellationToken);
        try
        {
            if (!string.IsNullOrWhiteSpace(accessToken) && tokenExpiresAt > DateTimeOffset.UtcNow.AddMinutes(1)) return accessToken;
            if (string.IsNullOrWhiteSpace(settings.ClientId) || string.IsNullOrWhiteSpace(settings.ClientSecret)
                || string.IsNullOrWhiteSpace(settings.Username) || string.IsNullOrWhiteSpace(settings.Password))
                throw new InvalidOperationException("Toman credentials are not configured.");

            using var message = new HttpRequestMessage(HttpMethod.Post, settings.AuthUrl)
            {
                Content = new FormUrlEncodedContent(new Dictionary<string, string>
                {
                    ["grant_type"] = "password",
                    ["client_id"] = settings.ClientId,
                    ["client_secret"] = settings.ClientSecret,
                    ["username"] = settings.Username,
                    ["password"] = settings.Password,
                    ["scope"] = "payment.create"
                })
            };
            using var response = await httpClient.SendAsync(message, cancellationToken);
            var body = await response.Content.ReadAsStringAsync(cancellationToken);
            if (!response.IsSuccessStatusCode) throw new HttpRequestException($"Toman auth returned {(int)response.StatusCode}: {body}");
            var token = JsonSerializer.Deserialize<AccessTokenResponse>(body, JsonOptions)
                ?? throw new InvalidOperationException("Toman auth response was empty.");
            if (string.IsNullOrWhiteSpace(token.AccessToken)) throw new InvalidOperationException("Toman auth response did not include an access token.");
            accessToken = token.AccessToken;
            tokenExpiresAt = DateTimeOffset.UtcNow.AddSeconds(Math.Max(60, token.ExpiresIn));
            return accessToken;
        }
        finally { tokenLock.Release(); }
    }

    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNameCaseInsensitive = true };

    private sealed record CreatePaymentResponse([property: JsonPropertyName("uuid")] string Uuid);
    private sealed record AccessTokenResponse(
        [property: JsonPropertyName("access_token")] string AccessToken,
        [property: JsonPropertyName("expires_in")] int ExpiresIn);
    private sealed record VerifyPaymentResponse(
        [property: JsonPropertyName("uuid")] string Uuid,
        [property: JsonPropertyName("amount")] long Amount,
        [property: JsonPropertyName("tracker_id")] string? TrackerId,
        [property: JsonPropertyName("status")] int Status);
}
