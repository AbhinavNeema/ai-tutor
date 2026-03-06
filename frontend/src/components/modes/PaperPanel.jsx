import { useState } from "react";

export default function PaperPanel({ data, onSubmit }) {

  const questions = data?.questions || [];
  const title = data?.title || "Exam Paper";
  const instructions = data?.instructions || "";

  const [answers,setAnswers] = useState({});
  const [submitted,setSubmitted] = useState(false);
  const [result,setResult] = useState(null);
  const [loading,setLoading] = useState(false);

  function updateAnswer(index,value){

    setAnswers(prev=>({
      ...prev,
      [index]:value
    }));

  }

  async function submitPaper(){

    const answerSheet = questions.map((q,i)=>({
      question:q.question,
      marks:q.marks || 0,
      answer:answers[i] || ""
    }));

    try{

      setLoading(true);

      if(!onSubmit){
        console.error("onSubmit not provided");
        return;
      }

      const evaluation = await onSubmit(answerSheet);

      if(evaluation){

        setResult(evaluation);
        setSubmitted(true);

      }

    }
    catch(err){

      console.error("Paper evaluation failed:",err);

    }
    finally{

      setLoading(false);

    }

  }

  function downloadPaper(){

    const text = `${title}\n\n${instructions}\n\n${questions
      .map((q,i)=>
        `${i+1}. ${q.question} (${q.marks} marks)\n\nAnswer:\n${answers[i] || ""}\n`
      )
      .join("\n")}`;

    const blob = new Blob([text],{type:"text/plain"});

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "exam-paper.txt";

    link.click();

  }

  return(

  <div className="max-w-4xl mx-auto my-10 font-sans text-slate-900">

    <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">

      {/* HEADER */}

      <div className="bg-slate-50 border-b border-slate-200 p-8">

        <div className="flex justify-between items-start">

          <div className="space-y-1">

            <h2 className="text-3xl font-extrabold tracking-tight">
              {title}
            </h2>

            {instructions && (
              <p className="text-slate-500 text-sm italic">
                {instructions}
              </p>
            )}

          </div>

          <button
            onClick={downloadPaper}
            className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-bold border"
          >
            Download Paper
          </button>

        </div>

      </div>

      <div className="p-8 space-y-10">

        {/* QUESTIONS */}

        <div className="space-y-8">

          {questions.map((q,i)=>(
            
            <div key={i}>

              <div className="flex gap-4 mb-3">

                <span className="text-slate-400 font-bold">
                  {i+1}
                </span>

                <div>

                  <p className="text-lg font-semibold">
                    {q.question}
                  </p>

                  {q.marks && (
                    <span className="text-xs bg-slate-100 px-2 py-1 rounded">
                      {q.marks} marks
                    </span>
                  )}

                </div>

              </div>

              <textarea
                className="w-full border rounded-lg p-4 min-h-[120px]"
                placeholder="Write your answer..."
                disabled={submitted || loading}
                value={answers[i] || ""}
                onChange={(e)=>updateAnswer(i,e.target.value)}
              />

              {result?.results?.[i] && (

                <div className="mt-4 p-4 bg-blue-50 border rounded">

                  <div className="flex justify-between mb-2">

                    <span className="text-xs font-bold">
                      Evaluation
                    </span>

                    <span className="bg-blue-600 text-white px-3 py-1 rounded text-xs">

                      {result.results[i].marksAwarded} / {q.marks}

                    </span>

                  </div>

                  <p className="text-sm italic">
                    {result.results[i].feedback}
                  </p>

                </div>

              )}

            </div>

          ))}

        </div>

        {/* SUBMIT */}

        {!submitted && (

          <button
            onClick={submitPaper}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl"
          >

            {loading ? "Evaluating..." : "Submit Answer Sheet"}

          </button>

        )}

        {/* FINAL RESULT */}

        {result && (

          <div className="mt-10 p-8 bg-slate-900 rounded-2xl text-white">

            <h3 className="text-sm uppercase tracking-widest text-slate-400">
              Final Result
            </h3>

            <div className="text-4xl font-bold mt-2">
              {result.score}
            </div>

            <p className="mt-4 text-slate-300">
              {result.summary}
            </p>

          </div>

        )}

      </div>

    </div>

  </div>

  );

}