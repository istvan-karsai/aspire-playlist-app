namespace PlaylistApp.ApiService.Constants;

public static class FormatConstants
{
    public const string DurationRegex = "^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$";
    public const string ZeroDuration = "00:00:00";
    public const string TimeSpanFormat = @"hh\:mm\:ss";
}