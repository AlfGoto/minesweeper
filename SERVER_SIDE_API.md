# Server-Side Rendering and API Configuration

## Changes Made

1. Implemented server-side rendering for the statistics page:
   - Changed `'use client'` to `'use server'` in the stats page
   - Moved data fetching to server-side using direct API calls
   - Used `getServerSession()` for authentication on the server

2. Environment variable configuration:
   - The frontend client component (Game) uses `NEXT_PUBLIC_WEBSOCKET_URL` to connect to the WebSocket server
   - The server-side rendered page (Stats) uses `API_URL` to fetch data directly from the API

3. API calls are now handled in two ways:
   - Game component connects directly to the WebSocket server
   - Stats page fetches data server-side during rendering

## Required Environment Variables

Create a `.env.local` file in the `frontend` directory with the following variables:

```
# Environment variables for Next.js server components
API_URL=http://localhost:3000/api

# Environment variables exposed to the client
NEXT_PUBLIC_WEBSOCKET_URL=http://localhost:3001

# Auth environment variables
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

And create a `.env` file in the `websocket` directory with:

```
# API URL for the websocket service
API_URL=http://localhost:3000/api
```

## Security Benefits

1. API keys and sensitive URLs used in the stats page are only available on the server side
2. Game results submission is handled securely through the WebSocket server
3. The WebSocket server communicates with the API using server-side environment variables
4. No need for API routes in the Next.js app, as WebSocket handles the game-related operations and stats are fetched server-side 