using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using PlaylistApp.ApiService.Constants;

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
            Title = ErrorTitles.InternalServerError,
            Detail = ErrorMessages.InternalServerError,
            Type = ErrorTypes.InternalServerError
        };

        httpContext.Response.StatusCode = problemDetails.Status.Value;
        await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);

        return true;
    }
}