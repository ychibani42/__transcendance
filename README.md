Transcendence is a full-stack online Pong platform built as a modern web application, combining a **NestJS** backend, **PostgreSQL + Prisma** persistence, and a **Vue.js** SPA frontend, all orchestrated with **Docker Compose**.

## Backend – NestJS API & Game Server

The backend is a **NestJS** application exposing both REST endpoints and WebSocket gateways for real-time features. It is structured around feature modules:

- **Auth module**  
  - Local login with hashed passwords (e.g. bcrypt) and **42 OAuth** via the intra API.  
  - **JWT**-based authentication with access and refresh tokens stored in HTTP-only cookies or headers.  
  - Optional **Two-Factor Authentication (2FA)** using TOTP (e.g. `otplib` or Speakeasy) and QR codes, with dedicated guards enforcing 2FA completion before granting access.

- **Users module**  
  - CRUD for users, profile editing (username, status, bio), and **avatar upload** (local storage or object storage bucket).  
  - Social graph: **friends**, **pending requests**, and **blocked users**, all persisted in relational tables with proper foreign keys.  
  - Public profile endpoints to fetch matches, rank, and stats.

- **Game module (Pong engine)**  
  - A **WebSocket gateway** (NestJS `@WebSocketGateway`) managing rooms, matchmaking queues, in-game state, and events such as `joinGame`, `ready`, `movePaddle`, and `scoreUpdate`.
  - A discrete game loop (using `setInterval` or RxJS) handling ball physics, paddle movement, collision detection, and scoring.  
  - Match data persisted as `Match` entities via Prisma, including players, result, scores, timestamps, and match type (ladder, friendly, custom).  

- **Chat module**  
  - WebSocket-based **real-time chat** integrated with the user system.  
  - Supports **public channels**, **private channels**, **password-protected channels**, and **direct messages (DMs)**.  
  - Channel roles: **owner**, **admin**, **member**, plus moderation actions: mute, ban, invite, kick.  
  - Server enforces permissions and stores channel membership, bans, and messages via Prisma models.

- **Stats / Ladder module**  
  - Exposes endpoints to fetch a **global ladder**, per-user stats (wins, losses, win rate), and recent match history.  
  - Optional **Elo- or Glicko-style rating** logic in a dedicated service, updating ratings after each match.

- **Common module**  
  - Shared DTOs (class-validator), interceptors (logging, response shaping), exception filters, and custom guards (auth, role-based, 2FA).

The backend is containerized with a dedicated **Dockerfile**, including Nest build steps (`npm install`, `npm run build`, `npm run start:prod`) and environment configuration loaded via `.env` or `exempleENV`.

## Database – PostgreSQL with Prisma ORM

Transcendence uses **PostgreSQL** as the primary database, accessed through **Prisma** as a type-safe ORM.

- **Prisma schema** models entities such as:
  - `User` (id, intraId, username, avatar, status, 2FA fields).  
  - `Friendship` and `Block` relations between users.  
  - `Channel`, `ChannelMembership`, `ChannelBan`, `ChannelMessage` for chat.  
  - `Match` and `MatchParticipant` for game history and stats.  

- **Migrations** are managed via Prisma CLI (`prisma migrate dev` / `deploy`), typically run from a script (e.g. `migrate.sh`) or a Docker entrypoint.  

- Queries are encapsulated inside NestJS services, never directly exposed to controllers, which keeps a clean service layer with strong typing and clear boundaries.

The database runs as its own **Docker service** (`postgres` image) in `docker-compose.yml`, with volumes for data persistence and network-isolated communication between backend and DB.

## Frontend – Vue.js Single Page Application

The frontend is a **Vue.js** SPA (either plain Vue 3 with Vite or Nuxt-style structure) consuming the NestJS REST API and WebSockets.

- **Routing & layout**  
  - A global router (Vue Router) defining routes like `/login`, `/2fa`, `/profile/:id`, `/game`, `/chat`, `/ladder`.  
  - Layout components for **navbar/sidebars**, and responsive design for desktop and mobile.  

- **State management**  
  - Centralized store (Pinia or Vuex) managing authenticated user, tokens, socket connection state, active game, and chat state.  

- **Auth UX**  
  - Login and signup screens with optional **42 OAuth** redirect flows and 2FA validation.  
  - Guards on protected routes to ensure JWT validity and 2FA completion before entering game or chat views.  

- **Game UI**  
  - A dedicated game page rendering Pong using an HTML5 `<canvas>` or SVG.  
  - Smooth keyboard input handling and real-time updates via WebSockets, with prediction/lerp for a responsive feel.  
  - Visual feedback for scores, match timer, pauses, and match result.  

- **Chat UI**  
  - Channel list, DM list, and conversation panel, with real-time message streaming via a shared WebSocket connection.  
  - UI for creating channels, setting passwords, inviting users, and displaying mutes/bans.  

- **Profile & ladder**  
  - Profile view showing avatar, username, online status, stats, and recent matches.  
  - Ladder page listing top players with rank and rating, consuming stats endpoints from the backend.

The frontend is also containerized with its own **Dockerfile**, typically built with `npm run build` and served either by a Node server or a static file server (nginx) behind the same reverse proxy as the backend.
## Infrastructure & DevOps – Docker Compose & Environment

Transcendence is designed to be started end-to-end with a single command via **Docker Compose**.

- **docker-compose.yml** defines services such as:
  - `backend`: NestJS service connecting to `db`, exposing `/api` and a WebSocket endpoint (e.g. `/socket.io` or `/ws`).  
  - `frontend`: Vue app served on another port (e.g. `http://localhost:8080`).  
  - `db`: PostgreSQL with configured user, password, and database name.  
  - Optional `proxy`: Nginx or Traefik fronting both backend and frontend on a single public port with path-based routing.  

- **exempleENV** documents required environment variables:
  - DB connection (`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `DATABASE_URL`).  
  - JWT secrets and expiration times.  
  - 42 OAuth credentials (client id/secret, callback URL).  
  - Optional email provider settings for account notifications or password reset.
- **Makefile** provides shortcuts:
  - `make up` / `make down` to start/stop the whole stack.  
  - `make backend`, `make frontend` for local development without containers.  
  - `make migrate` to apply Prisma migrations against the running DB.  

This setup makes the project reproducible for peers and evaluators: cloning the repo, copying `exempleENV` to `.env`, and running `docker-compose up` spins up a fully functional Transcendence instance.

## Security & Real-Time Considerations

- **Security**  
  - JWT tokens stored securely (HTTP-only cookies when possible), CSRF-aware frontend handling.  
  - Rate limiting and input validation via NestJS pipes (`class-validator`) to prevent malformed requests and basic abuse.  
  - Channel and game actions always checked server-side against user roles and relationships (blocked, banned).

- **Real-time robustness**  
  - WebSocket events namespaced (e.g. `/game` and `/chat`) to avoid collisions.  
  - Reconnection logic on the frontend to rejoin matches and chat rooms after temporary network interruptions.  
  - Game state authority kept strictly on the server, with the client considered a “dumb terminal” sending inputs only, preventing cheating.

Overall, Transcendence showcases a **full modern web stack** (NestJS + Prisma + PostgreSQL + Vue.js + Docker) implementing auth, social features, real-time chat, and a networked Pong game in line with the 42 project specifications.
