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