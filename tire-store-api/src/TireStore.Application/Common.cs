using System.Text;

namespace TireStore.Application.Common;

public sealed class ValidationException(string message) : Exception(message);

public sealed class NotFoundException(string message = "یافت نشد.") : Exception(message);

public sealed record PagedResult<T>(IReadOnlyList<T> Items, int Total, int Page, int PageSize);

public static class TextNormalizer
{
    public static string ForSearch(string? value)
    {
        if (string.IsNullOrWhiteSpace(value)) return "";
        var builder = new StringBuilder(value.Length);
        foreach (var ch in value.Trim().ToLowerInvariant())
        {
            builder.Append(ch switch
            {
                >= '۰' and <= '۹' => (char)('0' + (ch - '۰')),
                >= '٠' and <= '٩' => (char)('0' + (ch - '٠')),
                'ي' => 'ی',
                'ك' => 'ک',
                '\u200c' or '\u200f' => ' ',
                _ => ch
            });
        }
        return string.Join(' ', builder.ToString().Split(' ', StringSplitOptions.RemoveEmptyEntries));
    }
}
