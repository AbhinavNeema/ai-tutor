import { useState, useEffect } from "react";
import InterviewPanel from "./modes/InterviewPanel";
import MCQPanel from "./modes/MCQPanel";
import PaperPanel from "./modes/PaperPanel";

// Custom Hook for the Typing Effect
function useTypingEffect(text, isUser, speed = 15) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    // If it's the user, don't type, just show
    if (isUser) {
      setDisplayedText(text);
      setIsTyping(false);
      return;
    }

    setDisplayedText("");
    setIsTyping(true);
    let i = 0;
    const timer = setInterval(() => {
      setDisplayedText((prev) => text.substring(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, isUser, speed]);

  return { displayedText, isTyping };
}

export default function Message({ message, onAnswer }) {
  const data = message?.data;
  const isUser = message.role === "user";
  
  // Apply the typing effect only to non-data assistant messages
  const { displayedText, isTyping } = useTypingEffect(
    message.content || "", 
    isUser || !!data 
  );

  // =========================
  // DATA PANEL RENDERING
  // =========================
  if (data?.type === "mcq") {
    return <MCQPanel message={message} />;
  }

  if (data?.type === "interview") {
    return <InterviewPanel message={message} onAnswer={onAnswer} />;
  }

  if (data?.type === "paper") {
    return <PaperPanel message={message} />;
  }

  return (
    <div className={`group flex w-full mb-8 ${isUser ? "justify-end" : "justify-start"} animate-in fade-in duration-500`}>
      <div className={`flex max-w-[85%] sm:max-w-xl gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        
        {/* Avatar Area */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shadow-sm ${
          isUser ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-500"
        }`}>
          {isUser ? "ME" : "AI"}
        </div>

        {/* Message Content */}
        <div className="flex flex-col space-y-2">
          <div className={`px-4 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm transition-all ${
            isUser 
              ? "bg-blue-600 text-white rounded-tr-none" 
              : "bg-white border border-slate-100 text-slate-800 rounded-tl-none"
          }`}>
            <span className="whitespace-pre-wrap">{displayedText}</span>
            
            {/* Pulsing cursor while typing */}
            {isTyping && !isUser && (
              <span className="inline-block w-2 h-4 ml-1 bg-slate-400 animate-pulse align-middle" />
            )}
          </div>
          
          {/* Timestamp or Status (Optional) */}
          {!isTyping && (
            <span className={`text-[10px] font-bold text-slate-300 uppercase tracking-widest ${isUser ? "text-right" : "text-left"}`}>
              {isUser ? "Sent" : "Assistant"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}