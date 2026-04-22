import type { ClientMessage, Grid, ServerMessage } from "./types";
import { flagCell } from "./utils/flag-cell";
import { revealCell } from "./utils/reveal-cell";
import { restart } from "./utils/restart";

export class MinesweeperGame {
  public socket: WebSocket | null = null;
  public grid: Grid = [];
  public apiUrl: string = "";

  public isLost: boolean = false;
  public flags: number = 0;
  public reveals: number = 0;
  public startDate: number = new Date().getTime();

  public userEmail: string = "";
  public userName: string = "";
  public userPicture: string = "";

  constructor(
    private state: DurableObjectState,
    private env: unknown,
  ) {
    this.apiUrl = (env as any).API_URL || "";
  }

  async fetch(req: Request): Promise<Response> {
    if (req.headers.get("Upgrade") !== "websocket") {
      return new Response("Expected websocket", { status: 426 });
    }

    // Load grid from storage if it exists
    const storedGrid = await this.state.storage.get<Grid>("grid");
    if (storedGrid) {
      this.grid = storedGrid;
    } else {
      // No stored grid means fresh game - reset all game state
      this.grid = [];
      this.isLost = false;
      this.flags = 0;
      this.reveals = 0;
      this.startDate = new Date().getTime();
    }

    // Use the Durable Object's ID as the connection identifier
    // This uniquely identifies this WebSocket connection's game instance
    const connectionId = this.state.id.toString();

    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);

    server.accept();

    // Replace existing connection if any
    if (this.socket) {
      try {
        this.socket.close(1000, "Replaced by new connection");
      } catch {}
    }

    this.socket = server;

    server.addEventListener("message", (event) => {
      this.onMessage(event.data).catch(console.error);
    });

    server.addEventListener("close", () => {
      if (this.socket === server) {
        this.socket = null;
      }
    });

    // Send the Durable Object ID (which uniquely identifies this WebSocket connection)
    this.send({
      type: "INIT",
      payload: "MOCK_GRID_INIT",
      connectionId: connectionId,
    });

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }

  public async onMessage(raw: string) {
    let msg: ClientMessage;

    try {
      msg = JSON.parse(raw);
    } catch {
      return this.sendError("Invalid JSON");
    }

    try {
      if (msg.type === "LEFT_CLICK") {
        if (this.isLost) return;
        await revealCell(this, msg.id);
        await this.state.storage.put("grid", this.grid, {
          expirationTtl: 1800,
        } as any);
      } else if (msg.type === "RIGHT_CLICK") {
        if (this.isLost) return;
        flagCell(this, msg.id);
        await this.state.storage.put("grid", this.grid, {
          expirationTtl: 1800,
        } as any);
      } else if (msg.type === "RESTART") {
        await restart(this);
      } else if (msg.type === "LOGIN") {
        this.userEmail = msg.userEmail;
        this.userName = msg.userName;
        this.userPicture = msg.userPicture;
      }
    } catch (error) {
      this.sendError(error instanceof Error ? error.message : "Unknown error");
      console.error(error);
    }
  }

  public send(message: ServerMessage) {
    if (!this.socket) return;
    this.socket.send(JSON.stringify(message));
  }

  public sendError(message: string) {
    this.send({
      type: "ERROR",
      message,
    });
  }
}
