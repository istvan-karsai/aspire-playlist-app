var builder = DistributedApplication.CreateBuilder(args);

var postgres = builder.AddPostgres("postgres")
                      .AddDatabase("playlistdb");

var apiService = builder.AddProject<Projects.PlaylistApp_ApiService>("apiservice")
                        .WithReference(postgres);

builder.AddNpmApp("react", "../PlaylistApp.Web", "dev")
       .WithReference(apiService)
       .WithHttpEndpoint(env: "PORT")
       .WithExternalHttpEndpoints();

builder.Build().Run();
