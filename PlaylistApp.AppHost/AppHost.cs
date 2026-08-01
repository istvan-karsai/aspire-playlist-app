var builder = DistributedApplication.CreateBuilder(args);

var postgres = builder.AddPostgres("postgres")
                      .WithPgAdmin()
                      .AddDatabase("playlistdb");

var apiService = builder.AddProject<Projects.PlaylistApp_ApiService>("apiservice")
                        .WithReference(postgres)
                        .WaitFor(postgres);

builder.AddNpmApp("frontend", "../PlaylistApp.Web", "dev")
       .WithReference(apiService)
       .WithHttpEndpoint(env: "PORT")
       .WithExternalHttpEndpoints();

builder.Build().Run();
