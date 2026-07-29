using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace PlaylistApp.ApiService.ExceptionHandlers;

public partial class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger) : IExceptionHandler
{
    [LoggerMessage(
        Level = LogLevel.Error,
        Message = "An unhandled exception occured: {ErrorMessage}"
    )]
    private partial void LogUnhandledException(Exception ex, string errorMessage);

    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        LogUnhandledException(exception, exception.Message);

        var problemDetails = new ProblemDetails
        {
            Status = StatusCodes.Status500InternalServerError,
            Title = "Internal Server Error",
            Detail = "An unexpected error occurred while processing your request.",
            Type = "https://datatracker.ietf.org/doc/html/rfc7231#section-6.6.1"
        };

        httpContext.Response.StatusCode = problemDetails.Status.Value;
        await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);

        return true;
    }
}