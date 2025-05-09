import { io, Socket } from 'socket.io-client';
import { Cell, GameState, GridPosition } from '@/types/game';

// Custom types for the service
type GameStateCallback = (state: GameState) => void;
type ConnectionCallback = (connected: boolean) => void;
type CellUpdatesCallback = (updates: { row: number, col: number, cell: Cell }[]) => void;
type ErrorCallback = (error: string) => void;

class GameService {
  private socket: Socket | null = null;
  private gameStateCallback: GameStateCallback | null = null;
  private connectionCallback: ConnectionCallback | null = null;
  private cellUpdatesCallback: CellUpdatesCallback | null = null;
  private errorCallback: ErrorCallback | null = null;
  private pendingActions: {type: string, data: any}[] = [];
  private lastUpdateTime = 0;
  private updateInterval: NodeJS.Timeout | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private isConnecting = false;

  // Connect to WebSocket server
  connect(userId: string, userName: string, userImage: string | null) {
    if (this.socket?.connected || this.isConnecting) return;
    
    this.isConnecting = true;
  
    this.socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:3001', {
      auth: {
        sessionId: userId,
        userName: userName,
        userImage: userImage
      },
      // Socket.IO options for performance
      transports: ['websocket'],
      upgrade: false,
      reconnectionAttempts: this.maxReconnectAttempts,
      timeout: 10000,
    });
  
    this.setupEventListeners();
    this.startUpdateInterval();
  }

  // Set up WebSocket event listeners
  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      this.connectionCallback?.(true);
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      this.connectionCallback?.(false);
      
      // Try to reconnect if not reached max attempts
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        // Don't auto-reconnect here, we let socket.io handle it
      }
    });

    this.socket.on('gameState', (state: GameState) => {
      console.log('Received gameState event', { gameOver: state.gameOver, gameWon: state.gameWon });
      this.gameStateCallback?.(state);
    });

    this.socket.on('cellUpdates', (updates: { row: number, col: number, cell: Cell }[]) => {
      console.log('Received cellUpdates event', { count: updates.length });
      this.cellUpdatesCallback?.(updates);
    });

    this.socket.on('error', (error: string) => {
      console.error('WebSocket error:', error);
      this.errorCallback?.(error);
    });
  }

  // Start interval to batch and send updates
  private startUpdateInterval() {
    // Clear any existing interval
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    // Create a new interval to process pending actions
    this.updateInterval = setInterval(() => {
      this.processActions();
    }, 30); // Send updates every 30ms for responsive feel
  }

  // Process and send pending actions
  private processActions() {
    if (!this.socket?.connected || this.pendingActions.length === 0) return;

    const now = Date.now();
    if (now - this.lastUpdateTime < 30) return; // Throttle updates

    // Deduplicate actions - only keep latest actions for each cell
    const uniqueActions: Record<string, any> = {};
    
    for (const action of this.pendingActions) {
      if (action.type === 'revealCell') {
        const key = `reveal_${action.data.row}_${action.data.col}`;
        uniqueActions[key] = action;
      } else if (action.type === 'toggleFlag') {
        const key = `flag_${action.data.row}_${action.data.col}`;
        // Don't override a reveal on same cell
        const revealKey = `reveal_${action.data.row}_${action.data.col}`;
        if (!uniqueActions[revealKey]) {
          uniqueActions[key] = action;
        }
      } else if (action.type === 'chordAction') {
        const key = `chord_${action.data.row}_${action.data.col}`;
        uniqueActions[key] = action;
      } else {
        const key = action.type;
        uniqueActions[key] = action;
      }
    }

    // Convert back to array
    const batchedActions = Object.values(uniqueActions);
    
    // Send batched actions or individual actions
    if (batchedActions.length > 1 && typeof this.socket.emit === 'function') {
      this.socket.emit('batchActions', batchedActions);
    } else if (batchedActions.length === 1) {
      const action = batchedActions[0];
      this.socket.emit(action.type, action.data);
    }
    
    // Clear pending actions and update timestamp
    this.pendingActions = [];
    this.lastUpdateTime = now;
  }

  // Queue action to be sent to server
  queueAction(type: string, data: any) {
    this.pendingActions.push({ type, data });
    
    // Try to process immediately for faster response
    this.processActions();
  }

  // Game actions
  revealCell(row: number, col: number) {
    this.queueAction('revealCell', { row, col });
  }

  toggleFlag(row: number, col: number) {
    this.queueAction('toggleFlag', { row, col });
  }

  chordAction(row: number, col: number, cellsToReveal: GridPosition[]) {
    this.queueAction('chordAction', { row, col, cellsToReveal });
  }

  restartGame() {
    this.queueAction('restartGame', {});
  }

  // Register callbacks
  onGameState(callback: GameStateCallback) {
    this.gameStateCallback = callback;
  }

  onConnection(callback: ConnectionCallback) {
    this.connectionCallback = callback;
  }

  onCellUpdates(callback: CellUpdatesCallback) {
    this.cellUpdatesCallback = callback;
  }

  onError(callback: ErrorCallback) {
    this.errorCallback = callback;
  }

  // Cleanup
  disconnect() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    this.pendingActions = [];
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnecting = false;
  }
}

// Create singleton instance
const gameService = new GameService();
export default gameService; 