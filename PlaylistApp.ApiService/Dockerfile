FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["Directory.Build.props", "."]
COPY ["Directory.Packages.props", "."]

COPY ["PlaylistApp.ApiService/PlaylistApp.ApiService.csproj", "PlaylistApp.ApiService/"]
COPY ["PlaylistApp.ServiceDefaults/PlaylistApp.ServiceDefaults.csproj", "PlaylistApp.ServiceDefaults/"]
RUN dotnet restore "PlaylistApp.ApiService/PlaylistApp.ApiService.csproj"

COPY . .
WORKDIR "/src/PlaylistApp.ApiService"
RUN dotnet publish "PlaylistApp.ApiService.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_HTTP_PORTS=8080
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "PlaylistApp.ApiService.dll"]