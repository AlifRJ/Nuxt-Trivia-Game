# Trivio

Trivio is a trivia game where you can choose a category and difficulty, answer questions, and track your scores.

## Features

- Play 10-question quizzes across categories such as science, history, geography, and sports.
- Choose from easy, medium, and hard difficulty levels.
- Create an account, sign in, and save scores to the leaderboard.
- Refresh authentication sessions when access tokens expire.

## Demo

Try Trivio: [nuxt-trivia-game.vercel.app](https://nuxt-trivia-game.vercel.app)

## Screenshots

| Quiz setup | Leaderboard |
| --- | --- |
| ![Trivio quiz setup screen]() | ![Trivio leaderboard screen]() |

| Gameplay | Results |
| --- | --- |
| ![Trivio gameplay screen]() | ![Trivio quiz results screen]() |

## Backend

This repository contains the Nuxt frontend. It connects to a separate backend service, configured with `NUXT_API_BASE_URL`. The backend is responsible for:

- Creating and storing user accounts and credential data, and verifying login credentials.
- Issuing and verifying JWT access and refresh tokens, and managing refresh-token state.
- Authenticating score submissions and storing scores for the leaderboard.

The Nuxt server routes communicate with the backend; the browser does not call the backend API directly for these operations. Run the backend separately and point `NUXT_API_BASE_URL` to its base URL.

## Security

- **Cookie-based sessions:** [Nuxt Auth Utils](https://github.com/atinux/nuxt-auth-utils) manages encrypted user sessions. The session includes user information and keeps the access token in the session's secure data.
- **Secure cookie defaults:** In production, the session cookie is `HttpOnly`, `Secure` (sent over HTTPS only), and `SameSite=Lax`. The `Secure` flag is disabled by the module in development to support local HTTP.
- **Server-side authentication:** Nuxt server API routes handle login, token refresh, logout, and authenticated score submission. The frontend forwards backend refresh-cookie headers, refreshes the access token when needed, and clears the local session on logout or failed refresh.
- **Zod request validation:** Login, registration, and score request bodies are validated on the server before being sent to the backend.
  - Registration requires a name of at least 3 characters, a username of 3–20 characters, a valid email, and a password of at least 6 characters.
  - Login requires a non-empty username/email and password.
  - Score submissions require a non-negative numeric score and string category and difficulty values.

## Technology

- [Nuxt](https://nuxt.com/)
- [Nuxt Auth Utils](https://github.com/atinux/nuxt-auth-utils)
- [Zod](https://zod.dev/)
- [Open Trivia Database](https://opentdb.com/) for the trivia question bank

## Setup

Install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

### Environment variables

Create a `.env` file in the project root and configure:

```dotenv
# Use a unique, random value of at least 32 characters.
NUXT_SESSION_PASSWORD=replace-with-a-strong-random-secret-of-at-least-32-characters

# URL of the backend API service.
NUXT_API_BASE_URL=http://localhost:8080
```

Set `NUXT_SESSION_PASSWORD` to a strong secret in every deployed environment; do not commit real secrets. `NUXT_API_BASE_URL` defaults to `http://localhost:8080` if it is not set.

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```