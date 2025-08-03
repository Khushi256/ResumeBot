// src/App.jsx
import { useState, useRef, useEffect } from 'react';
import ChatMessage from "./component/ChatMessage";
import ChatForm from "./component/ChatForm";
import './App.css';
import { resumeInfo } from './resumeInfo';
import { Download, Send, User, Bot, FileText, Loader, MessageCircle, Eye, Code } from 'lucide-react';

const App = () => {
  const [chatHistory, setChatHistory] = useState([
    {
      role: 'model',
      text: resumeInfo.welcome
    }
  ]);

  const chatBodyRef = useRef(null);

  // Function to generate AI response
  const generateResponse = async (history) => {
    const updateHistory = (text) => {
      setChatHistory(prev =>
        [...prev.filter(msg => msg.text !== "Thinking..."), { role: "model", text }]
      );
    };

    const formattedHistory = history.map(({ role, text }) => ({
      role,
      parts: [{ text }]
    }));

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ contents: formattedHistory }),
    };

    try {
      const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to generate response');
      }

      let apiResponse = data.candidates[0].content.parts[0].text.replace(/<[^>]+>/g, '').trim();

      // Remove placeholder if it appears
      if (apiResponse.toLowerCase().includes("placeholder response")) {
        console.warn("Placeholder response received, skipping...");
        return;
      }
      if (!apiResponse.toLowerCase().includes("placeholder")) {
        updateHistory(apiResponse);
      }

    } catch (error) {
      console.error("Error generating response:", error);

      let errorText = "❌ Failed to get a response from AI.";
      if (error.message.toLowerCase().includes("overloaded")) {
        errorText = "⚠️ Gemini is overloaded. Please try again later.";
      }

      setChatHistory(prev =>
        [...prev.filter(msg => msg.text !== "Thinking..."), { role: "bot", text: errorText }]
      );
    }
  };

  useEffect(() => {
    // Scroll to bottom when chat history updates
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chatHistory]);

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <div className="header-info">
          <h1 className="logo-text"><Bot/> ResumeBot</h1>
          <p className="logo-subtitle">
            AI-Powered Resume Generator
          </p>
        </div>
      </div>

      {/* Chat Body */}
      <div ref={chatBodyRef} className="body">
        {chatHistory.map((chat, index) => (
          <ChatMessage key={index} chat={chat} />
        ))}
      </div>

      {/* Chat Input */}
      <div className="footer">
        <ChatForm
          chatHistory={chatHistory}
          setChatHistory={setChatHistory}
          generateResponse={generateResponse}
        />
      </div>
    </div>
  );
};

export default App;
