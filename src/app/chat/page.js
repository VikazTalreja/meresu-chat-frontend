"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import io from "socket.io-client";

const GRID_ROWS = 20;
const GRID_COLS = 7;
const socket = io('https://meresu-saleschat.onrender.com');  // Ensure this matches the backend port

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [inputA, setInputA] = useState("");
  const [inputB, setInputB] = useState("");
  const [animate, setAnimate] = useState(false);
  const [goal, setGoal] = useState("");
  const [context, setContext] = useState([]);
  const [existingContext, setExistingContext] = useState([]);
  const [analysisResults, setAnalysisResults] = useState([]);
  const [projectContext, setProjectContext] = useState("");
  const [companyContext, setCompanyContext] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { title: 'Chat with Alice', id: 1 },
    { title: 'Project Discussion', id: 2 },
    { title: 'Company Meeting', id: 3 }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
      socket.emit('request-parsed-options');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    socket.on('chat-response', (response) => {
      console.log('Response from server:', response);
      setMessages((prevMessages) => [...prevMessages, { text: response, from: 'server' }]);
      setIsLoading(false);
    });

    socket.on('chat-error', (error) => {
      console.error('Error from server:', error);
      setIsLoading(false);
    });

    socket.on('parsedoptions', (parsedOptions) => {
      console.log('Parsed options received:', parsedOptions);
      setAnalysisResults(parsedOptions);
      setIsLoading(false);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('chat-response');
      socket.off('chat-error');
      socket.off('parsedoptions');
    };
  }, []);

  // Log context whenever it changes
  useEffect(() => {
    console.log('Context updated:', context);
  }, [context]);

  const sendMessageA = () => {
    if (inputA.trim()) {
      const newMessage = { text: inputA, from: 'client' };
      setContext((prevContext) => [...prevContext, newMessage]);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputA("");
      // setIsLoading(true);
    }
  };

  const sendMessageB = () => {
    if (inputB.trim()) {
      const newMessage = { text: inputB, from: 'user' };
      setContext((prevContext) => [...prevContext, newMessage]);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputB("");
    }
  };

  const handleSetExistingConversation = () => {
    if (context.length > 0) {
      // Send both context and goal to the backend
      socket.emit('chat-message', { messages: context, goal: goal });
      console.log('Existing context set:', context);
      console.log('Goal sent:', goal);
      setIsLoading(true);
    } else {
      console.warn('No context to set');
    }
  };

  const handleSetGoal = () => {
    if (goal.trim()) {
      console.log('Goal set:', goal);
      // If there's already context, send it along with the goal
      if (context.length > 0) {
        handleSetExistingConversation();
      }
    } else {
      console.warn('No goal specified');
    }
  };

  useEffect(() => {
    setAnimate(isLoading);
  }, [isLoading]);

  return (
    <div className="flex flex-row items-stretch h-screen bg-gray-50">
      {/* Left sidebar */}
      <div className="w-2/5 h-full bg-gray-200 shadow-lg border-r border-gray-100">
        <div className="flex flex-col h-full p-6 space-y-6">
          {/* Company logo/brand */}
          <div className="flex items-center space-x-2 pb-4 border-b border-gray-100">
            <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center">
              <span className="text-white font-semibold text-sm">SS</span>
            </div>
            <h1 className="text-lg font-semibold text-gray-800">Social Stockfish</h1>
          </div>
          
          {/* Context Fields */}
          <div className="flex flex-col space-y-4">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Context</h2>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Project</label>
              <input
                type="text"
                placeholder="Add project context..."
                className="w-full p-2.5 rounded-lg text-gray-700 placeholder:text-gray-400 border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all"
                value={projectContext}
                onChange={(e) => setProjectContext(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Company</label>
              <input
                type="text"
                placeholder="Add company context..."
                className="w-full p-2.5 rounded-lg text-gray-700 placeholder:text-gray-400 border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all"
                value={companyContext}
                onChange={(e) => setCompanyContext(e.target.value)}
              />
            </div>
          </div>
          
          {/* Chat History */}
          <div className="flex-1 overflow-y-auto mt-2">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Chat History</h2>
            <ul className="space-y-2">
              {chatHistory.map((chat, index) => (
                <li key={index} className="hover:bg-gray-50 p-3 rounded-lg cursor-pointer transition duration-200 border border-gray-100 text-gray-700 text-sm">
                  {chat.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Center - Chat area */}
      <div className="w-full h-full bg-gray-100 flex flex-col">
        <div className="flex flex-col h-screen">
          {/* Header */}
          <motion.div
            className="flex items-center justify-between p-4 border-b border-gray-100 bg-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3">
            
              <motion.h2
                className="text-base font-medium text-gray-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                Conversation
              </motion.h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                Connected
              </span>
            </div>
          </motion.div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center space-y-4"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <h3 className="text-lg font-medium">Welcome to the Chat!</h3>
                  <p className="text-sm max-w-md">
                    Start by adding messages in the input fields below. You can set a conversation goal in the right sidebar to guide the AI&apos;s responses.
                  </p>
                </motion.div>
              </div>
            ) : (
              <>
                {isLoading && (
                  <div className="flex justify-center my-4">
                    <motion.div 
                      className="px-4 py-2 bg-white rounded-lg shadow-sm text-gray-500 text-sm"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    </motion.div>
                  </div>
                )}
                
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    className={`p-2 rounded-lg w-full flex ${
                      msg.from === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span 
                      className={`text-sm w-fit max-w-xs p-3 rounded-2xl ${
                        msg.from === 'user' 
                          ? 'bg-indigo-600 text-white ml-12' 
                          : 'bg-white text-gray-700 border border-gray-200 mr-12 shadow-sm'
                      }`}
                    >
                      {msg.text}
                    </span>
                  </motion.div>
                ))}
              </>
            )}
          </div>
          
          {/* Input Field */}
          {existingContext.length === 0 ? (
            <div className="grid grid-cols-2 gap-2 p-3 border-t border-gray-100 bg-white">
              <div className="flex items-center space-x-2">
                <motion.input 
                  type="text" 
                  className="flex-1 p-2.5 border border-gray-200 rounded-lg text-gray-700 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Customer's Message"
                  value={inputA}
                  onChange={(e) => setInputA(e.target.value)}
                />
                <motion.button
                  onClick={sendMessageA}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm text-white shadow-sm transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Add
                </motion.button>
              </div>
              <div className="flex items-center space-x-2">
                <motion.input 
                  type="text" 
                  placeholder="Your Message" 
                  className="flex-1 p-2.5 border border-gray-200 rounded-lg text-gray-700 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={inputB}
                  onChange={(e) => setInputB(e.target.value)}
                />
                <motion.button
                  onClick={sendMessageB}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm text-white shadow-sm transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Add
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="p-3 border-t border-gray-100 bg-white flex items-center space-x-2">
              <motion.button
                className="text-indigo-600 p-2 hover:bg-indigo-50 rounded-full"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </motion.button>
              <motion.input 
                type="text" 
                placeholder="Type a message" 
                className="flex-1 p-2.5 border border-gray-200 rounded-full text-gray-700 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={inputB}
                onChange={(e) => setInputB(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    sendMessageB();
                  }
                }}
                whileFocus={{ scale: 1.01 }}
              />
              <motion.button
                onClick={sendMessageA}
                className="p-2.5 rounded-full bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </motion.button>
            </div>
          )}
        </div>
      </div>
      
      {/* Right sidebar - Analytics */}
      <div className="w-3/5 h-full bg-gray-200 border-l border-gray-100">
        <div className="w-full h-full p-6 space-y-6 overflow-y-auto">
          {/* Conversation Goal section */}
          <div className="space-y-3"> 
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Conversation Goal</h2>
            <div className="flex flex-row space-x-2">
              <input
                type="text"
                placeholder="What are you trying to achieve?"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="flex-1 p-2.5 rounded-lg text-gray-700 placeholder:text-gray-400 border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
           
            </div>
          </div>
          
          {/* Analysis Results section */}
          <div className="space-y-3 pt-2">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Analysis Results</h2>
            <div className="space-y-2 mt-2 max-h-[200px] overflow-y-auto">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <motion.div 
                    className="flex flex-col items-center space-y-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-sm text-gray-500">Processing your conversation...</span>
                  </motion.div>
                </div>
              ) : analysisResults.length === 0 ? (
                <div className="flex py-6 justify-center items-center">
                  <motion.button
                    onClick={handleSetExistingConversation}
                    className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm text-white shadow-md transition-colors flex items-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>Run</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347c-.75.413-1.667-.13-1.667-.986V5.653z" />
                    </svg>
                  </motion.button>
                </div>
              ) : (
                analysisResults.map((result, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center p-3 border border-gray-100 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <span className="bg-indigo-600 text-white px-2 py-1 rounded text-xs font-medium min-w-[40px] text-center">
                      {result.score.toFixed(2)}
                    </span>
                    <p className="ml-3 text-sm text-gray-700">{result.option}</p>
                  </motion.div>
                ))
              )}
            </div>
          </div>
          
          {/* Analytics Visualizations */}
          <div className="flex flex-col space-y-4 pt-2">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Visualizations</h2>
            <AnimatedGrid title="Conversational State Exploration" color="#4f46e5" animate={animate} />
            <RandomAnimatedGrid title="Monte Carlo Simulation" color1="#4f46e5" color2="#8b5cf6" animate={animate} />
          </div>
        </div>
      </div>
    </div>
  );
}

function AnimatedGrid({ title, color, animate }) {
  return (
    <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
      <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
        <span>{title}</span>
      </h3>
      <div className="grid grid-cols-20 gap-0.5">
        {[...Array(GRID_ROWS)].map((_, row) => (
          [...Array(GRID_COLS)].map((_, col) => (
            <motion.div
              key={`${row}-${col}`}
              className="w-3 h-3 rounded-full bg-gray-200"
              animate={animate ? { backgroundColor: color } : {}}
              transition={{ delay: (row * GRID_COLS + col) * 0.07, duration: 0.1 }}
            />
          ))
        ))}
      </div>
    </div>
  );
}

function RandomAnimatedGrid({ title, color1, color2, animate }) {
  return (
    <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
      <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
        <span>{title}</span>
      </h3>
      <div className="grid grid-cols-20 gap-0.5">
        {[...Array(GRID_ROWS)].map((_, row) => {
          const numDots = GRID_COLS;
          const colors = Array.from({ length: numDots }, () => Math.random() > 0.5 ? color1 : color2);
          return (
            [...Array(GRID_COLS)].map((_, col) => (
              <motion.div
                key={`${row}-${col}`}
                className="w-3 h-3 rounded-full bg-gray-200"
                animate={animate ? { backgroundColor: colors[col] } : {}}
                transition={{ delay: Math.random() * 8, duration: 0.5 }}
              />
            ))
          );
        })}
      </div>
    </div>
  );
}