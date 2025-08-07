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

      const rawText = await response.clone().text();
      console.log("Raw API response:", rawText);

      if (!response.ok) {
        throw new Error(`API Error: ${rawText}`);
      }

      if (!rawText) {
        throw new Error("Empty response body received from API.");
      }

      let data;
      try {
        data = JSON.parse(rawText);
      } catch (err) {
        throw new Error("Invalid JSON format in response.");
      }

      const apiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text?.replace(/<[^>]+>/g, '').trim();

      if (!apiResponse || apiResponse.toLowerCase().includes("placeholder response")) {
        console.warn("Placeholder response received, skipping...");
        return;
      }

      updateHistory(apiResponse);

    } catch (error) {
      console.error("Error generating response:", error.message);

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
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chatHistory]);

  return (
    <div className="container">
      <div className="header">
        <div className="header-info">
          <h1 className="logo-text"><Bot/> ResumeBot</h1>
          <p className="logo-subtitle">
            AI-Powered Resume Generator
          </p>
        </div>
      </div>

      <div ref={chatBodyRef} className="body">
        {chatHistory.map((chat, index) => (
          <ChatMessage key={index} chat={chat} />
        ))}
      </div>

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
