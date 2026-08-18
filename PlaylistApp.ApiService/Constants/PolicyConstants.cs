namespace PlaylistApp.ApiService.Constants;

internal static class PolicyConstants
{
    // Rate Limiting Policy Settings
    public const string RateLimitingPolicy = "StrictMutationLimit";
    public const int PermitLimit = 100;
    public const int QueueLimit = 0;
    public static readonly TimeSpan Window = TimeSpan.FromMinutes(60);

    // CORS Policy Settings
    public const string CorsPolicy = "StrictCorsPolicy";
}