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
import { HEIGHT, TOTAL_CELLS } from "@/vars";

type GameContextType = {
  getInitialCell: (id: number) => Cell;
  getCellSnapshot: (id: number) => Cell;
  cellsRevision: number;
  registerCellSetter: (
    id: number,
    setter: React.Dispatch<React.SetStateAction<Cell>>,
  ) => () => void;
  onCellClick: (id: number, clickType: "left" | "right") => void;
  restart: () => void;
  getTime: () => number;
  getStartTime: () => number | null;
  isGameOn: () => boolean;
  registerLoseDialogOpener: (opener: (open: boolean) => void) => () => void;
  registerWinDialogOpener: (opener: (open: boolean) => void) => () => void;
  updateCellOptimistically: (
    id: number,
    updater: (prevCell: Cell) => Cell,
  ) => void;
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
  const [cellsRevision, setCellsRevision] = useState(0);

  // Store initial cells in a ref (never changes, just for initial values)
  const initialCellsRef = useRef<Map<number, Cell> | null>(null);
  const cellsSnapshotRef = useRef<Map<number, Cell>>(new Map());

  // Lazy initialization function
  const getInitialCellsMap = useCallback((): Map<number, Cell> => {
    if (!initialCellsRef.current) {
      const map = new Map();
      for (let i = 0; i < TOTAL_CELLS; i++) {
        map.set(i, { status: "hidden", value: 0 });
      }
      initialCellsRef.current = map;
      cellsSnapshotRef.current = new Map(map);
    }
    return initialCellsRef.current;
  }, []);

  const getCellSnapshot = useCallback(
    (id: number): Cell =>
      cellsSnapshotRef.current.get(id) || { status: "hidden", value: 0 },
    [],
  );

  // Map of cell ID -> setState function for that cell
  const cellSettersRef = useRef<
    Map<number, React.Dispatch<React.SetStateAction<Cell>>>
  >(new Map());

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

  const refreshNeighborCells = useCallback((id: number) => {
    const row = Math.floor(id / HEIGHT);
    const col = id % HEIGHT;
    const neighborIds: number[] = [];

    for (let dRow = -1; dRow <= 1; dRow++) {
      for (let dCol = -1; dCol <= 1; dCol++) {
        if (dRow === 0 && dCol === 0) continue;

        const nRow = row + dRow;
        const nCol = col + dCol;
        if (nRow < 0 || nRow >= HEIGHT || nCol < 0 || nCol >= HEIGHT) continue;
        neighborIds.push(nRow * HEIGHT + nCol);
      }
    }

    for (const neighborId of neighborIds) {
      const neighborSetter = cellSettersRef.current.get(neighborId);
      if (!neighborSetter) continue;

      // Force a local re-render so skins depending on neighbor context can refresh.
      neighborSetter((prevCell) => ({ ...prevCell }));
    }
  }, []);

  // Register a cell's setState function
  const registerCellSetter = useCallback(
    (
      id: number,
      setter: React.Dispatch<React.SetStateAction<Cell>>,
    ): (() => void) => {
      const wrappedSetter: React.Dispatch<React.SetStateAction<Cell>> = (
        action,
      ) => {
        setter((prevCell) => {
          const baseline = cellsSnapshotRef.current.get(id) || prevCell;
          const nextCell =
            typeof action === "function"
              ? (action as (prevState: Cell) => Cell)(baseline)
              : action;

          const changed =
            nextCell.status !== baseline.status ||
            nextCell.value !== baseline.value;

          if (changed) {
            cellsSnapshotRef.current.set(id, nextCell);
            setCellsRevision((prev) => prev + 1);
            const isRevealAnimationTransition =
              nextCell.status === "revealed" &&
              nextCell.value !== "bomb" &&
              baseline.status !== "revealed";

            if (isRevealAnimationTransition) {
              setTimeout(() => {
                refreshNeighborCells(id);
              }, 120);
            } else {
              refreshNeighborCells(id);
            }
          }

          return nextCell;
        });
      };

      cellSettersRef.current.set(id, wrappedSetter);

      // Return unsubscribe function
      return () => {
        cellSettersRef.current.delete(id);
      };
    },
    [refreshNeighborCells],
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
    cellsSnapshotRef.current = new Map(getInitialCellsMap());
    setCellsRevision((prev) => prev + 1);
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

        const setter = cellSettersRef.current.get(cellId);
        if (setter) {
          setter((prevCell) => {
            if (
              prevCell.status === "revealed" &&
              prevCell.value === content.value
            ) {
              return prevCell;
            }

            return {
              status: "revealed",
              value: content.value as Cell["value"],
            };
          });
        }
      } else if (content.type === "FLAG") {
        const cellId = content.id;
        const nextStatus: Cell["status"] = content.flagged ? "flagged" : "hidden";

        const setter = cellSettersRef.current.get(cellId);
        if (setter) {
          setter((prevCell) => {
            if (prevCell.status === nextStatus && prevCell.value === 0) {
              return prevCell;
            }

            return {
              status: nextStatus,
              value: 0,
            };
          });
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
                  return { ...prevCell, status: "winning" };
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

  const updateCellOptimistically = useCallback(
    (id: number, updater: (prevCell: Cell) => Cell) => {
      const setter = cellSettersRef.current.get(id);
      if (!setter) return;
      setter(updater);
    },
    [],
  );

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
      getCellSnapshot,
      cellsRevision,
      registerCellSetter,
      onCellClick,
      restart,
      getTime,
      getStartTime,
      isGameOn,
      registerLoseDialogOpener,
      registerWinDialogOpener,
      updateCellOptimistically,
    }),
    [
      getInitialCell,
      getCellSnapshot,
      cellsRevision,
      registerCellSetter,
      onCellClick,
      restart,
      getTime,
      getStartTime,
      isGameOn,
      registerLoseDialogOpener,
      registerWinDialogOpener,
      updateCellOptimistically,
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
  const {
    getInitialCell,
    registerCellSetter,
    onCellClick,
    updateCellOptimistically,
  } = useGame();

  // Each cell has its own local state
  const [cell, setCell] = useState<Cell>(() => getInitialCell(id));

  // Register this cell's setter so provider can update it directly
  useEffect(() => {
    const unregister = registerCellSetter(id, setCell);
    return unregister;
  }, [id, registerCellSetter]);

  const onCellClickWithOptimisticUpdate = useCallback(
    (cellId: number, clickType: "left" | "right") => {
      updateCellOptimistically(cellId, (prevCell) => {
        if (clickType === "left") {
          if (prevCell.status !== "hidden") {
            return prevCell;
          }

          // Optimistic reveal: immediately switch the background while waiting
          // for the websocket REVEAL payload with the actual value.
          return {
            status: "revealed",
            value: 0,
          };
        }

        // Optimistic flag toggle for hidden/flagged cells.
        if (prevCell.status === "revealed" || prevCell.status === "winning") {
          return prevCell;
        }

        if (prevCell.status === "flagged") {
          return {
            status: "hidden",
            value: 0,
          };
        }

        return {
          status: "flagged",
          value: 0,
        };
      });

      onCellClick(cellId, clickType);
    },
    [onCellClick, updateCellOptimistically],
  );

  return useMemo(
    () => ({
      cell,
      onCellClick: onCellClickWithOptimisticUpdate,
    }),
    [cell, onCellClickWithOptimisticUpdate],
  );
}
