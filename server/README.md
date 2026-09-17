# BizPilotAI — Server

This folder contains the Express + Prisma server foundation for BizPilotAI.

Quick start (after installing dependencies):

1. Copy environment variables:

   cp .env.example .env

2. Install dependencies:

   npm install

3. Generate Prisma client and run migrations (requires DATABASE_URL configured):

   npx prisma generate
   npx prisma migrate dev --name init

4. Run server in development (uses `tsx` if available):

   npm run dev:server

Notes:
- If `npm install` fails due to network/proxy issues, fix your network or run behind a registry mirror.
- The health endpoint is at `/api/health` and performs a simple DB query to verify connectivity.
