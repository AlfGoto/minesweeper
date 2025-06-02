import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Add server status and stats endpoints
app.get('/status', (req, res) => {
  const memoryUsage = process.memoryUsage();
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    memory: {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
      external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`
    },
    games: {
      activeCount: games.size,
      trackingCount: lastAccessTime.size
    },
    timestamp: new Date().toISOString()
  });
});

// Add endpoint to force cleanup (admin only)
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'minesweeper-admin';
app.post('/cleanup', (req, res) => {
  // Simple admin check
  const providedSecret = req.headers.authorization;
  if (providedSecret !== `Bearer ${ADMIN_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const before = {
    games: games.size,
    lastAccessTime: lastAccessTime.size
  };
  
  // Perform cleanup of completed and inactive games
  const now = Date.now();
  let cleanedCount = 0;
  
  for (const [userId, game] of games.entries()) {
    const lastAccess = lastAccessTime.get(userId) || 0;
    const timeSinceAccess = now - lastAccess;
    
    if ((game.gameOver || game.gameWon) || timeSinceAccess > 60 * 60 * 1000) { // 1 hour
      games.delete(userId);
      lastAccessTime.delete(userId);
      cleanedCount++;
    }
  }
  
  const after = {
    games: games.size,
    lastAccessTime: lastAccessTime.size
  };
  
  res.json({
    message: `Cleaned up ${cleanedCount} inactive games`,
    before,
    after,
    memoryUsage: process.memoryUsage()
  });
});

interface GameState {
  grid: Array<Array<{ value: number; revealed: boolean; flagged: boolean }>>;
  gameOver: boolean;
  gameWon: boolean;
  remainingFlags: number;
  userId: string;
  gameStarted: boolean;
  startTime: number | null;
  flagsPlaced: number;
  bombsExploded: number;
  noFlagUse: boolean;
  gameTime: number | null;
  time: number | null;
  cellsRevealed: number;  // Track cells revealed
  gameRestarts: number;   // Track number of game restarts
}

const games = new Map<string, GameState>();
// Add tracking for game access times to help with cleanup
const lastAccessTime = new Map<string, number>();

// Function to track when a game is accessed
function trackGameAccess(userId: string) {
  lastAccessTime.set(userId, Date.now());
}

function generateGrid(size: number, mines: number): number[][] {
  const grid = Array(size).fill(null).map(() => Array(size).fill(0));
  let minesPlaced = 0;

  while (minesPlaced < mines) {
    const row = Math.floor(Math.random() * size);
    const col = Math.floor(Math.random() * size);
    if (grid[row][col] !== -1) {
      grid[row][col] = -1;
      minesPlaced++;
    }
  }

  // Calculate numbers
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (grid[row][col] === -1) continue;
      let count = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const newRow = row + i;
          const newCol = col + j;
          if (
            newRow >= 0 &&
            newRow < size &&
            newCol >= 0 &&
            newCol < size &&
            grid[newRow][newCol] === -1
          ) {
            count++;
          }
        }
      }
      grid[row][col] = count;
    }
  }

  return grid;
}

// Generate a grid with guaranteed 0 at a specific position
function generateSafeGrid(size: number, mines: number, safeRow: number, safeCol: number): number[][] {
  // First create a grid with no mines around the safe position
  const grid = Array(size).fill(null).map(() => Array(size).fill(0));
  
  // Define the safe zone (3x3 area around the click)
  const safeZone = [];
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const r = safeRow + i;
      const c = safeCol + j;
      if (r >= 0 && r < size && c >= 0 && c < size) {
        safeZone.push([r, c]);
      }
    }
  }
  
  // Place mines outside of the safe zone
  let minesPlaced = 0;
  const maxAttempts = mines * 2;
  let attempts = 0;
  
  while (minesPlaced < mines && attempts < maxAttempts) {
    attempts++;
    const row = Math.floor(Math.random() * size);
    const col = Math.floor(Math.random() * size);
    
    // Check if this position is in the safe zone
    const inSafeZone = safeZone.some(([r, c]) => r === row && c === col);
    
    if (!inSafeZone && grid[row][col] !== -1) {
      grid[row][col] = -1;
      minesPlaced++;
    }
  }
  
  // If we couldn't place all mines, it's still fine - we'll have fewer mines
  
  // Calculate numbers
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (grid[row][col] === -1) continue;
      let count = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const newRow = row + i;
          const newCol = col + j;
          if (
            newRow >= 0 &&
            newRow < size &&
            newCol >= 0 &&
            newCol < size &&
            grid[newRow][newCol] === -1
          ) {
            count++;
          }
        }
      }
      grid[row][col] = count;
    }
  }
  
  return grid;
}

function initializeGame(userId: string): GameState {
  const size = 20;
  const mines = 70;
  const grid = generateGrid(size, mines);
  
  return {
    grid: grid.map(row =>
      row.map(value => ({
        value,
        revealed: false,
        flagged: false,
      }))
    ),
    gameOver: false,
    gameWon: false,
    remainingFlags: mines,
    userId,
    gameStarted: false,
    startTime: null,
    flagsPlaced: 0,
    bombsExploded: 0,
    noFlagUse: true,
    gameTime: null,
    time: null,
    cellsRevealed: 0,  // Initialize to 0
    gameRestarts: 0    // Initialize to 0
  };
}

