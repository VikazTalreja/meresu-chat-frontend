"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import io from "socket.io-client";

const GRID_ROWS = 20;
const GRID_COLS = 7;
const socket = io('https://meresu-saleschat.onrender.com'); // Ensure this matches the backend port

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
    });

    socket.on('chat-error', (error) => {
      console.error('Error from server:', error);
    });

    socket.on('parsedoptions', (parsedOptions) => {
      console.log('Parsed options received:', parsedOptions);
      setAnalysisResults(parsedOptions);
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
    }
  };

  const sendMessageB = () => {
    if (inputB.trim()) {
      const newMessage = { text: inputB, from: 'user' };
      setContext((prevContext) => [...prevContext, newMessage]);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      // socket.emit('chat-message', inputB);
      setInputB("");
    }
  };

  const handleSetExistingConversation = () => {
    if (context.length > 0) {
      socket.emit('chat-message', context);
      console.log('Existing context set:', context);
    } else {
      console.warn('No context to set');
    }
  };

  
  return (
    <div className="flex flex-row items-center justify-center h-screen bg-gray-100">
      <div className="w-1/5 h-full bg-gray-100 shadow-lg text-black">
        <div className="flex flex-col h-full p-6 space-y-6">
          {/* Upper Half: Context Fields */}
          <div className="flex flex-col space-y-4">
            <h2 className="text-xl font-bold">Add Context</h2>

            <h5 className="text-sm font-semibold">Project Context</h5>
            <input
              type="text"
              placeholder="Type here..."
              className="p-3 rounded-lg text-black placeholder:text-gray-400 border border-gray-500  focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={projectContext}
              onChange={(e) => setProjectContext(e.target.value)}
            />
            <h5 className="text-sm font-semibold">Company Context</h5>
            <input
              type="text"
              placeholder="Type here..."
              className="p-3 rounded-lg text-black placeholder:text-gray-400 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={companyContext}
              onChange={(e) => setCompanyContext(e.target.value)}
            />
          </div>
          {/* Bottom Half: Chat History */}
          <div className="flex-1 overflow-y-auto mt-6">
            <h2 className="text-xl font-bold">Chat History</h2>
            <ul className="space-y-3">
              {chatHistory.map((chat, index) => (
                <li key={index} className="hover:bg-gray-600 p-3 rounded-lg cursor-pointer transition duration-200">
                  {chat.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="w-full h-full bg-gradient-to-r from-red-500 to-pink-500">
        <div className="flex flex-col h-screen bg-white overflow-hidden">
          {/* Header */}
          <motion.div
            className="flex items-center justify-between p-4 border-b shadow-md bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.button
              className="text-white  text-lg "
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              &#x2190;
            </motion.button>
            <div className="flex items-center gap-2">
              <motion.span
                className="text-lg font-semibold text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                Conversation till now 
              </motion.span>
            </div>
            <motion.button
              className="text-black text-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              
            </motion.button>
          </motion.div>

          <div className="flex-1 overflow-y-auto w-full p-4 space-y-4">
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                className={`p-2 rounded-lg w-full flex ${
                  msg.from === 'user' ? 'justify-end items-end text-right' : 'justify-start items-start text-left '
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <span className={`text-sm flex-col w-fit max-w-xs p-2  rounded-3xl px-4 ${
                  msg.from === 'user' ? 'bg-[#007AFF] text-white' : 'bg-gray-200 text-black'
                }`}>
                  {msg.text}
                </span>
              </motion.div>
            ))}
          </div>
          {/* Input Field */}

          {existingContext.length === 0 ? (
            <div className="flex flex-row">
              <div className="p-4 w-full border-t flex items-center bg-gray-50">
                <motion.input 
                  type="text" 
                  className="flex-1 mx-2 p-2 border border-opacity-40 text-black rounded-lg text-sm focus:outline-blue-600"
                  placeholder="Customer's Message"
                  value={inputA}
                  onChange={(e) => setInputA(e.target.value)}
                />
                <motion.button
                  onClick={sendMessageA}
                  className="text-white bg-[#007AFF] hover:bg-blue-700 rounded-lg py-1 px-4 text-lg shadow-md"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  Add
                </motion.button>
              </div>
              <div className="p-4 w-full border-t flex items-center bg-gray-50">
                <motion.input 
                  type="text" 
                  placeholder="Your Message" 
                  className="flex-1 mx-2 p-2 border border-opacity-40 text-black rounded-lg text-sm focus:outline-blue-600"
                  value={inputB}
                  onChange={(e) => setInputB(e.target.value)}
                />
                <motion.button
                  onClick={sendMessageB}
                  className="text-white bg-[#007AFF] hover:bg-blue-700 rounded-lg py-1 px-4 text-lg shadow-md"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  Add
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="p-4 border-t flex items-center bg-gray-50">
              <motion.button
                className="text-blue-600 text-3xl"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                +
              </motion.button>
              <motion.input 
                type="text" 
                placeholder="Type a message" 
                className="flex-1 mx-2 p-2 border border-opacity-40 text-black rounded-full text-sm focus:outline-blue-600"
                value={inputB}
                onChange={(e) => setInputB(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    sendMessageB();
                  }
                }}
                whileFocus={{ scale: 1.05 }}
              />
              <motion.button
                onClick={sendMessageA}
                className="text-white bg-[#007AFF] hover:bg-blue-600 rounded-full py-2 px-4 text-sm shadow-md"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                Add
              </motion.button>
            </div>
          )}
        </div>
      </div>
      <div className="w-2/5 h-full bg-gray-100   ">
        <div className="w-full h-full mx-auto p-4 space-y-4 border border-gray-200 h-full ">
          {/* Profile section */}
          <div className="flex justify-between my-4 items-center">
            <div className="flex items-center space-x-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Social Stockfish</h2>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-green-700 bg-green-100 px-2 py-1 rounded-full">connected</span>
            </div>
          </div>
          {/* Conversation Goal section */}
          <div> 
            <p className="text-xs font-semibold text-gray-600 uppercase">Conversation Goal</p>
            <div className="flex flex-row space-x-2">
              <input
                type="text"
                placeholder="Enter your goal..."
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="mt-1 w-[80%] px-3 py-2 text-black border rounded-lg text-sm focus:ring focus:ring-blue-300"
              />
              <button className="text-white bg-[#007AFF] hover:bg-blue-800 rounded-lg w-fit px-5 text-sm">Set</button>
            </div>
          </div>
          {/* Analysis Results section */}
          <div>
            <p className="text-xs font-semibold text-gray-600 uppercase">Analysis Results</p>
            <div className="space-y-1 mt-2 max-h-[200px] overflow-y-auto">
              {analysisResults.length == 0 ? (
                <div className="flex py-4 justify-center items-center">
                  <motion.button
                    onClick={handleSetExistingConversation}
                    className="text-white bg-[#007AFF] hover:bg-blue-600 w-[90%] rounded-md py-2 px-4 text-sm shadow-md"
               
                    whileTap={{ scale: 1.1 }}
                  >
                    Run Existing Conversation
                  </motion.button>
                </div>
              ) : (
                analysisResults.map((result, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center border-b border-gray-200 p-2 border rounded-lg shadow-md bg-gray-50"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="bg-[#007AFF] text-white px-3 py-1 rounded-lg text-xs font-semibold">
                      {result.score.toFixed(2)}
                    </span>
                    <p className="ml-3 text-xs text-gray-700">{result.option}</p>
                  </motion.div>
                ))
              )}
            </div>
          </div>
          <div className="flex flex-col items-center space-y-4 p-4">
            <AnimatedGrid title="Conversational State Exploration" color="#007bff" animate={animate} />
            <AnimatedGrid title="Monte Carlo Simulation " color="#f4c20d" animate={animate} />
          </div>
        </div>
      </div>
    </div>
  );
}

function AnimatedGrid({ title, color , animate }) {
  return (
    <div className="p-4 w-full bg-white shadow-lg rounded-lg border">
      <h2 className="text-sm font-semibold mb-2 flex text-black items-center gap-2">
        <span>{title}</span>
      </h2>
      <div className="grid grid-cols-20 gap-1">
        {[...Array(GRID_ROWS)].map((_, row) => (
          [...Array(GRID_COLS)].map((_, col) => (
            <motion.div
              key={`${row}-${col}`}
              className="w-3 h-3 rounded-full bg-gray-300"
              animate={animate ? { backgroundColor: color } : {}}
              transition={{ delay: (row * GRID_COLS + col) * 0.02, duration: 0.1 }}
            />
          ))
        ))}
      </div>
    </div>
  );
}

function RandomAnimatedGrid({ title, color1, color2, animate }) {
  return (
    <div className="p-4 w-full bg-white shadow-lg rounded-lg border">
      <h2 className="text-sm font-semibold mb-2 flex text-black items-center gap-2">
        <span>{title}</span>
      </h2>
      <div className="grid grid-cols-20 gap-1">
        {[...Array(GRID_ROWS)].map((_, row) => {
          // Randomly determine the number of dots to fill in this row
          const numDots = Math.floor(Math.random() * GRID_COLS);
          // Randomly choose which color to use for each dot
          const colors = Array.from({ length: numDots }, () => Math.random() > 0.5 ? color1 : color2);
          return (
            [...Array(GRID_COLS)].map((_, col) => (
              <motion.div
                key={`${row}-${col}`}
                className="w-3 h-3 rounded-full bg-gray-300"
                animate={animate && col < numDots ? { backgroundColor: colors[col] } : {}}
                transition={{ delay: (row * GRID_COLS + col) * 0.02, duration: 0.1 }}
              />
            ))
          );
        })}
      </div>
    </div>
  );
}