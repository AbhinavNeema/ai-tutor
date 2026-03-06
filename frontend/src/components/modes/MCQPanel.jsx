import { useState } from "react";

export default function MCQPanel({ data }) {
  const questions = data?.questions || [];
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function choose(qIndex, optionIndex) {
    if (submitted) return;
    setAnswers((prev) => ({
      ...prev,
      [qIndex]: optionIndex,
    }));
  }

  function submit() {
    setSubmitted(true);
  }

  const score = questions.reduce((acc, q, i) => {
    return answers[i] === q.correctIndex ? acc + 1 : acc;
  }, 0);

  return (
    <div className="max-w-3xl mx-auto my-8 font-sans antialiased text-slate-800">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            {data?.title || "Assessment Quiz"}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Please answer all questions before submitting.
          </p>
        </div>

        <div className="p-8">
          {questions.map((q, qi) => (
            <div key={qi} className="mb-10 last:mb-0">
              <div className="flex gap-3 mb-4">
                <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                  {qi + 1}
                </span>
                <p className="text-lg font-semibold leading-snug text-slate-800">
                  {q.question}
                </p>
              </div>

              <div className="space-y-3 ml-10">
                {q.options.map((opt, oi) => {
                  const selected = answers[qi] === oi;
                  const isCorrect = q.correctIndex === oi;
                  
                  let containerStyle = "border-slate-200 hover:border-blue-300 hover:bg-slate-50";
                  let radioStyle = "border-slate-300";

                  if (selected) {
                    containerStyle = "border-blue-500 bg-blue-50/50 ring-1 ring-blue-500";
                    radioStyle = "border-blue-500 bg-blue-500";
                  }

                  if (submitted) {
                    if (isCorrect) {
                      containerStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-500";
                      radioStyle = "border-emerald-500 bg-emerald-500";
                    } else if (selected) {
                      containerStyle = "border-rose-500 bg-rose-50 text-rose-900 ring-1 ring-rose-500";
                      radioStyle = "border-rose-500 bg-rose-500";
                    } else {
                      containerStyle = "border-slate-100 opacity-60 pointer-events-none";
                    }
                  }

                  return (
                    <div
                      key={oi}
                      onClick={() => choose(qi, oi)}
                      className={`group flex items-center p-4 border rounded-xl transition-all duration-200 ${
                        submitted ? "cursor-default" : "cursor-pointer"
                      } ${containerStyle}`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 mr-4 flex items-center justify-center transition-colors ${radioStyle}`}>
                        {selected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span className="text-[15px] font-medium">{opt}</span>
                    </div>
                  );
                })}
              </div>

              {submitted && answers[qi] !== q.correctIndex && (
                <div className="mt-4 ml-10 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
                  <p className="text-sm text-amber-900">
                    <span className="font-bold">Explanation:</span> {q.explanation}
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* Action Area */}
          <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
            {!submitted ? (
              <button
                onClick={submit}
                disabled={Object.keys(answers).length < questions.length}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                Finish & Submit
              </button>
            ) : (
              <div className="w-full flex items-center justify-between bg-slate-900 text-white p-6 rounded-2xl shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <p className="text-slate-400 text-sm uppercase tracking-wider font-bold">Your Score</p>
                  <p className="text-3xl font-black">
                    {score} <span className="text-slate-500 text-xl">/ {questions.length}</span>
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {Math.round((score / questions.length) * 100)}%
                  </div>
                  <p className="text-slate-400 text-xs">Completion Accuracy</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}