"use client";

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useSession } from "next-auth/react";
import { Cell } from "@/types/game";
import { WebSocketClient } from "@/lib/websocket-client";
import { ServerMessage } from "@/types/websocker-messages";
import { TOTAL_CELLS } from "@/vars";

type GameContextType = {
  getInitialCell: (id: number) => Cell;
  registerCellSetter: (id: number, setter: React.Dispatch<React.SetStateAction<Cell>>) => () => void;
  onCellClick: (id: number, clickType: "left" | "right") => void;
  restart: () => void;
  getTime: () => number;
  getStartTime: () => number | null;
  isGameOn: () => boolean;
  registerLoseDialogOpener: (opener: (open: boolean) => void) => () => void;
  registerWinDialogOpener: (opener: (open: boolean) => void) => () => void;
};

export const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const sessionRef = useRef(session);
  sessionRef.current = session; // Always keep ref in sync with latest session
  const gameOnRef = useRef(true);
  const timeRef = useRef<number>(0);
  const startTimeRef = useRef<number | null>(null);
  const wsClientRef = useRef<WebSocketClient | null>(null);
  const hasLoggedInRef = useRef(false);
  const isConnectedRef = useRef(false);

  // Store initial cells in a ref (never changes, just for initial values)
  const initialCellsRef = useRef<Map<number, Cell> | null>(null);

  // Lazy initialization function
  const getInitialCellsMap = useCallback((): Map<number, Cell> => {
    if (!initialCellsRef.current) {
      const map = new Map();
      for (let i = 0; i < TOTAL_CELLS; i++) {
        map.set(i, { status: "hidden", value: 0 });
      }
      initialCellsRef.current = map;
    }
    return initialCellsRef.current;
  }, []);

  // Map of cell ID -> setState function for that cell
  const cellSettersRef = useRef<Map<number, React.Dispatch<React.SetStateAction<Cell>>>>(new Map());

  // Ref to store the function that opens/closes the lose dialog
  const loseDialogOpenerRef = useRef<((open: boolean) => void) | null>(null);
  // Ref to store the function that opens/closes the win dialog
  const winDialogOpenerRef = useRef<((open: boolean) => void) | null>(null);

  // Get initial cell value
  const getInitialCell = useCallback(
    (id: number): Cell => {
      return getInitialCellsMap().get(id) || { status: "hidden", value: 0 };
    },
    [getInitialCellsMap],
  );

  // Register a cell's setState function
  const registerCellSetter = useCallback(
    (id: number, setter: React.Dispatch<React.SetStateAction<Cell>>): (() => void) => {
      cellSettersRef.current.set(id, setter);

      // Return unsubscribe function
      return () => {
        cellSettersRef.current.delete(id);
      };
    },
    [],
  );

  // Register the function that opens/closes the lose dialog
  const registerLoseDialogOpener = useCallback(
    (opener: (open: boolean) => void): (() => void) => {
      loseDialogOpenerRef.current = opener;
      return () => {
        loseDialogOpenerRef.current = null;
      };
    },
    [],
  );

  // Register the function that opens/closes the win dialog
  const registerWinDialogOpener = useCallback(
    (opener: (open: boolean) => void): (() => void) => {
      winDialogOpenerRef.current = opener;
      return () => {
        winDialogOpenerRef.current = null;
      };
    },
    [],
  );

  // Reset all cells to initial state
  const resetAllCells = useCallback(() => {
    // Reset the initial cells map
    initialCellsRef.current = null;
    getInitialCellsMap(); // Reinitialize the map

    // Reset all registered cells to hidden state
    const hiddenCell: Cell = { status: "hidden", value: 0 };
    cellSettersRef.current.forEach((setter) => {
      setter(hiddenCell);
    });
  }, [getInitialCellsMap]);

  const restart = useCallback(() => {
    gameOnRef.current = true;
    timeRef.current = 0;
    startTimeRef.current = null;
    // Close the lose dialog
    if (loseDialogOpenerRef.current) {
      loseDialogOpenerRef.current(false);
    }
    // Close the win dialog
    if (winDialogOpenerRef.current) {
      winDialogOpenerRef.current(false);
    }
    resetAllCells();
    wsClientRef.current?.send({
      type: "RESTART",
    });
  }, [resetAllCells]);

  // Handle websocket messages
  const handleMessage = useCallback((message: ServerMessage) => {
    if (message.type === "UPDATE") {
      const content = message.payload;

      if (content.type === "REVEAL") {
        if (startTimeRef.current === null) {
          startTimeRef.current = Date.now();
        }
        gameOnRef.current = true;
        const cellId = content.id;
        const newCell: Cell = {
          status: "revealed",
          value: content.value,
        };

        const setter = cellSettersRef.current.get(cellId);
        if (setter) {
          setter(newCell); // Only this cell re-renders!
        }
      } else if (content.type === "FLAG") {
        const cellId = content.id;
        const newCell: Cell = {
          status: content.flagged ? "flagged" : "hidden",
          value: 0,
        };
        const setter = cellSettersRef.current.get(cellId);
        if (setter) {
          setter(newCell);
        }
      } else if (content.type === "LOSE") {
        gameOnRef.current = false;
        timeRef.current = content.time;
        // Open the lose dialog after 2 seconds
        if (loseDialogOpenerRef.current) {
          setTimeout(() => {
            // Only open if game is still off (not restarted)
            if (!gameOnRef.current && loseDialogOpenerRef.current) {
              loseDialogOpenerRef.current(true);
            }
          }, 2000);
        }
        content.grid.forEach((cell, index) => {
          if (cell.value !== "bomb") return;

          const setter = cellSettersRef.current.get(index);
          if (setter) {
            setTimeout(
              () => {
                if (gameOnRef.current) return;
                setter({
                  status: "revealed",
                  value: cell.value,
                });
              },
              100 * Math.floor(Math.random() * 30),
            );
          }
        });
      } else if (content.type === "WIN") {
        gameOnRef.current = false;
        timeRef.current = content.time;

        // Trigger win animation on all revealed and flagged cells with staggered delays
        cellSettersRef.current.forEach((setter, index) => {
          setTimeout(
            () => {
              if (gameOnRef.current) return;
              setter((prevCell) => {
                if (prevCell.status === "revealed") {
                  return { ...prevCell, status: "winning" };
                }
                if (prevCell.status === "flagged") {
                  return { status: "winning", value: "bomb" };
                }
                return prevCell;
              });
            },
            100 * Math.floor(Math.random() * 50),
          );
        });

        // Open the win dialog after 2 seconds
        if (winDialogOpenerRef.current) {
          setTimeout(() => {
            // Only open if game is still off (not restarted)
            if (!gameOnRef.current && winDialogOpenerRef.current) {
              winDialogOpenerRef.current(true);
            }
          }, 2000);
        }
      }
    }
  }, []);

  const onCellClick = useCallback((id: number, clickType: "left" | "right") => {
    if (clickType === "left") {
      wsClientRef.current?.send({
        type: "LEFT_CLICK",
        id,
      });
    } else {
      wsClientRef.current?.send({
        type: "RIGHT_CLICK",
        id,
      });
    }
  }, []);

  // Set up websocket connection
  useEffect(() => {
    // Only connect on client side
    if (typeof window === "undefined") return;

    // Get websocket URL from environment variable
    const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL!;
    const client = new WebSocketClient(wsUrl);
    wsClientRef.current = client;

    // Subscribe to messages
    const unsubscribe = client.onMessage(handleMessage);

    // Subscribe to connection events
    const unsubscribeConnect = client.onConnect(() => {
      console.log("WebSocket connected");
      isConnectedRef.current = true;
      hasLoggedInRef.current = false;
      resetAllCells();

      // Send LOGIN immediately if session is available
      const currentSession = sessionRef.current;
      if (currentSession?.user?.email && !hasLoggedInRef.current) {
        console.log("Sending LOGIN on connect for authenticated user");
        client.send({
          type: "LOGIN",
          userEmail: currentSession.user.email,
          userName: currentSession.user.name || "Anonymous",
          userPicture: currentSession.user.image || "",
        });
        hasLoggedInRef.current = true;
      }
    });

    // Connect
    client.connect();

    // Cleanup: disconnect on unmount
    return () => {
      unsubscribe();
      unsubscribeConnect();
      client.disconnect();
      wsClientRef.current = null;
      isConnectedRef.current = false;
      hasLoggedInRef.current = false;
    };
  }, [handleMessage, resetAllCells]);

  // Send LOGIN when session becomes available and websocket is connected
  useEffect(() => {
    if (
      session?.user?.email &&
      isConnectedRef.current &&
      !hasLoggedInRef.current &&
      wsClientRef.current
    ) {
      console.log("Sending LOGIN for authenticated user");
      wsClientRef.current.send({
        type: "LOGIN",
        userEmail: session.user.email,
        userName: session.user.name || "Anonymous",
        userPicture: session.user.image || "",
      });
      hasLoggedInRef.current = true;
    }
  }, [session]);

  // Getter function for time
  const getTime = useCallback(() => {
    return timeRef.current;
  }, []);

  // Getter function for start time
  const getStartTime = useCallback(() => {
    return startTimeRef.current;
  }, []);

  // Getter function for game state
  const isGameOn = useCallback(() => {
    return gameOnRef.current;
  }, []);

  // Context value - all references are stable
  const value = useMemo(
    () => ({
      getInitialCell,
      registerCellSetter,
      onCellClick,
      restart,
      getTime,
      getStartTime,
      isGameOn,
      registerLoseDialogOpener,
      registerWinDialogOpener,
    }),
    [
      getInitialCell,
      registerCellSetter,
      onCellClick,
      restart,
      getTime,
      getStartTime,
      isGameOn,
      registerLoseDialogOpener,
      registerWinDialogOpener,
    ],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within GameProvider");
  }
  return context;
}

// Custom hook that subscribes to only a specific cell
// Each cell manages its own state and registers its setter with the provider
export function useCell(id: number) {
  const { getInitialCell, registerCellSetter, onCellClick } = useGame();

  // Each cell has its own local state
  const [cell, setCell] = useState<Cell>(() => getInitialCell(id));

  // Register this cell's setter so provider can update it directly
  useEffect(() => {
    const unregister = registerCellSetter(id, setCell);
    return unregister;
  }, [id, registerCellSetter]);

  return useMemo(
    () => ({
      cell,
      onCellClick,
    }),
    [cell, onCellClick],
  );
}
