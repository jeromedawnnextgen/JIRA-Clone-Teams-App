# Jira Clone — Microsoft Teams App

A Jira-style project management app built as a Microsoft Teams tab. Features a Kanban board, backlog, and sprint planning with a REST API backend. Built with React 19, Fluent UI v9, and the Microsoft 365 Agents Toolkit.

## Features

- **Kanban Board** — Drag-and-drop cards across To Do / In Progress / Done columns
- **Backlog** — Filterable table of all issues with create/edit/delete
- **Sprint Planning** — Create sprints, add issues, start and complete sprints
- **REST API** — Express backend at `/api/issues` and `/api/sprints` (in-memory store)

## Prerequisites

- [Node.js](https://nodejs.org/) v20+
- A [Microsoft 365 Developer account](https://developer.microsoft.com/microsoft-365/dev-program)
- [Microsoft 365 Agents Toolkit VS Code Extension](https://aka.ms/teams-toolkit) v6.0.0+

## Run Locally

```bash
npm install
npm start
```

Open [http://localhost:3978/tabs/home](http://localhost:3978/tabs/home) in your browser.

To run inside Teams (with hot reload), press **F5** in VS Code. This sideloads the app into your M365 developer tenant.

## Deploy to Azure

> **Note:** The Azure App Service SKU is set to **B1** (~$13/month). You can delete the resource group after testing to stop charges.

### Prerequisites
- An Azure subscription
- Sign into Azure via the Teams Toolkit sidebar in VS Code (Accounts → Sign in to Azure)

### Steps

1. **Provision** — Creates the Azure App Service and updates the manifest with the live URL.
   - Teams Toolkit sidebar → **Lifecycle** → **Provision**
   - Select your Azure subscription and create/select a resource group (e.g. `rg-jira-clone-teams-app`)
   - Wait ~2 minutes for ARM deployment to complete

2. **Deploy** — Builds and uploads the app to Azure.
   - Teams Toolkit sidebar → **Lifecycle** → **Deploy**

3. **Publish** — Submits the app to your Teams organization.
   - Teams Toolkit sidebar → **Lifecycle** → **Publish**
   - Go to [admin.teams.microsoft.com](https://admin.teams.microsoft.com) → **Manage apps** → find "JiraClone" → click **Publish** to approve
   - In Teams: **Apps** → **Built for your org** → install the app

### Clean up
To avoid ongoing charges, delete the resource group in the [Azure Portal](https://portal.azure.com) when done.

## Project Structure

| Path | Description |
| ---- | ----------- |
| `src/index.ts` | Express server entry point, mounts API routes |
| `src/store.ts` | In-memory data store (Issues + Sprints) |
| `src/routes/issues.ts` | REST API: GET/POST/PATCH/DELETE `/api/issues` |
| `src/routes/sprints.ts` | REST API: sprint CRUD + start/complete/addIssue |
| `src/Tab/App.tsx` | React app shell (FluentProvider + BrowserRouter) |
| `src/Tab/components/board/` | Kanban board with drag-and-drop |
| `src/Tab/components/backlog/` | Backlog table with filters |
| `src/Tab/components/sprints/` | Sprint planning view |
| `appPackage/manifest.json` | Teams app manifest |
| `infra/azure.bicep` | Azure App Service Bicep template |
| `m365agents.yml` | M365 Agents Toolkit lifecycle config |

## Tech Stack

- **Frontend:** React 19, Fluent UI v9, react-router-dom v7, @dnd-kit
- **Backend:** Node.js, @microsoft/teams.apps, Express
- **Build:** Vite (frontend), tsup (backend)
- **Deployment:** Azure App Service (B1), Microsoft 365 Agents Toolkit
