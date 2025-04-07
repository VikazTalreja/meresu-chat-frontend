# Meresu - AI-Powered Sales Chat Assistant

## Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage Guide](#usage-guide)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)
- [Development](#development)
- [License](#license)

## Overview

Meresu is an AI-powered chat application designed to assist sales representatives in their conversations with customers. It analyzes conversation context and goals to provide intelligent response suggestions, helping sales representatives communicate more effectively.

The application uses advanced AI models (via the Groq API) to generate contextually relevant response options based on the conversation history and specified goals. Each response option comes with an effectiveness score, allowing sales representatives to choose the most impactful responses.

## Architecture

The project follows a client-server architecture with real-time communication:

### Frontend
- **Framework**: Next.js 15.2.2 with React 19
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Real-time Communication**: Socket.io Client
- **State Management**: React Hooks (useState, useEffect)

### Backend
- **Framework**: Node.js with Express
- **Real-time Communication**: Socket.io
- **AI Integration**: Groq API (LLaMA 3.3 70B model)
- **Environment Management**: dotenv

### Data Flow
1. User enters messages in the chat interface
2. User sets a conversation goal and context
3. Frontend sends data to backend via Socket.io
4. Backend processes the data using the Groq API
5. Backend parses the AI response and sends structured options back
6. Frontend displays the options with their effectiveness scores

## Features

### Chat Interface
- Dual input fields for simulating a real conversation
- Real-time message display with appropriate styling
- Loading indicators during AI processing
- Support for both customer and sales representative messages

### Context Management
- Project context input for project-specific information
- Company context input for company-specific information
- Conversation goal setting to guide AI suggestions
- Chat history display for reference

### AI-Powered Analysis
- Intelligent response generation based on conversation context
- Effectiveness scoring for each response option
- Multiple parsing strategies to handle various AI response formats
- Fallback mechanisms for handling parsing errors

### Visual Feedback
- Animated grids for visual representation of processing state
- Loading indicators during API calls
- Error handling with user-friendly messages
- Responsive design for various screen sizes

## Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Groq API key

### Backend Setup
1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/meresu.git
   cd meresu/backend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   ```

4. Start the backend server
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend directory
   ```bash
   cd ../frontend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env.local` file with the following variable:
   ```
   NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

5. Access the application at http://localhost:3000

## Configuration

### Environment Variables

#### Backend (.env)
- `GROQ_API_KEY`: Your Groq API key for accessing the AI model
- `PORT`: The port on which the backend server will run (default: 5000)
- `FRONTEND_URL`: The URL of the frontend application for CORS configuration

#### Frontend (.env.local)
- `NEXT_PUBLIC_BACKEND_URL`: The URL of the backend server for Socket.io connection

### Socket.io Events

#### Frontend to Backend
- `chat-message`: Sends conversation context, goal, and project/company context to the backend
- `request-parsed-options`: Requests the latest parsed options from the backend

#### Backend to Frontend
- `parsedoptions`: Sends parsed response options to the frontend
- `loading`: Indicates that the backend is processing a request
- `loaded`: Indicates that the backend has completed processing
- `chat-error`: Sends error information to the frontend
- `debug-info`: Sends debug information to the frontend

## Usage Guide

### Starting a Conversation
1. Enter a customer message in the left input field and click "Add"
2. Enter your response in the right input field and click "Add"
3. Continue adding messages to build the conversation history

### Setting Context and Goals
1. In the left sidebar, enter project context if applicable
2. In the left sidebar, enter company context if applicable
3. In the right sidebar, enter your conversation goal (e.g., "Close the sale", "Address pricing concerns")

### Running the Analysis
1. After adding messages and setting a goal, click the "Run" button in the Analysis Results section
2. The system will process your conversation and goal
3. Animated visualizations will indicate that processing is happening
4. Once complete, you'll see response options with effectiveness scores

### Using the Results
1. Review the response options and their effectiveness scores
2. Choose the most appropriate response based on the score and content
3. Enter the chosen response in the input field and click "Add"
4. Continue the conversation with the new response

## API Documentation

### Groq API Integration

The backend uses the Groq API to generate response options. The API call is configured with the following parameters:

```javascript
{
  "model": "llama-3.3-70b-versatile",
  "messages": [
    { role: "system", content: systemPrompt },
    { role: "user", content: JSON.stringify(messages) }
  ],
  "temperature": 0.7,
  "max_tokens": 350
}
```

The system prompt is dynamically generated based on the conversation goal and context.

### Response Parsing

The backend uses multiple strategies to parse the AI response:

1. **JSON Parsing**: Attempts to parse the response as JSON if it contains array notation
2. **Line-by-Line Parsing**: Uses regex patterns to extract options and scores from each line
3. **Global Regex Parsing**: Applies regex patterns to the entire response if line-by-line parsing fails
4. **Fallback Parsing**: Creates default options from text sections if all other methods fail

## Troubleshooting

### Common Issues

#### Socket Connection Problems
- **Symptom**: "Connected" indicator shows but no data is received
- **Solution**: 
  - Check that both frontend and backend servers are running
  - Verify the `NEXT_PUBLIC_BACKEND_URL` in the frontend matches the backend URL
  - Check browser console for CORS errors

#### Missing API Key
- **Symptom**: Error about missing GROQ API key
- **Solution**: 
  - Ensure the `.env` file exists in the backend directory
  - Verify the API key is correctly set in the `.env` file

#### Parsing Issues
- **Symptom**: No analysis results appear or results are incomplete
- **Solution**:
  - Check the browser console for errors
  - Look at the backend console for parsing errors
  - Verify the API response format matches the expected format

#### Frontend Not Starting
- **Symptom**: Error when running `npm run dev`
- **Solution**:
  - Ensure all dependencies are installed with `npm install`
  - Check for version conflicts in package.json
  - Try clearing the Next.js cache with `npm run dev -- --clear`

### Debugging

#### Backend Logging
The backend includes extensive logging to help diagnose issues:
- Connection events
- Message reception and processing
- API calls and responses
- Parsing attempts and results

#### Frontend Logging
The frontend logs important events to the browser console:
- Socket connection status
- Message sending and receiving
- State updates
- Rendering information

## Development

### Project Structure
```
meresu/
├── backend/
│   ├── index.js         # Main server file
│   ├── package.json     # Backend dependencies
│   └── .env             # Environment variables
├── frontend/
│   ├── src/
│   │   └── app/
│   │       └── chat/
│   │           └── page.js  # Main chat interface
│   ├── package.json     # Frontend dependencies
│   └── .env.local       # Frontend environment variables
└── README.md            # Project documentation
```

### Adding New Features

#### Adding a New API Integration
1. Create a new function in `backend/index.js` similar to `queryGroqChatbot`
2. Update the Socket.io event handler to use the new function
3. Test the integration with the frontend

#### Enhancing the UI
1. Modify the components in `frontend/src/app/chat/page.js`
2. Add new state variables and handlers as needed
3. Update the UI to display the new features

### Best Practices
- Keep the system prompt focused on the specific use case
- Use consistent naming conventions for Socket.io events
- Implement proper error handling at all levels
- Add logging for debugging purposes
- Test thoroughly before deploying changes

## License

This project is licensed under the MIT License.

## Acknowledgements
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Socket.io](https://socket.io/)
- [Groq API](https://groq.com/) 