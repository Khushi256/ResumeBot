// src/component/ChatForm.jsx
import {useRef} from 'react'
import { Download, Send, User, Bot, FileText, Loader, MessageCircle, Eye, Code } from 'lucide-react';

const ChatForm = ({chatHistory,setChatHistory,generateResponse}) => {
    const inputRef = useRef(null);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const userMessage = inputRef.current.value.trim();
        if (userMessage === '') return;
        console.log("Message sent:", userMessage);
        inputRef.current.value = '';

        // Update chat history with the new message
        setChatHistory((history) => [
            ...history,
            { role: 'user', text: userMessage }
        ]);

        // Simulate AI response 
        setTimeout(() => {
            setChatHistory((history) => [
                ...history,
                { role: 'model', text: "Thinking..." }
            ]);
            generateResponse([...chatHistory, { role: 'user', text: `Hello! I'm your AI Resume Assistant 🤖. I'll help you create a professional resume through our conversation. Let's start with your full name. ${userMessage}` }]);
        }, 500); // Simulate AI response delay
 
    };

  return (
    <form action="#" className="chat-form" onSubmit={handleFormSubmit}>
        <input type="text" 
        placeholder="Message" 
        className="message-input"
        ref={inputRef}
        required/>
        <User></User>
        <button type="submit" className="send-button" title="Send Message">
            <Send size={20}/>
        </button>
    </form>
  )
};

export default ChatForm;
