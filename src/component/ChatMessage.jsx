import ReactMarkdown from 'react-markdown';

function ChatMessage({ chat }) {
  return (
    chat.hideInChat ? null :
    <div className={`${chat.role === "model" ? 'bot' : 'user'}-message`}>
      <div className="message-text">
        <ReactMarkdown>{chat.text}</ReactMarkdown>
      </div>
    </div>
  );
}

export default ChatMessage;
