import { MinesweeperGame } from "./solo-game";

export { MinesweeperGame };
// export type MinesweeperGameDO = MinesweeperGame & DurableObject;

export interface Env {
  GAMES: DurableObjectNamespace;
  API_URL: string;
}

export default {
  async fetch(req: Request, env: Env) {
    const url = new URL(req.url);

    if (url.pathname === "/ws") {
      // Generate a session token (used as Durable Object identifier)
      // If provided, use it to reconnect to existing session
      let sessionToken = url.searchParams.get("sessionToken");
      if (!sessionToken) {
        // Generate a new random session token for security
        sessionToken = crypto.randomUUID();
      }

      // Use session token as the Durable Object identifier
      // This prevents users from guessing other game IDs
      const id = env.GAMES.idFromName(sessionToken);
      const stub = env.GAMES.get(id);

      // Pass the session token to the Durable Object
      const headers = new Headers(req.headers);
      headers.set("X-Session-Token", sessionToken);

      const request = new Request(req.url, {
        method: req.method,
        headers: headers,
        body: req.body,
      });

      return stub.fetch(request);
    }

    return new Response("OK");
  },
};
