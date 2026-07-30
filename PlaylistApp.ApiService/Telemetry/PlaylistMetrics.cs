using System.Diagnostics.Metrics;

namespace PlaylistApp.ApiService.Telemetry;

public class PlaylistMetrics
{
    public const string MeterName = "PlaylistApp.ApiService.Domain";

    private readonly Meter _meter;

    public Counter<long> SongsCreatedCounter { get; }

    public PlaylistMetrics(IMeterFactory meterFactory)
    {
        _meter = meterFactory.Create(MeterName);

        SongsCreatedCounter = _meter.CreateCounter<long>(
            name: "playlist.songs.created",
            description: "The total number of songs created or requested in the system."
        );
    }
}