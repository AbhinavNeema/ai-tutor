import { useState } from "react";

export default function ChatInput({ onSend }) {
  const [text, setText] = useState("");
  const [mode, setMode] = useState("normal");

  const modes = [
    { id: "normal", label: "Chat", color: "bg-blue-600" },
    { id: "teacher", label: "Teacher", color: "bg-indigo-600" },
    { id: "mcq", label: "MCQ", color: "bg-emerald-600" },
    { id: "interview", label: "Interview", color: "bg-amber-600" },
    { id: "paper", label: "Exam", color: "bg-rose-600" },
  ];

  function handleSend() {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed, mode);
    setText("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const currentPlaceholder = {
    normal: "Ask a question...",
    teacher: "Explain a concept...",
    mcq: "Generate a quiz about...",
    interview: "Start a mock interview for...",
    paper: "Create an exam paper on...",
  }[mode];

  return (
    <div className="sticky bottom-0 w-full bg-white/80 backdrop-blur-md border-t border-slate-200 p-4 pb-6 transition-all">
      <div className="max-w-4xl mx-auto space-y-4">
        
        {/* MODE SELECTOR - Modern Pill Style */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 bg-slate-100/80 rounded-2xl w-fit mx-auto border border-slate-200/50">
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                mode === m.id
                  ? `${m.color} text-white shadow-sm`
                  : "text-slate-500 hover:bg-white hover:text-slate-700"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* INPUT BOX - Modern AI Style */}
        <div className="relative flex items-end gap-3 bg-white border border-slate-200 rounded-2xl p-2 shadow-sm focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50 transition-all">
          <textarea
            className="flex-1 bg-transparent border-0 focus:ring-0 text-slate-700 placeholder-slate-400 text-[15px] leading-relaxed py-2 px-3 resize-none min-h-[44px] max-h-[200px]"
            rows={text.split('\n').length > 1 ? 3 : 1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={currentPlaceholder}
          />

          <button
            onClick={handleSend}
            disabled={!text.trim()}
            className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
              text.trim() 
                ? `${modes.find(m => m.id === mode).color} text-white shadow-md active:scale-90` 
                : "bg-slate-100 text-slate-300 cursor-not-allowed"
            }`}
          >
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              className="w-5 h-5"
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>

        <p className="text-center text-[10px] text-slate-400 font-medium">
          Press <span className="px-1 py-0.5 bg-slate-100 rounded border border-slate-200">Enter</span> to send · <span className="px-1 py-0.5 bg-slate-100 rounded border border-slate-200">Shift + Enter</span> for new line
        </p>
      </div>
    </div>
  );
}