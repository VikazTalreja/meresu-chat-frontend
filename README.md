# Frontend - Chat Application

## Overview
This is the frontend part of a real-time chat application built with Next.js and styled using Tailwind CSS. It features a modern UI with interactive components, animated visualizations, and Socket.io integration for real-time communication with the backend.

## Features
- Real-time chat messaging with Socket.io
- Animated visualizations for conversation analysis
- Conversation goal setting
- Context management for chat history
- Dark/light mode support
- Responsive design with modern UI elements

## User Flow
1. **Start a Conversation**
   - When you first open the application, you'll see a welcome message
   - Use the dual input fields at the bottom of the chat area:
     - Left input: Enter customer messages (what they might say)
     - Right input: Enter your responses (as the sales representative)
   - Click "Add" after typing each message to add it to the conversation
   - Messages appear in the chat window in sequential order, mimicking a real conversation

2. **Set Your Conversation Goal**
   - In the right sidebar, find the "Conversation Goal" section
   - Enter a specific goal for this conversation (e.g., "Convert lead to paying customer")
   - The goal helps the AI understand your intentions and provide more relevant suggestions

3. **Run the Analysis**
   - After adding messages and setting a goal, click the "Run" button in the Analysis Results section
   - The animated visualizations will activate, showing that the system is processing your conversation
   - The "Processing..." indicator will appear in both the chat area and analysis section

4. **Review AI-Generated Options**
   - Once processing completes, you'll see 3-5 suggested responses in the Analysis Results section
   - Each suggestion includes:
     - The suggested text to say next
     - A score from 0.0 to 1.0 indicating its effectiveness
     - Higher scores represent more effective responses based on your goal
   - Options are displayed in cards that you can click to copy or use

5. **Continue the Conversation**
   - Choose one of the suggested responses or create your own
   - Add it to the conversation using the input field
   - Run the analysis again to get updated suggestions as the conversation evolves

This interactive flow allows you to simulate and improve real sales conversations with AI assistance, helping you develop more effective communication strategies.

## Setup Instructions
1. **Navigate to the frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

4. **Configure Socket.io Connection**
   Make sure to update the Socket.io connection URL in `src/app/chat/page.js` to match your backend server:
   ```javascript
   const socket = io('http://localhost:5000');  // Update this to match your backend URL
   ```

## Code Flow and Variables Explanation

### Socket.io Connection
The application establishes a WebSocket connection to the backend server using Socket.io:
```javascript
const socket = io('http://localhost:5000');
```

### State Variables
- `messages`: Array storing all chat messages with their source (`user` or `client`)
- `inputA` & `inputB`: State for the two input fields (customer and user messages)
- `animate`: Controls the animation state of visualization grids
- `goal`: Stores the conversation goal to be sent to the backend
- `context`: Maintains the current conversation context/history
- `existingContext`: Stores previously saved conversation contexts
- `analysisResults`: Stores parsed options received from the backend
- `projectContext` & `companyContext`: Additional context information
- `chatHistory`: List of previous chat sessions
- `isLoading`: Tracks loading state during backend processing

### Event Handlers
- `sendMessageA()`: Adds a customer message to the conversation
- `sendMessageB()`: Adds a user message to the conversation
- `handleSetExistingConversation()`: Sends the current context and goal to the backend
- `handleSetGoal()`: Sets the conversation goal and triggers context sending if available

### Socket Event Listeners
The application sets up listeners for various Socket.io events:
- `connect`: Logs connection and requests parsed options
- `disconnect`: Logs disconnection
- `chat-response`: Receives and displays responses from the server
- `chat-error`: Handles and displays errors
- `parsedoptions`: Receives and displays analysis results

### Visualization Components
- `AnimatedGrid`: Displays a grid of dots that animate in sequence
- `RandomAnimatedGrid`: Displays a grid with randomly colored dots and animation

### UI Sections
1. **Left Sidebar**: Contains company branding, context inputs, and chat history
2. **Center Area**: Main chat interface with message display and input fields
3. **Right Sidebar**: Contains goal setting, analysis results, and visualizations

## Technologies Used
- Next.js
- React (with Hooks for state management)
- Tailwind CSS for styling
- Framer Motion for animations
- Socket.io for real-time communication

## License
This project is licensed under the MIT License.
