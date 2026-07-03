# Solace (Ujiyar) 🌱

> A real-time, AI-powered mental wellness and community platform designed to provide a safe space for self-reflection and peer support.

## 📖 About The Project

Solace (formerly known as Ujiyar) is a comprehensive full-stack application built to support mental well-being. It bridges the gap between private journaling and community support by offering an AI-powered empathetic coaching system alongside real-time, heavily moderated community chat rooms. 

The platform is engineered with a strict focus on user safety, real-time data delivery, and seamless AI integration.

## ✨ Key Features

* **Mood Dashboard & Private Journal:** Users can log their daily emotional baseline and write private journal entries.
* **AI Wellness Coach:** Integrates with Google's Gemini 2.5 Flash AI to read journal entries and provide empathetic, personalized feedback in real-time.
* **Real-Time Community Hub:** Live, WebSocket-driven chat rooms (`#venting-space`, `#wins-of-the-day`, `#anxiety-support`) for instant peer-to-peer connection.
* **Ghost Mode:** A privacy toggle allowing users to send messages anonymously to protect their identity while seeking support.
* **AI Safety Bouncer:** An automated, invisible moderation pipeline that evaluates every community message via AI before broadcasting, blocking severe threats or harmful content.

## 🛠️ Built With

**Frontend Architecture:**
* Angular 18+ (Standalone Components)
* TypeScript
* Microsoft SignalR (Client)
* Tailwind CSS / Custom CSS

**Backend Architecture:**
* .NET Core Web API (C#)
* Entity Framework Core (Code-First Migrations)
* PostgreSQL
* Microsoft SignalR (WebSockets)
* Google Gemini AI API (`HttpClient` Integration)

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites

* [.NET SDK](https://dotnet.microsoft.com/download) (Version 8.0 or higher)
* [Node.js and npm](https://nodejs.org/)
* [Angular CLI](https://angular.io/cli) (`npm install -g @angular/cli`)
* [PostgreSQL](https://www.postgresql.org/) (Running locally)
* A [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### 1. Backend Setup

1. Clone the repository and navigate to the backend folder:
   1. Clone the repository and navigate to the backend folder:
   ```bash
   git clone [https://github.com/Akshat12503/Ujiyar.git](https://github.com/Akshat12503/Ujiyar.git)
   cd Ujiyar/ujiyar-backend
Initialize the .NET Secret Manager to securely store your AI key:

Bash
cd src/UjiyarBackend.WebApi
dotnet user-secrets init
dotnet user-secrets set "GeminiApiKey" "YOUR_ACTUAL_API_KEY_HERE"
Apply Entity Framework migrations to build your PostgreSQL database:

Bash
cd ../..
dotnet ef database update --project src/UjiyarBackend.Infrastructure --startup-project src/UjiyarBackend.WebApi
Run the backend server (Defaults to http://localhost:5000):

Bash
dotnet run --project src/UjiyarBackend.WebApi

2. Frontend Setup
Open a new terminal and navigate to the frontend folder:

Bash
cd Ujiyar/ujiyar-frontend
Install the necessary NPM packages (including SignalR):

Bash
npm install
Start the Angular development server:

Bash
ng serve
Open your browser and navigate to http://localhost:4200.

🏗️ System Architecture Highlights
Real-Time State Management: Utilizes Angular's NgZone and RxJS BehaviorSubject to manage asynchronous WebSocket streams, ensuring the UI remains perfectly synchronized with backend broadcasts.

Isolated Database Contexts: The Entity Framework architecture strictly maps relationships between Users, ChatRooms, and ChatMessages using foreign keys, allowing for immediate historical message retrieval upon joining a room.

Secure API Handling: API keys are excluded from source control using .NET Secret Manager, preventing accidental exposure to GitHub's public repositories.

👨‍💻 Author
Akshat Kutariyar
Systems Engineer

Designed and engineered as a full-stack technical initiative.
   ```bash
   git clone [https://github.com/Akshat12503/Ujiyar.git](https://github.com/Akshat12503/Ujiyar.git)
   cd Ujiyar/ujiyar-backend
