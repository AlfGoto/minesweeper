import { useState, useEffect, useRef, useCallback } from 'react';
import { Cell, GameState, GridPosition } from '@/types/game';
import gameService from '@/services/gameService';

interface UseGameLogicProps {
  userId: string;
  userName: string;
  userImage: string | null;
}

export default function useGameLogic({ userId, userName, userImage }: UseGameLogicProps) {
  // Main game state from server
  const [gameState, setGameState] = useState<GameState>({
    grid: [],
    gameOver: false,
    gameWon: false,
    remainingFlags: 0,
  });
  
  // Client-side optimistic updates for responsiveness
  const [clientGrid, setClientGrid] = useState<Cell[][]>([]);
  
  // UI state
  const [timer, setTimer] = useState(0);
  const [finalTime, setFinalTime] = useState<number | null>(null);
  const [showLoseModal, setShowLoseModal] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);
  const [bombAnimation, setBombAnimation] = useState(false);
  const [winAnimation, setWinAnimation] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [connected, setConnected] = useState(false);
  
  // Refs for timer and calculation
  const localTimerRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);

  // Add a ref to store the cancel modal function
  const cancelModalRef = useRef<(() => void) | null>(null);

  // ----------------
  // Setup & Cleanup
  // ----------------
  
  // Initialize service and event listeners
  useEffect(() => {
    // Register for events
    gameService.onGameState(handleGameState);
    gameService.onConnection(setConnected);
    gameService.onCellUpdates(handleCellUpdates);
    
    // Connect to WebSocket
    gameService.connect(userId, userName, userImage);
    
    // Set up the timer
    startTimer();
    
    // Cleanup
    return () => {
      gameService.disconnect();
      stopTimer();
    };
  }, [userId]);
  
  // ----------------
  // Game State Handlers
  // ----------------
  
  // Handle game state updates from the server
  const handleGameState = useCallback((state: GameState) => {
    setGameState(state);
    
    // If we receive a full grid, update the client grid too
    if (state.grid && state.grid.length > 0) {
      // Deep copy to avoid reference issues
      setClientGrid(JSON.parse(JSON.stringify(state.grid)));
    }
    
    // Handle win/lose conditions
    if (state.gameOver && !state.gameWon) {
      handleLose(state);
    } else if (state.gameWon) {
      handleWin(state);
    } else {
      // Reset UI states if game is active
      setShowLoseModal(false);
      setShowWinModal(false);
      setBombAnimation(false);
      setWinAnimation(false);
      setFinalTime(null);
    }
    
    // Start the game if not already started
    if (!gameStarted && state.gameStarted) {
      setTimer(0);
      localTimerRef.current = 0;
      setGameStarted(true);
    }
  }, [gameStarted]);
  
  // Handle partial cell updates from the server
  const handleCellUpdates = useCallback((updates: { row: number, col: number, cell: Cell }[]) => {
    setClientGrid(grid => {
      // Create a new grid to avoid mutating state
      const newGrid = JSON.parse(JSON.stringify(grid));
      
      // Apply each update
      updates.forEach(update => {
        if (newGrid[update.row] && newGrid[update.row][update.col]) {
          newGrid[update.row][update.col] = update.cell;
        }
      });
      
      return newGrid;
    });
  }, []);
  
  // ----------------
  // Timer Management
  // ----------------
  
  // Stop the timer
  const stopTimer = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = 0;
    }
  }, []);
  
  // Start the timer with high precision using requestAnimationFrame
  const startTimer = useCallback(() => {
    // Stop existing timer if any
    stopTimer();
    
    // Set initial values if needed
    if (localTimerRef.current === 0) {
      setTimer(0.001); // Small non-zero value to ensure display updates
    }
    
    // Get start time
    const startTime = performance.now() - localTimerRef.current;
    
    // Timer update function using requestAnimationFrame for smooth updates
    const updateTimer = (timestamp: number) => {
      // Calculate elapsed time
      const elapsed = timestamp - startTime;
      localTimerRef.current = elapsed;
      
      // Update displayed timer - store as seconds (elapsed is in ms)
      // Update every frame for smooth display
      setTimer(elapsed / 1000);
      
      // Continue timer if game is active
      if (gameStarted && !gameState.gameOver && !gameState.gameWon) {
        animationFrameRef.current = requestAnimationFrame(updateTimer);
      }
    };
    
    // Start timer
    if (gameStarted && !gameState.gameOver && !gameState.gameWon) {
      animationFrameRef.current = requestAnimationFrame(updateTimer);
    }
  }, [gameStarted, gameState.gameOver, gameState.gameWon, stopTimer]);
  
  // Handle lose condition
  const handleLose = useCallback((state: GameState) => {
    // Start animation
    setBombAnimation(true);
    
    // Try using gameTime instead of time as the server might not be setting time property
    const serverTime = state.gameTime !== undefined ? state.gameTime : 
                      (state.time !== undefined ? state.time : timer);
    
    setFinalTime(serverTime); // Use actual server time, don't force a minimum
    
    // Stop timer
    stopTimer();
    
    // Immediately reveal all bombs in client grid for better UX
    if (clientGrid.length > 0) {
      setClientGrid(grid => {
        const newGrid = JSON.parse(JSON.stringify(grid));
        
        // Reveal all bombs
        for (let r = 0; r < newGrid.length; r++) {
          for (let c = 0; c < newGrid[r].length; c++) {
            if (newGrid[r][c].value === -1) {
              newGrid[r][c].revealed = true;
            }
          }
        }
        
        return newGrid;
      });
    }
    
    // Use a ref to track if game was restarted before modal appears
    const wasRestartedRef = { current: false };
    
    // Show modal after animation, but only if game hasn't been restarted
    const modalTimeout = setTimeout(() => {
      if (!wasRestartedRef.current) {
        setShowLoseModal(true);
        setShowWinModal(false);
      }
    }, 1500);
    
    // Expose a way to cancel the modal if game is restarted
    const cancelModal = () => {
      wasRestartedRef.current = true;
      clearTimeout(modalTimeout);
    };

    // Add the cancel function to a ref for access in handleRestart
    cancelModalRef.current = cancelModal;
  }, [timer, stopTimer, clientGrid]);
  
  // Handle win condition
  const handleWin = useCallback((state: GameState) => {
    // Start animation
    setWinAnimation(true);
    
    // Try using gameTime if winTime is not available
    const serverWinTime = state.winTime !== undefined ? state.winTime : 
                        (state.gameTime !== undefined ? state.gameTime : timer);
    
    setFinalTime(serverWinTime); // Use actual server time, don't force a minimum
    
    // Stop timer
    stopTimer();
    
    // Use a ref to track if game was restarted before modal appears
    const wasRestartedRef = { current: false };
    
    // Show modal after animation, but only if game hasn't been restarted
    const modalTimeout = setTimeout(() => {
      if (!wasRestartedRef.current) {
        setShowLoseModal(false);
        setShowWinModal(true);
      }
    }, 1500);
    
    // Expose a way to cancel the modal if game is restarted
    const cancelModal = () => {
      wasRestartedRef.current = true;
      clearTimeout(modalTimeout);
    };

    // Add the cancel function to a ref for access in handleRestart
    cancelModalRef.current = cancelModal;
  }, [timer, stopTimer]);
  // ----------------
  // User Actions
  // ----------------
  
  // Client-side optimistic update for revealing cells
  const clientRevealCell = useCallback((row: number, col: number): boolean => {
    // Validate the action
    if (!clientGrid[row] || !clientGrid[row][col] || 
        clientGrid[row][col].revealed || 
        clientGrid[row][col].flagged || 
        gameState.gameOver || 
        gameState.gameWon) {
      return false;
    }
    
    // Make sure game is started
    if (!gameStarted) {
      setGameStarted(true);
      startTimer();
    }
    
    // Check if this cell is a bomb before revealing
    const isBomb = clientGrid[row][col].value === -1;
    
    // Apply optimistic update
    setClientGrid(grid => {
      // Create a new grid to avoid mutating state
      const newGrid = JSON.parse(JSON.stringify(grid));
      
      // Reveal the cell
      newGrid[row][col].revealed = true;
      
      // If this is a bomb, also reveal all other bombs immediately for better UX
      if (isBomb) {
        // Reveal all other bombs
        for (let r = 0; r < newGrid.length; r++) {
          for (let c = 0; c < newGrid[r].length; c++) {
            if (newGrid[r][c].value === -1) {
              newGrid[r][c].revealed = true;
            }
          }
        }
        
        setBombAnimation(true);
        // Store final time in seconds (milliseconds / 1000) - ensure positive value
        setFinalTime(Math.max(localTimerRef.current / 1000, 1));
      }
      
      return newGrid;
    });
    
    // Send action to server
    gameService.revealCell(row, col);
    return true;
  }, [clientGrid, gameState.gameOver, gameState.gameWon, gameStarted, startTimer]);
  
  // Simple dedicated flag toggling function
  const toggleFlagCell = useCallback((row: number, col: number) => {
    // Validate we have a valid cell and game is active
    if (
      !clientGrid[row] || 
      !clientGrid[row][col] || 
      clientGrid[row][col].revealed || 
      gameState.gameOver || 
      gameState.gameWon
    ) {
      return;
    }

    // Start game if this is the first action
    if (!gameStarted) {
      setGameStarted(true);
      startTimer();
    }

    // Create a deep copy and toggle the flag
    const newGrid = JSON.parse(JSON.stringify(clientGrid));
    newGrid[row][col].flagged = !newGrid[row][col].flagged;
    
    // Update the client grid immediately for responsiveness
    setClientGrid(newGrid);
    
    // Send to server (don't await response - optimistic update)
    gameService.toggleFlag(row, col);
    
  }, [clientGrid, gameState, gameStarted, startTimer]);

  // Direct handler for right-click events
  const handleRightClick = useCallback((e: React.MouseEvent, row: number, col: number) => {
    // Always prevent default context menu
    e.preventDefault();
    
    // Skip if the cell is already revealed
    if (clientGrid[row]?.[col]?.revealed) {
      return;
    }
    
    // Toggle the flag status
    toggleFlagCell(row, col);
    
  }, [clientGrid, toggleFlagCell]);
  
  // Handle client-side chord action
  const clientChordAction = useCallback((row: number, col: number): boolean => {
    // Skip if game over or cell is invalid
    if (gameState.gameOver || gameState.gameWon) {
      return false;
    }
    
    // Skip if cell doesn't exist
    if (!clientGrid[row] || !clientGrid[row][col]) {
      return false;
    }
    
    // Skip if cell is not revealed or has no value
    if (!clientGrid[row][col].revealed || clientGrid[row][col].value <= 0) {
      return false;
    }
    
    // Check adjacent cells
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], [0, 1],
      [1, -1], [1, 0], [1, 1]
    ];
    
    // Count flags
    let adjacentFlags = 0;
    const cellsToReveal: GridPosition[] = [];
    
    for (const [dx, dy] of directions) {
      const newRow = row + dx;
      const newCol = col + dy;
      
      // Check if valid position
      if (newRow >= 0 && newRow < clientGrid.length &&
          newCol >= 0 && newCol < clientGrid[0].length) {
        
        const adjacentCell = clientGrid[newRow][newCol];
        
        if (adjacentCell.flagged) {
          adjacentFlags++;
        } else if (!adjacentCell.revealed) {
          cellsToReveal.push({ row: newRow, col: newCol });
        }
      }
    }
    
    // Only perform chord if flags match cell value
    if (adjacentFlags === clientGrid[row][col].value && cellsToReveal.length > 0) {
      // Apply optimistic update
      setClientGrid(grid => {
        const newGrid = JSON.parse(JSON.stringify(grid));
        let hasBomb = false;
        
        // Reveal all cells in the chord
        cellsToReveal.forEach(({ row: r, col: c }) => {
          newGrid[r][c].revealed = true;
          if (newGrid[r][c].value === -1) {
            hasBomb = true;
          }
        });
        
        // Show animation if bomb is revealed
        if (hasBomb) {
          setBombAnimation(true);
          // Store final time in seconds (milliseconds / 1000)
          setFinalTime(localTimerRef.current / 1000);
        }
        
        return newGrid;
      });
      
      // Send action to server
      gameService.chordAction(row, col, cellsToReveal);
      return true;
    }
    
    return false;
  }, [clientGrid, gameState.gameOver, gameState.gameWon]);
  
  // Handle game restart
  const handleRestart = useCallback(() => {
    // Cancel any pending modals
    if (cancelModalRef.current) {
      cancelModalRef.current();
      cancelModalRef.current = null;
    }

    // Force cleanup of any animations by actually removing the animation classes
    // This prevents animation from continuing despite restarts
    setBombAnimation(false);
    setWinAnimation(false);
    
    // Immediately hide modals
    setShowLoseModal(false);
    setShowWinModal(false);
    
    // Properly reset timer
    setTimer(0.001); // Small non-zero value to ensure display updates
    localTimerRef.current = 0;
    setFinalTime(null);
    
    // Reset game state
    setGameStarted(false);
    stopTimer();
    
    // Reset the grid immediately with an empty grid
    // This gives better visual feedback before the server responds
    setClientGrid([]);
    
    // Ask server to restart and provide a new grid
    gameService.restartGame();
    
    // Force a timer update for immediate feedback
    setTimeout(() => {
      if (!gameStarted) {
        setGameStarted(true);
        startTimer();
      }
    }, 100);
  }, [startTimer, stopTimer, gameStarted]);
  
  // ----------------
  // Mouse Event Handlers
  // ----------------
  
  // Handle mouse down on a cell
  const handleMouseDown = useCallback((e: React.MouseEvent, row: number, col: number) => {
    // Only handle left (0) or right (2) mouse buttons
    if (e.button !== 0 && e.button !== 2) return;
    
    // Get current button states using bitwise check
    const isLeftButtonDown = (e.buttons & 1) === 1;
    const isRightButtonDown = (e.buttons & 2) === 2;
    const isBothButtonsDown = isLeftButtonDown && isRightButtonDown;
    
    // If both buttons are down now, we might be doing a chord action
    if (isBothButtonsDown) {
      
      // Check if we can do chord action on this cell (revealed and has value)
      if (clientGrid[row]?.[col]?.revealed && clientGrid[row]?.[col]?.value > 0) {
        // Try chord action but don't return - allow individual clicks to happen if chord fails
        clientChordAction(row, col);
      }
    } else {
      // Single button actions
      
      // Left click - reveal cell
      if (e.button === 0 && !isBothButtonsDown) {
        clientRevealCell(row, col);
      }
      
      // Right click - toggle flag
      if (e.button === 2 && !isBothButtonsDown) {
        toggleFlagCell(row, col);
      }
    }
  }, [clientGrid, clientRevealCell, toggleFlagCell, clientChordAction]);
  
  // Handle cell click
  const handleCellClick = useCallback((row: number, col: number) => {
    // Skip if game over
    if (gameState.gameOver || gameState.gameWon) return;
    
    const cell = clientGrid[row]?.[col];
    if (!cell) return;
    
    // If it's a revealed cell with a number, it might be a chord action
    if (cell.revealed && cell.value > 0) {
      // Count adjacent flags
      const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
      ];
      
      let adjacentFlags = 0;
      const cellsToReveal: Array<{row: number, col: number}> = [];
      
      for (const [dx, dy] of directions) {
        const newRow = row + dx;
        const newCol = col + dy;
        
        if (newRow >= 0 && newRow < clientGrid.length &&
            newCol >= 0 && newCol < clientGrid[0].length) {
          
          if (clientGrid[newRow][newCol].flagged) {
            adjacentFlags++;
          } else if (!clientGrid[newRow][newCol].revealed) {
            cellsToReveal.push({ row: newRow, col: newCol });
          }
        }
      }
      
      // If flags match the cell value, reveal adjacent non-flagged cells
      if (adjacentFlags === cell.value && cellsToReveal.length > 0) {
        // Apply optimistic update
        setClientGrid(grid => {
          const newGrid = JSON.parse(JSON.stringify(grid));
          let hasBomb = false;
          
          // Reveal each cell
          cellsToReveal.forEach(({ row: r, col: c }) => {
            newGrid[r][c].revealed = true;
            if (newGrid[r][c].value === -1) {
              hasBomb = true;
            }
          });
          
          // Handle bomb revealed
          if (hasBomb) {
            setBombAnimation(true);
            // Store final time in seconds (milliseconds / 1000)
            setFinalTime(localTimerRef.current / 1000);
          }
          
          return newGrid;
        });
        
        // Send to server
        gameService.chordAction(row, col, cellsToReveal);
      }
    } 
    // Regular cell click - just reveal the cell if not flagged
    else if (!cell.flagged) {
      // Skip if already revealed
      if (cell.revealed) return;
      
      // Start game if needed
      if (!gameStarted) {
        setGameStarted(true);
        startTimer();
      }
      
      // Apply optimistic update
      setClientGrid(grid => {
        const newGrid = JSON.parse(JSON.stringify(grid));
        newGrid[row][col].revealed = true;
        
        // Handle bomb click
        if (newGrid[row][col].value === -1) {
          setBombAnimation(true);
          // Store final time in seconds (milliseconds / 1000)
          setFinalTime(localTimerRef.current / 1000);
        }
        
        return newGrid;
      });
      
      // Send to server
      gameService.revealCell(row, col);
    }
  }, [clientGrid, gameState.gameOver, gameState.gameWon, gameStarted, startTimer]);
  
  // Prevent context menu globally
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };
    
    document.addEventListener('contextmenu', handleContextMenu);
    
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  return {
    // Game state
    clientGrid,
    gameState,
    gameOver: gameState.gameOver,
    gameWon: gameState.gameWon,
    timer,
    finalTime,
    showLoseModal,
    showWinModal,
    bombAnimation, 
    winAnimation,
    connected,
    
    // Game actions
    handleRestart,
    
    // Cell handlers
    handleCellClick,
    handleRightClick,
    handleMouseDown,
    
    // Additional handlers for direct access
    clientChordAction,
  };
} 