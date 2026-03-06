import React from "react";

export default function CourseSelector({ courses, value, onChange }) {
  // Find the current title for the display button
  const currentCourse = courses.find((c) => c._id === value);
  const displayTitle = currentCourse ? currentCourse.title : "General Chat";

  return (
    <div className="relative inline-block w-full max-w-[240px] font-sans">
      <div className="group relative">
        {/* Label for context (Optional) */}
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1.5">
          Select Subject
        </label>
        
        <div className="relative">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full appearance-none bg-white border border-slate-200 text-slate-700 py-2.5 pl-10 pr-10 rounded-xl cursor-pointer text-sm font-semibold transition-all duration-200 hover:border-blue-400 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 shadow-sm"
          >
            <option value="" className="font-medium text-slate-600">
              General Chat
            </option>

            {courses.map((c) => (
              <option key={c._id} value={c._id} className="font-medium">
                {c.title}
              </option>
            ))}
          </select>

          {/* Left Icon: Contextual visual */}
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            {!value ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.582.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            )}
          </div>

          {/* Right Icon: Custom Chevron */}
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-blue-500 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Subtle Active Indicator */}
      {value && (
        <div className="absolute -right-2 top-8 w-1 h-5 bg-blue-500 rounded-full animate-in fade-in zoom-in duration-300" />
      )}
    </div>
  );
}