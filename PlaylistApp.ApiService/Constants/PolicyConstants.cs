namespace PlaylistApp.ApiService.Constants;

internal static class PolicyConstants
{
    // Rate Limiting Policy Settings
    public const string RateLimitingPolicy = "StrictMutationLimit";
    public const int PermitLimit = 10;
    public const int QueueLimit = 0;
    public static readonly TimeSpan Window = TimeSpan.FromMinutes(10);

    // CORS Policy Settings
    public const string CorsPolicy = "StrictCorsPolicy";
}