// Keep the ChordActionParams interface for type checking
interface ChordActionParams {
  row: number;
  col: number;
  cellsToReveal: Array<{row: number, col: number}>;
}

io.on('connection', (socket) => {
  const userId = socket.handshake.auth.sessionId;

  if (!userId) {
    socket.disconnect();
    return;
  }

  if (!games.has(userId)) {
    games.set(userId, initializeGame(userId));
  }
  
  // Track this access
  trackGameAccess(userId);

  const gameState = games.get(userId);
  if (!gameState) {
    console.error(`Game not found for user ${userId}`);
    socket.emit('error', { message: 'Game not found' });
    return;
  }
  socket.emit('gameState', gameState);

  socket.on('revealCell', ({ row, col }) => {
    // Track access
    trackGameAccess(userId);
    
    const game = games.get(userId);
    if (!game) {
      console.error(`Game not found for user ${userId}`);
      socket.emit('error', { message: 'Game not found' });
      return;
    }
    
    if (game.gameOver || game.gameWon) {
      return;
    }

    // Make sure row and col are valid
    if (row < 0 || row >= game.grid.length || col < 0 || col >= game.grid[0].length) {
      return;
    }

    // If this is the first click, ensure it's safe
    if (!game.gameStarted) {
      // Generate a safe grid with the clicked cell having 0 bombs around it
      const size = 20;
      const mines = 70;
      const safeGrid = generateSafeGrid(size, mines, row, col);
      
      // Update the game grid with the new safe grid
      game.grid = safeGrid.map(row =>
        row.map(value => ({
          value,
          revealed: false,
          flagged: false,
        }))
      );
      
      game.remainingFlags = mines;
      game.gameStarted = true;
      game.startTime = Date.now();
      
      // We need to update the cell reference after regenerating the grid
      const cell = game.grid[row][col];
      
      // Always reveal the clicked cell
      cell.revealed = true;
      
      // Increment the cells revealed counter for the first cell
      game.cellsRevealed = 1;
      
      // Auto-reveal adjacent cells since it's a 0
      const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1], [1, 0],   [1, 1]
      ];
      
      // First reveal just the clicked cell
      socket.emit('gameState', game);
      
      // Collect all cells to reveal by level
      const visited = new Set([`${row},${col}`]);
      let currentLevel = [[row, col]];
      const levelByLevel: Array<Array<[number, number]>> = [];
      
      // BFS by level - only expand from zero cells
      while (currentLevel.length > 0) {
        const nextLevel: Array<[number, number]> = [];
        
        // Process this level's cells
        for (const [r, c] of currentLevel) {
          // Process adjacent cells
          for (const [dr, dc] of directions) {
            const newRow = r + dr;
            const newCol = c + dc;
            
            // Check bounds
            if (newRow < 0 || newRow >= game.grid.length || 
                newCol < 0 || newCol >= game.grid[0].length) {
              continue;
            }
            
            const key = `${newRow},${newCol}`;
            if (visited.has(key)) continue;
            visited.add(key);
            
            const adjacentCell = game.grid[newRow][newCol];
            
            // Don't collect flagged cells or already revealed cells
            if (adjacentCell.flagged || adjacentCell.revealed) {
              continue;
            }
            
            // Add to next level
            nextLevel.push([newRow, newCol]);
          }
        }
        
        // Save this level's cells to reveal them together
        if (nextLevel.length > 0) {
          levelByLevel.push(nextLevel);
        }
        
        // For next level, only include zero cells from which we should continue expansion
        currentLevel = nextLevel.filter(([r, c]) => game.grid[r][c].value === 0);
      }
      
      // Now reveal each level with delays
      levelByLevel.forEach((level, index) => {
        setTimeout(() => {
          // Make sure the game hasn't ended
          if (game.gameOver || game.gameWon) return;
          
          // Reveal all cells at this level
          level.forEach(([r, c]) => {
            const cell = game.grid[r][c];
            cell.revealed = true;
            
            // Increment cellsRevealed for each automatically revealed cell
            game.cellsRevealed++;
          });
          
          // Emit updated state after each level
          socket.emit('gameState', game);
          
          // Check for win condition after the last level is revealed
          if (index === levelByLevel.length - 1) {
            const allNonMinesRevealed = game.grid.every(row =>
              row.every(cell => cell.value === -1 || cell.revealed)
            );
            
            if (allNonMinesRevealed) {
              game.gameWon = true;
              const winTime = game.startTime ? Date.now() - game.startTime : 0;
              
              // Calculate full game time
              const gameTime = game.startTime ? Date.now() - game.startTime : 0;
              game.gameTime = gameTime;
              
              // Explicitly set the time property for the client
              game.time = gameTime;
              
              // Attach winTime to game state
              (game as any).winTime = winTime;
              
              // Save game result with enhanced error handling
              try {
                // Remove trailing slash from API URL if present
                const baseApiUrl = (process.env.API_URL || '').replace(/\/$/, '');
                const apiEndpoint = `${baseApiUrl}/games`;
                
                // Only try to save if we have a valid API URL
                if (baseApiUrl) {
                  // Get user info from socket auth if available
                  const userName = socket.handshake.auth.userName || userId;
                  const userImage = socket.handshake.auth.userImage || null;
                  
                  const payload = {
                    userId,
                    userName,
                    userImage,
                    status: 'success',
                    successTime: winTime,
                    // Include additional stats
                    usedFlags: game.flagsPlaced,
                    noFlagWin: game.noFlagUse,
                    bombsExploded: game.bombsExploded,
                    timePlayed: gameTime,
                    cellsRevealed: game.cellsRevealed
                  };
                  
                  // Add timeout and continue game flow regardless of API result
                  const apiTimeout = setTimeout(() => {
                    // Continue with game state update
                    socket.emit('gameState', game);
                  }, 1000);
                  
                  axios.post(apiEndpoint, payload, { timeout: 3000 })
                    .then(response => {
                      clearTimeout(apiTimeout);
                      // Continue with game state update
                      socket.emit('gameState', game);
                    })
                    .catch(error => {
                      // Simplified error logging
                      if (error.response) {
                        console.error(`API error: ${error.response.status}`);
                      } else {
                        console.error('Network error saving game result');
                      }
                      clearTimeout(apiTimeout);
                      // Continue with game state update anyway
                      socket.emit('gameState', game);
                    });
                  
                  // Don't emit game state here - will be handled by promises
                  return;
                } else {
                  // No API URL configured - continue without error
                  socket.emit('gameState', game);
                }
              } catch (error) {
                console.error('Error in API call');
                socket.emit('gameState', game);
              }
            }
          }
        }, 50 * (index + 1)); // Cell reveal delay - 50ms per level
      });
      
      return;
    }

    // For non-first clicks, use the existing cell from the current grid
    const cell = game.grid[row][col];
    if (cell.revealed || cell.flagged) {
      return;
    }

    // Make sure to actually mark the cell as revealed
    cell.revealed = true;
    
    // Increment the cells revealed counter
    game.cellsRevealed++;

    if (cell.value === -1) {
      game.gameOver = true;
      // Increment bombs exploded counter
      game.bombsExploded++;
      
      // Reveal all cells
      game.grid.forEach(row =>
        row.forEach(cell => {
          cell.revealed = true;
        })
      );
      // Calculate actual game time
      const gameTime = game.startTime ? Date.now() - game.startTime : 0;
      game.gameTime = gameTime;
      
      // Explicitly set the time property for the client
      game.time = gameTime;
      
      // Save game result with enhanced error handling
      try {
        // Remove trailing slash from API URL if present
        const baseApiUrl = (process.env.API_URL || '').replace(/\/$/, '');
        const apiEndpoint = `${baseApiUrl}/games`;
        
        // Only try to save if we have a valid API URL
        if (baseApiUrl) {
          // Get user info from socket auth if available
          const userName = socket.handshake.auth.userName || userId;
          const userImage = socket.handshake.auth.userImage || null;
          
          const payload = {
            userId,
            userName,
            userImage,
            status: 'defeat',
            time: game.startTime ? Date.now() - game.startTime : 0,
            // Include additional stats
            bombsExploded: game.bombsExploded,
            usedFlags: game.flagsPlaced,
            timePlayed: gameTime,
            cellsRevealed: game.cellsRevealed
          };
          
          // Add timeout and continue game flow regardless of API result
          const apiTimeout = setTimeout(() => {
            // Continue with game state update
            socket.emit('gameState', game);
          }, 1000);
          
          axios.post(apiEndpoint, payload, { timeout: 3000 })
            .then(response => {
              clearTimeout(apiTimeout);
              // Continue with game state update
              socket.emit('gameState', game);
            })
            .catch(error => {
              // Simplified error logging
              if (error.response) {
                console.error(`API error: ${error.response.status}`);
              } else {
                console.error('Network error saving game result');
              }
              clearTimeout(apiTimeout);
              // Continue with game state update anyway
              socket.emit('gameState', game);
            });
          
          // Don't emit game state here - will be handled by promises
          return;
        } else {
          // No API URL configured - continue without error
          socket.emit('gameState', game);
        }
      } catch (error) {
        console.error('Error in API call');
        socket.emit('gameState', game);
      }
      
      // Fallback - emit game state if we reach here
      socket.emit('gameState', game);
      return;
    }

    // Auto-reveal adjacent cells if clicked cell has value 0
    if (cell.value === 0) {
      const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1], [1, 0],   [1, 1]
      ];
      
      // First emit just the clicked cell
      socket.emit('gameState', game);
      
      // Collect all cells to reveal by level
      const visited = new Set([`${row},${col}`]);
      let currentLevel = [[row, col]];
      const levelByLevel: Array<Array<[number, number]>> = [];
      
      // BFS by level - only expand from zero cells
      while (currentLevel.length > 0) {
        const nextLevel: Array<[number, number]> = [];
        
        // Process this level's cells
        for (const [r, c] of currentLevel) {
          // Process adjacent cells
          for (const [dr, dc] of directions) {
            const newRow = r + dr;
            const newCol = c + dc;
            
            // Check bounds
            if (newRow < 0 || newRow >= game.grid.length || 
                newCol < 0 || newCol >= game.grid[0].length) {
              continue;
            }
            
            const key = `${newRow},${newCol}`;
            if (visited.has(key)) continue;
            visited.add(key);
            
            const adjacentCell = game.grid[newRow][newCol];
            
            // Don't collect flagged cells or already revealed cells
            if (adjacentCell.flagged || adjacentCell.revealed) {
              continue;
            }
            
            // Add to next level
            nextLevel.push([newRow, newCol]);
          }
        }
        
        // Save this level's cells to reveal them together
        if (nextLevel.length > 0) {
          levelByLevel.push(nextLevel);
        }
        
        // For next level, only include zero cells from which we should continue expansion
        currentLevel = nextLevel.filter(([r, c]) => game.grid[r][c].value === 0);
      }
      
      // Now reveal each level with delays
      levelByLevel.forEach((level, index) => {
        setTimeout(() => {
          // Make sure the game hasn't ended
          if (game.gameOver || game.gameWon) return;
          
          // Reveal all cells at this level
          level.forEach(([r, c]) => {
            const cell = game.grid[r][c];
            cell.revealed = true;
          });
          
          // Emit updated state after each level
          socket.emit('gameState', game);
          
          // Check for win condition after the last level is revealed
          if (index === levelByLevel.length - 1) {
            const allNonMinesRevealed = game.grid.every(row =>
              row.every(cell => cell.value === -1 || cell.revealed)
            );
            
            if (allNonMinesRevealed) {
              game.gameWon = true;
              const winTime = game.startTime ? Date.now() - game.startTime : 0;
              
              // Calculate full game time
              const gameTime = game.startTime ? Date.now() - game.startTime : 0;
              game.gameTime = gameTime;
              
              // Explicitly set the time property for the client
              game.time = gameTime;
              
              // Attach winTime to game state
              (game as any).winTime = winTime;
              
              // Save game result with enhanced error handling
              try {
                // Remove trailing slash from API URL if present
                const baseApiUrl = (process.env.API_URL || '').replace(/\/$/, '');
                const apiEndpoint = `${baseApiUrl}/games`;
                
                // Only try to save if we have a valid API URL
                if (baseApiUrl) {
                  // Get user info from socket auth if available
                  const userName = socket.handshake.auth.userName || userId;
                  const userImage = socket.handshake.auth.userImage || null;
                  
                  const payload = {
                    userId,
                    userName,
                    userImage,
                    status: 'success',
                    successTime: winTime,
                    // Include additional stats
                    usedFlags: game.flagsPlaced,
                    noFlagWin: game.noFlagUse,
                    bombsExploded: game.bombsExploded,
                    timePlayed: gameTime,
                    cellsRevealed: game.cellsRevealed
                  };
                  
                  // Add timeout and continue game flow regardless of API result
                  const apiTimeout = setTimeout(() => {
                    // Continue with game state update
                    socket.emit('gameState', game);
                  }, 1000);
                  
                  axios.post(apiEndpoint, payload, { timeout: 3000 })
                    .then(response => {
                      clearTimeout(apiTimeout);
                      // Continue with game state update
                      socket.emit('gameState', game);
                    })
                    .catch(error => {
                      // Simplified error logging
                      if (error.response) {
                        console.error(`API error: ${error.response.status}`);
                      } else {
                        console.error('Network error saving game result');
                      }
                      clearTimeout(apiTimeout);
                      // Continue with game state update anyway
                      socket.emit('gameState', game);
                    });
                  
                  // Don't emit game state here - will be handled by promises
                  return;
                } else {
                  // No API URL configured - continue without error
                  socket.emit('gameState', game);
                }
              } catch (error) {
                console.error('Error in API call');
                socket.emit('gameState', game);
              }
            }
          }
        }, 50 * (index + 1)); // Cell reveal delay - 50ms per level
      });
      
      // Return early since we're handling updates with delay
      return;
    }

    // Check for win condition (only for non-zero reveals)
    const allNonMinesRevealed = game.grid.every(row =>
      row.every(cell => cell.value === -1 || cell.revealed)
    );
    
    if (allNonMinesRevealed) {
      game.gameWon = true;
      const winTime = game.startTime ? Date.now() - game.startTime : 0;
      
      // Calculate full game time
      const gameTime = game.startTime ? Date.now() - game.startTime : 0;
      game.gameTime = gameTime;
      
      // Explicitly set the time property for the client
      game.time = gameTime;
      
      // Attach winTime to game state
      (game as any).winTime = winTime;
      
      // Save game result with enhanced error handling
      try {
        // Remove trailing slash from API URL if present
        const baseApiUrl = (process.env.API_URL || '').replace(/\/$/, '');
        const apiEndpoint = `${baseApiUrl}/games`;
        
        // Only try to save if we have a valid API URL
        if (baseApiUrl) {
          // Get user info from socket auth if available
          const userName = socket.handshake.auth.userName || userId;
          const userImage = socket.handshake.auth.userImage || null;
          
          const payload = {
            userId,
            userName,
            userImage,
            status: 'success',
            successTime: winTime,
            // Include additional stats
            usedFlags: game.flagsPlaced,
            noFlagWin: game.noFlagUse,
            bombsExploded: game.bombsExploded,
            timePlayed: gameTime,
            cellsRevealed: game.cellsRevealed
          };
          
          // Add timeout and continue game flow regardless of API result
          const apiTimeout = setTimeout(() => {
            // Continue with game state update
            socket.emit('gameState', game);
          }, 1000);
          
          axios.post(apiEndpoint, payload, { timeout: 3000 })
            .then(response => {
              clearTimeout(apiTimeout);
              // Continue with game state update
              socket.emit('gameState', game);
            })
            .catch(error => {
              // Simplified error logging
              if (error.response) {
                console.error(`API error: ${error.response.status}`);
              } else {
                console.error('Network error saving game result');
              }
              clearTimeout(apiTimeout);
              // Continue with game state update anyway
              socket.emit('gameState', game);
            });
          
          // Don't emit game state here - will be handled by promises
          return;
        } else {
          // No API URL configured - continue without error
          socket.emit('gameState', game);
        }
      } catch (error) {
        console.error('Error in API call');
        socket.emit('gameState', game);
      }
    }
    
    // Emit the game state
    socket.emit('gameState', game);
  });

  // Also simplify the chord action
  socket.on('chordAction', ({ row, col, cellsToReveal }: ChordActionParams) => {
    // Track access
    trackGameAccess(userId);
    
    const game = games.get(userId);
    if (!game) {
      console.error(`Game not found for user ${userId}`);
      socket.emit('error', { message: 'Game not found' });
      return;
    }
    
    if (game.gameOver || game.gameWon) {
      return;
    }
    
    // Make sure row and col are valid
    if (row < 0 || row >= game.grid.length || col < 0 || col >= game.grid[0].length) {
      return;
    }
    
    const cell = game.grid[row][col];
    
    // Only proceed if the cell is revealed and has a number
    if (!cell.revealed || cell.value <= 0) {
      return;
    }
    
    // Count adjacent flags
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1], [1, 0],   [1, 1]
    ];
    
    let adjacentFlags = 0;
    
    for (const [dx, dy] of directions) {
      const newRow = row + dx;
      const newCol = col + dy;
      
      // Check if valid position
      if (newRow >= 0 && newRow < game.grid.length && 
          newCol >= 0 && newCol < game.grid[0].length) {
        if (game.grid[newRow][newCol].flagged) {
          adjacentFlags++;
        }
      }
    }
    
    // If the number of flags matches the cell value, reveal all non-flagged adjacent cells
    if (adjacentFlags === cell.value) {
      // Track if a bomb was hit
      let hitBomb = false;
      
      // First pass: check if any bombs will be revealed (unflagged bombs)
      for (const { row: newRow, col: newCol } of cellsToReveal) {
        const targetCell = game.grid[newRow][newCol];
        
        if (targetCell.value === -1 && !targetCell.flagged) {
          hitBomb = true;
          break;
        }
      }
      
      // If we hit a bomb, reveal all bombs and end the game
      if (hitBomb) {
        // Reveal all cells
        game.grid.forEach(row => {
          row.forEach(cell => {
            cell.revealed = true;
          });
        });
        
        game.gameOver = true;
        // Increment bombs exploded counter
        game.bombsExploded++;
        
        // Calculate game time
        const gameTime = game.startTime ? Date.now() - game.startTime : 0;
        game.gameTime = gameTime;
        
        // Explicitly set the time property for the client
        game.time = gameTime;
        
        // Save game result and emit game state
        try {
          // Remove trailing slash from API URL if present
          const baseApiUrl = (process.env.API_URL || '').replace(/\/$/, '');
          const apiEndpoint = `${baseApiUrl}/games`;
          
          // Only try to save if we have a valid API URL
          if (baseApiUrl) {
            // Get user info from socket auth if available
            const userName = socket.handshake.auth.userName || userId;
            const userImage = socket.handshake.auth.userImage || null;
            
            const payload = {
              userId,
              userName,
              userImage,
              status: 'defeat',
              time: game.startTime ? Date.now() - game.startTime : 0,
              // Include additional stats
              bombsExploded: game.bombsExploded,
              usedFlags: game.flagsPlaced,
              timePlayed: gameTime,
              cellsRevealed: game.cellsRevealed
            };
            
            // Add timeout and continue game flow regardless of API result
            const apiTimeout = setTimeout(() => {
              // Continue with game state update
              socket.emit('gameState', game);
            }, 1000);
            
            axios.post(apiEndpoint, payload, { timeout: 3000 })
              .then(response => {
                clearTimeout(apiTimeout);
                // Continue with game state update
                socket.emit('gameState', game);
              })
              .catch(error => {
                // Simplified error logging
                if (error.response) {
                  console.error(`API error: ${error.response.status}`);
                } else {
                  console.error('Network error saving game result');
                }
                clearTimeout(apiTimeout);
                // Continue with game state update anyway
                socket.emit('gameState', game);
              });
            
            // Don't emit game state here - will be handled by promises
            return;
          }
        } catch (error) {
          console.error('Error in API call');
          socket.emit('gameState', game);
        }
        
        // Fallback - emit game state if we reach here
        socket.emit('gameState', game);
        return;
      }
      
      // Second pass: if no bombs hit, safely reveal all cells and check for zeros
      const zeroReveals: Array<{row: number, col: number}> = [];
      
      // First reveal all the non-zero cells
      for (const { row: newRow, col: newCol } of cellsToReveal) {
        const targetCell = game.grid[newRow][newCol];
        
        if (!targetCell.flagged && !targetCell.revealed) {
          targetCell.revealed = true;
          
          // Increment the cells revealed counter
          game.cellsRevealed++;
          
          // Just collect zero cells - we'll process them with delay
          if (targetCell.value === 0) {
            zeroReveals.push({ row: newRow, col: newCol });
          }
        }
      }
      
      // Emit initial state with non-zero cells revealed
      socket.emit('gameState', game);
      
      // Process zero reveals with 500ms delay if any exist
      if (zeroReveals.length > 0) {
        // Use a sequence of delays for multiple zeros
        let totalDelayOffset = 0;
        
        // Process each zero cell with its own expansion
        zeroReveals.forEach(({ row: zeroRow, col: zeroCol }, zeroIndex) => {
          // Each zero gets its own expansion with its own sequence of delays
          // Collect cells to reveal level by level
          const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1], [1, 0],   [1, 1]
          ];
          
          const visited = new Set([`${zeroRow},${zeroCol}`]);
          let currentLevel = [[zeroRow, zeroCol]];
          const levelByLevel: Array<Array<[number, number]>> = [];
          
          // BFS by level - only expand from zero cells
          while (currentLevel.length > 0) {
            const nextLevel: Array<[number, number]> = [];
            
            // Process this level's cells
            for (const [r, c] of currentLevel) {
              // Process adjacent cells
              for (const [dr, dc] of directions) {
                const newRow = r + dr;
                const newCol = c + dc;
                
                // Check bounds
                if (newRow < 0 || newRow >= game.grid.length || 
                    newCol < 0 || newCol >= game.grid[0].length) {
                  continue;
                }
                
                const key = `${newRow},${newCol}`;
                if (visited.has(key)) continue;
                visited.add(key);
                
                const adjacentCell = game.grid[newRow][newCol];
                
                // Don't collect flagged cells or already revealed cells
                if (adjacentCell.flagged || adjacentCell.revealed) {
                  continue;
                }
                
                // Add to next level
                nextLevel.push([newRow, newCol]);
              }
            }
            
            // Save this level's cells to reveal them together
            if (nextLevel.length > 0) {
              levelByLevel.push(nextLevel);
            }
            
            // For next level, only include zero cells from which we should continue expansion
            currentLevel = nextLevel.filter(([r, c]) => game.grid[r][c].value === 0);
          }
          
          // Calculate total delay
          const maxLevels = levelByLevel.length;
          if (maxLevels > 0) {
            totalDelayOffset = Math.max(totalDelayOffset, 50 * (maxLevels + 1));
          }
          
          // Now reveal each level with delays
          levelByLevel.forEach((level, index) => {
            setTimeout(() => {
              // Make sure the game hasn't ended
              if (game.gameOver || game.gameWon) return;
              
              // Reveal all cells at this level
              level.forEach(([r, c]) => {
                const cell = game.grid[r][c];
                cell.revealed = true;
              });
              
              // Emit updated state after each level
              socket.emit('gameState', game);
              
              // Check for win on the very last expansion of the last zero
              if (zeroIndex === zeroReveals.length - 1 && index === levelByLevel.length - 1) {
                checkForWin();
              }
            }, 50 * (index + 1)); // Cell reveal delay - 50ms per level
          });
        });
        
        // Function to check for win condition
        function checkForWin() {
          const currentGame = games.get(userId);
          if (!currentGame) {
            console.error(`Game not found for user ${userId}`);
            socket.emit('error', { message: 'Game not found' });
            return;
          }

          const allNonMinesRevealed = currentGame.grid.every(row =>
            row.every(cell => cell.value === -1 || cell.revealed)
          );
          
          if (allNonMinesRevealed) {
            currentGame.gameWon = true;
            const winTime = currentGame.startTime ? Date.now() - currentGame.startTime : 0;
            
            // Calculate full game time
            const gameTime = currentGame.startTime ? Date.now() - currentGame.startTime : 0;
            currentGame.gameTime = gameTime;
            
            // Explicitly set the time property for the client
            currentGame.time = gameTime;
            
            // Attach winTime to game state
            (currentGame as any).winTime = winTime;
            
            // Handle win condition same as before
            try {
              // Remove trailing slash from API URL if present
              const baseApiUrl = (process.env.API_URL || '').replace(/\/$/, '');
              const apiEndpoint = `${baseApiUrl}/games`;
              
              // Only try to save if we have a valid API URL
              if (baseApiUrl) {
                // Get user info from socket auth if available
                const userName = socket.handshake.auth.userName || userId;
                const userImage = socket.handshake.auth.userImage || null;
                
                const payload = {
                  userId,
                  userName,
                  userImage,
                  status: 'success',
                  successTime: winTime,
                  // Include additional stats
                  usedFlags: currentGame.flagsPlaced,
                  noFlagWin: currentGame.noFlagUse,
                  bombsExploded: currentGame.bombsExploded,
                  timePlayed: gameTime,
                  cellsRevealed: currentGame.cellsRevealed
                };
                
                // Add timeout and continue game flow regardless of API result
                const apiTimeout = setTimeout(() => {
                  // Continue with game state update
                  socket.emit('gameState', currentGame);
                }, 1000);
                
                axios.post(apiEndpoint, payload, { timeout: 3000 })
                  .then(response => {
                    clearTimeout(apiTimeout);
                    // Continue with game state update
                    socket.emit('gameState', currentGame);
                  })
                  .catch(error => {
                    // Simplified error logging
                    if (error.response) {
                      console.error(`API error: ${error.response.status}`);
                    } else {
                      console.error('Network error saving game result');
                    }
                    clearTimeout(apiTimeout);
                    // Continue with game state update anyway
                    socket.emit('gameState', currentGame);
                  });
                
                // Don't emit game state here - will be handled by promises
                return;
              } else {
                // No API URL configured - continue without error
                socket.emit('gameState', currentGame);
              }
            } catch (error) {
              console.error('Error in API call');
              socket.emit('gameState', currentGame);
            }
          } else {
            socket.emit('gameState', currentGame);
          }
        }
        
        // Return early since we're handling updates with delay
        return;
      }
      
      // If no zero reveals, check for win condition immediately
      const allNonMinesRevealed = game.grid.every(row =>
        row.every(cell => cell.value === -1 || cell.revealed)
      );
      
      if (allNonMinesRevealed) {
        game.gameWon = true;
        const winTime = game.startTime ? Date.now() - game.startTime : 0;
        
        // Calculate full game time
        const gameTime = game.startTime ? Date.now() - game.startTime : 0;
        game.gameTime = gameTime;
        
        // Explicitly set the time property for the client
        game.time = gameTime;
        
        // Attach winTime to game state
        (game as any).winTime = winTime;
        
        // Save game result - reuse the same code as for regular win
        try {
          // Remove trailing slash from API URL if present
          const baseApiUrl = (process.env.API_URL || '').replace(/\/$/, '');
          const apiEndpoint = `${baseApiUrl}/games`;
          
          // Only try to save if we have a valid API URL
          if (baseApiUrl) {
            // Get user info from socket auth if available
            const userName = socket.handshake.auth.userName || userId;
            const userImage = socket.handshake.auth.userImage || null;
            
            const payload = {
              userId,
              userName,
              userImage,
              status: 'success',
              successTime: winTime,
              // Include additional stats
              usedFlags: game.flagsPlaced,
              noFlagWin: game.noFlagUse,
              bombsExploded: game.bombsExploded,
              timePlayed: gameTime,
              cellsRevealed: game.cellsRevealed
            };
            
            // Add timeout and continue game flow regardless of API result
            const apiTimeout = setTimeout(() => {
              // Continue with game state update
              socket.emit('gameState', game);
            }, 1000);
            
            axios.post(apiEndpoint, payload, { timeout: 3000 })
              .then(response => {
                clearTimeout(apiTimeout);
                // Continue with game state update
                socket.emit('gameState', game);
              })
              .catch(error => {
                // Simplified error logging
                if (error.response) {
                  console.error(`API error: ${error.response.status}`);
                } else {
                  console.error('Network error saving game result');
                }
                clearTimeout(apiTimeout);
                // Continue with game state update anyway
                socket.emit('gameState', game);
              });
            
            // Don't emit game state here - will be handled by promises
            return;
          } else {
            // No API URL configured - continue without error
            socket.emit('gameState', game);
          }
        } catch (error) {
          console.error('Error in API call');
          socket.emit('gameState', game);
        }
      }
    }
    
    // Emit updated game state
    socket.emit('gameState', game);
  });

  socket.on('toggleFlag', ({ row, col }) => {
    // Track access
    trackGameAccess(userId);
    
    const game = games.get(userId);
    if (!game) {
      console.error(`Game not found for user ${userId}`);
      socket.emit('error', { message: 'Game not found' });
      return;
    }

    if (game.gameOver || game.gameWon) {
      return;
    }

    const cell = game.grid[row][col];
    if (cell.revealed) {
      return;
    }

    if (cell.flagged) {
      cell.flagged = false;
      game.remainingFlags++;
    } else if (game.remainingFlags > 0) {
      cell.flagged = true;
      game.remainingFlags--;
      // Track flag usage
      game.flagsPlaced++;
      // User has placed a flag, so they're not eligible for no-flag win
      game.noFlagUse = false;
    }

    socket.emit('gameState', game);
  });

  socket.on('restartGame', () => {
    // Track access
    trackGameAccess(userId);
    
    // Check if we have an existing game that's started but not won/lost
    const existingGame = games.get(userId);
    if (!existingGame) {
      console.error(`Game not found for user ${userId}`);
      socket.emit('error', { message: 'Game not found' });
      return;
    }
    
    // Only save game data if the game has actually started
    if (existingGame.gameStarted && !existingGame.gameOver && !existingGame.gameWon) {
      try {
        // Calculate the game time up to this point
        const gameTime = existingGame.startTime ? Date.now() - existingGame.startTime : 0;
        
        // Remove trailing slash from API URL if present
        const baseApiUrl = (process.env.API_URL || '').replace(/\/$/, '');
        const apiEndpoint = `${baseApiUrl}/games`;
        
        // Only try to save if we have a valid API URL
        if (baseApiUrl) {
          // Get user info from socket auth if available
          const userName = socket.handshake.auth.userName || userId;
          const userImage = socket.handshake.auth.userImage || null;
          
          const payload = {
            userId,
            userName,
            userImage,
            status: 'restarted',  // New status for restarted games
            time: gameTime,
            // Include additional stats
            bombsExploded: existingGame.bombsExploded,
            usedFlags: existingGame.flagsPlaced,
            cellsRevealed: existingGame.cellsRevealed,  // Already included
            timePlayed: gameTime
          };
          
          // Fire and forget - we don't need to wait for the response
          axios.post(apiEndpoint, payload, { timeout: 3000 })
            .catch(error => {
              // Simplified error logging
              if (error.response) {
                console.error(`API error on restart: ${error.response.status}`);
              } else {
                console.error('Network error on restart');
              }
            });
        }
      } catch (error) {
        console.error('Error saving restarted game');
      }
    }
    
    // Create a new game, preserving the restart count if possible
    const gameRestarts = existingGame.gameRestarts ? existingGame.gameRestarts + 1 : 1;
    const newGame = initializeGame(userId);
    newGame.gameRestarts = gameRestarts;  // Set the restart count
    
    games.set(userId, newGame);
    socket.emit('gameState', newGame);
  });

  socket.on('disconnect', () => {
    // Track last access time but don't log the disconnect
    trackGameAccess(userId);
    
    // Check if we have a game for this user
    const game = games.get(userId);
    if (!game) {
      return; // No game to clean up
    }
    
    // Save the game result if it's in progress and hasn't been completed
    if (game.gameStarted && !game.gameOver && !game.gameWon) {
      try {
        // Calculate the game time up to this point
        const gameTime = game.startTime ? Date.now() - game.startTime : 0;
        
        // Remove trailing slash from API URL if present
        const baseApiUrl = (process.env.API_URL || '').replace(/\/$/, '');
        const apiEndpoint = `${baseApiUrl}/games`;
        
        // Only try to save if we have a valid API URL
        if (baseApiUrl) {
          // Get user info from socket auth if available
          const userName = socket.handshake.auth.userName || userId;
          const userImage = socket.handshake.auth.userImage || null;
          
          const payload = {
            userId,
            userName,
            userImage,
            status: 'abandoned', // Mark as abandoned game
            successTime: null,
            time: gameTime,
            // Include additional stats
            bombsExploded: game.bombsExploded,
            usedFlags: game.flagsPlaced,
            cellsRevealed: game.cellsRevealed,  // Already included
            gameRestarts: game.gameRestarts,    // Already included
            timePlayed: gameTime
          };
          
          // Fire and forget - no need to wait for response as user disconnected
          axios.post(apiEndpoint, payload, { timeout: 3000 })
            .catch(error => {
              // Simplified error logging
              if (error.response) {
                console.error(`API error for user ${userId}: ${error.response.status}`);
              } else {
                console.error(`Network error for user ${userId}`);
              }
            });
        }
      } catch (error) {
        console.error('Error saving abandoned game');
      }
    }
    
    // Add a delay before cleaning up the game state (30 seconds)
    setTimeout(() => {
      // Verify the game still exists (might have reconnected)
      if (games.has(userId)) {
        // Check if the game hasn't been accessed for at least 30 seconds
        const lastAccess = lastAccessTime.get(userId) || 0;
        const timeSinceAccess = Date.now() - lastAccess;
        
        // Only clean up if it hasn't been accessed recently
        if (timeSinceAccess >= 30000) {
          games.delete(userId);
          lastAccessTime.delete(userId);
        }
      }
    }, 30000); // 30 seconds delay
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  // Keep this console.log as it's informational for server startup
  console.log(`🚀 WebSocket server running on port ${PORT}`);
});

