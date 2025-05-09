# Minesweeper Game Application

## Overview
This is a full-stack Minesweeper game application with a modern React frontend, WebSocket server for real-time gameplay, and serverless backend for storing game statistics. The game features a classic Minesweeper experience with enhanced visuals, animations, and comprehensive stats tracking.

## Architecture

### Frontend
- **Technology**: React (Next.js)
- **Authentication**: NextAuth.js for user authentication
- **Location**: `/frontend` directory

### WebSocket Server
- **Technology**: Node.js, Socket.IO
- **Purpose**: Handles game logic and real-time updates
- **Location**: `/websocket` directory

### Backend API
- **Technology**: AWS Lambda, DynamoDB
- **Purpose**: Stores game results, statistics, and leaderboard data
- **Location**: `/api` directory

## Game Features

### Core Gameplay
- 20x20 grid with 70 mines
- First click is always safe (generates a grid with no mines around first click)
- Left-click to reveal cells
- Right-click to place/remove flags
- Chord action (clicking on a number with the correct number of flags around it)
- Progressive reveal for connected empty cells

### Visual Features
- Custom cell colors (limegreen/lightgreen checkerboard pattern)
- Non-selectable numbers (user-select: none)
- Animation for cell reveals
- Explosion animation for bombs
- Win animation with colorful pulse effect

### Statistics Tracking
- Win/loss records
- Fastest completion times
- Win rate calculation
- Bombs exploded counter
- Total time played
- No-flag wins tracking (completing the game without using flags)

## Key Components

### Frontend Components
- `Game.tsx`: Main game component with UI and WebSocket integration
- `LoseModal.tsx` & `WinModal.tsx`: End-game modals
- `stats/page.tsx`: Statistics and leaderboard display

### WebSocket Server Functions
- `initializeGame()`: Creates a new game state
- `generateGrid()`: Creates a random grid with mines
- `generateSafeGrid()`: Creates a grid ensuring the first click is safe
- Socket event handlers for:
  - `revealCell`: Handles revealing a cell
  - `toggleFlag`: Handles placing/removing flags
  - `chordAction`: Handles chord clicks
  - `restartGame`: Resets the game state

### API Endpoints
- `/games`: Records game results (POST) and retrieves game history (GET)
- `/stats/{userId}`: Gets statistics for a specific user
- `/leaderboard`: Gets the fastest win times across all players

## Important Implementation Details

### WebSocket Communication
The frontend connects to the WebSocket server using Socket.IO. The server maintains game state for each user and emits state updates in response to user actions.

### Cell Reveal Mechanics
- The grid expands empty cells level by level with a 50ms delay between levels
- This creates a cascading reveal effect for empty spaces

### Statistics Storage
- Game results are saved to DynamoDB
- User IDs are prefixed with "USER#" in the database
- Best times are stored with a special record type

### User Identification
- Users are identified by their email (or ID if email is unavailable)
- Consistent user identification ensures accurate stats tracking

## Recent Changes

1. Cell reveal delay set to 50ms for better visibility
2. Simplified cell reveal animation in CSS
3. Improved bomb animation to trigger immediately on click
4. Fixed Play Again button to prevent immediate modal reappearance
5. Ensured consistent user ID usage (email) for stats tracking

## Potential Future Enhancements
- Difficulty levels (beginner, intermediate, expert)
- Custom grid sizes
- Themes and alternative visuals
- Mobile-optimized touch controls
- Multiplayer challenges

## Development Guidelines

### Styling Conventions
- Custom colors for cells: limegreen/lightgreen with contrast(80%)
- Game board is sized at 600x600px
- CSS animations are preferred over JS for performance

### State Management
- WebSocket server is the source of truth for game state
- Frontend updates in response to server-emitted state changes

### Timing
- Timer tracks in milliseconds for precision
- Displayed in mm:ss.ms format 