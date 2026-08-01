# Full-Stack Music Playlist App (In Progress)

A modern, decoupled web application for managing music playlists, users, and artists. This project serves as a showcase of a production-ready .NET architecture, demonstrating container orchestration, full-text search optimization, and robust API design.

## 🏗️ Tech Stack

* **Backend:** C# / .NET 10 Web API, Entity Framework Core
* **Frontend:** React, TypeScript, Vite
* **Database:** PostgreSQL (utilizing `pg_trgm` for high-speed partial text search)
* **Orchestration:** .NET Aspire, Docker
* **Security:** ASP.NET Core Identity (Role-Based Access Control)

## 🚀 Current Status

**Active Development.** The current focus is scaffolding the .NET Aspire environment and establishing the normalized PostgreSQL database schema.

*Upcoming Milestones:*

* [ ] Scaffold Aspire infrastructure (API, React, Postgres)

* [ ] Implement EF Core models and Identity auth

* [ ] Build unified Search endpoint with Trigram indexing

* [ ] Implement debounced React search UI

* [ ] Deploy containerized stack to Linux VPS via Caddy

## 💻 How to Run Locally

Because this project uses .NET Aspire, local orchestration is entirely automated. You do not need to manually configure Docker containers or connection strings.

**Prerequisites:**
* .NET 10 SDK
* Node.js
* Docker Desktop (must be running)

**Execution:**
1. Clone the repository.
2. Navigate to the AppHost directory: `cd PlaylistApp.AppHost`
3. Run the orchestrator: `dotnet run`
4. The .NET Aspire Dashboard will open automatically in your browser, providing links and telemetry for the React frontend, the API, and the PostgreSQL database.

## End-to-End Testing

This repository uses [Playwright](https://playwright.dev/dotnet/) integrated with [.NET Aspire](https://learn.microsoft.com/en-us/dotnet/aspire/) for automated end-to-end testing. The test suite automatically spins up the database, backend, and frontend dynamically in a sandboxed environment without requiring you to run the application manually.

### Prerequisites

Before running the E2E tests for the first time, you must install the Playwright browsers:

1. Build the test project:
   `dotnet build PlaylistApp.Tests.E2E`
2. Install the browser binaries:
   `pwsh PlaylistApp.Tests.E2E/bin/Debug/net10.0/playwright.ps1 install`
   *(Alternatively, run `playwright install` if you have the global CLI installed).*

### Running the Suite

Execute the tests using the standard .NET CLI:
`dotnet test PlaylistApp.Tests.E2E`