// Add periodic cleanup for games that haven't been accessed in a while
// This helps ensure we don't leak memory over time
const CLEANUP_INTERVAL = 60 * 60 * 1000; // 1 hour
const INACTIVE_THRESHOLD = 2 * 60 * 60 * 1000; // 2 hours
const CLEANUP_DELAY = 5 * 60 * 1000; // 5 minutes delay before cleanup

setInterval(() => {
  const now = Date.now();
  let cleanupCount = 0;
  
  // Mark inactive games for cleanup
  const gamesToCleanup = new Map();
  
  // First pass - identify games to clean up
  for (const [userId, game] of games.entries()) {
    const lastAccess = lastAccessTime.get(userId) || 0;
    const timeSinceAccess = now - lastAccess;
    
    // If game is completed or hasn't been accessed in a while
    if ((game.gameOver || game.gameWon) || timeSinceAccess > INACTIVE_THRESHOLD) {
      gamesToCleanup.set(userId, game);
    }
  }
  
  // If there are games to clean up, do it after a delay
  if (gamesToCleanup.size > 0) {
    setTimeout(() => {
      // Second pass - actually clean up, but double check they're still inactive
      const finalNow = Date.now();
      
      for (const [userId, game] of gamesToCleanup.entries()) {
        // Recheck if the game is still eligible for cleanup
        if (games.has(userId)) {
          const lastAccess = lastAccessTime.get(userId) || 0;
          const timeSinceAccess = finalNow - lastAccess;
          
          // Only clean up if it's still inactive
          if ((game.gameOver || game.gameWon) || timeSinceAccess > INACTIVE_THRESHOLD) {
            games.delete(userId);
            lastAccessTime.delete(userId);
            cleanupCount++;
          }
        }
      }
    }, CLEANUP_DELAY);
  }
}, CLEANUP_INTERVAL); 