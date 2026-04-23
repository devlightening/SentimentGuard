using System.Text.RegularExpressions;
using SentimentGuard.Application.Services;

namespace SentimentGuard.Api.Security;

public class HeaderUserContext : IUserContext
{
    private static readonly Regex Safe = new("^[a-zA-Z0-9_-]{1,32}$", RegexOptions.Compiled);
    private readonly IHttpContextAccessor _http;

    public HeaderUserContext(IHttpContextAccessor http) => _http = http;

    public string UserId
    {
        get
        {
            var ctx = _http.HttpContext;
            if (ctx is null) return "demo";

            // For normal API calls we send X-Demo-User. For direct PDF download links we also
            // support ?user=... since browsers don't add custom headers on plain links.
            var raw = (string?)ctx.Request.Headers["X-Demo-User"];
            if (string.IsNullOrWhiteSpace(raw))
                raw = ctx.Request.Query["user"].FirstOrDefault();

            raw = (raw ?? "").Trim();
            if (string.IsNullOrWhiteSpace(raw)) return "demo";

            return Safe.IsMatch(raw) ? raw.ToLowerInvariant() : "demo";
        }
    }
}

