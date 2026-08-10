namespace PlaylistApp.ApiService.Constants;

internal static class PolicyConstants
{
    public const string RateLimitingPolicy = "StrictMutationLimit";

    // Rate Limiting Policy Settings
    public const int PermitLimit = 10;
    public const int QueueLimit = 0;
    public static readonly TimeSpan Window = TimeSpan.FromMinutes(10);
}