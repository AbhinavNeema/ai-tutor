import { useState, useEffect } from "react";
import { getCourses } from "../api/api";

export default function Sidebar({ chats = [], onSelectChat, onNewChat, onDeleteChat, activeChatId }) {
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    async function loadCourses() {
      try {
        const data = await getCourses();
        setCourses(data?.courses || []);
      } catch (error) {
        console.error("Failed to load courses", error);
      }
    }
    loadCourses();
  }, []);

  return (
    <div className="w-72 bg-slate-50 border-r border-slate-200 h-screen flex flex-col font-sans transition-all">
      
      {/* Header / New Chat Section */}
      <div className="p-4 border-b border-slate-100 bg-white/50 backdrop-blur-sm sticky top-0 z-20">
        <button
          onClick={() => setShowCourseDropdown(!showCourseDropdown)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          New Session
        </button>

        {/* Floating Course Selector */}
        {showCourseDropdown && (
          <div className="absolute top-16 left-4 right-4 bg-white border border-slate-200 rounded-xl shadow-xl z-30 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
            <div className="p-2 space-y-1">
              <div
                className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer rounded-lg transition-colors group"
                onClick={() => {
                  setShowCourseDropdown(false);
                  onNewChat(null);
                }}
              >
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                </div>
                <span className="text-sm font-bold text-slate-700">General Assistant</span>
              </div>

              <div className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Courses</div>

              <div className="max-h-60 overflow-y-auto custom-scrollbar">
                {courses.map((course) => (
                  <div
                    key={course._id}
                    className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer rounded-lg transition-colors group"
                    onClick={() => {
                      setShowCourseDropdown(false);
                      onNewChat(course._id);
                    }}
                  >
                    <div className="w-8 h-8 bg-slate-100 text-slate-500 rounded-lg flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.582.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                    </div>
                    <span className="text-sm font-semibold text-slate-600 truncate">{course.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
        <h4 className="px-3 mb-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Recent History</h4>
        
        {chats.map((chat) => (
          <div
            key={chat._id}
            className={`group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
              activeChatId === chat._id
                ? "bg-white border border-slate-200 shadow-sm ring-1 ring-slate-200"
                : "text-slate-500 hover:bg-slate-200/50 hover:text-slate-900"
            }`}
            onClick={() => onSelectChat(chat)}
          >
            {/* Active Indicator Bar */}
            {activeChatId === chat._id && (
              <div className="absolute left-[-12px] w-1.5 h-6 bg-blue-600 rounded-r-full" />
            )}

            <svg className={`w-4 h-4 flex-shrink-0 ${activeChatId === chat._id ? "text-blue-600" : "text-slate-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>

            <span className="flex-1 text-[13.5px] font-semibold truncate">
              {chat.title || "Untitled Session"}
            </span>

            {onDeleteChat && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(chat._id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-rose-50 hover:text-rose-600 text-slate-300 rounded-md transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Footer / User Profile Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold text-xs">U</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">My Learning</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Free Account</p>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
}