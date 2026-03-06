import { useEffect, useState } from "react";
import InterviewAvatar from "../avatar/InterviewAvatar";

export default function InterviewPanel({ data, onAnswer }) {

 const question = data?.question;

 const [speaking,setSpeaking] = useState(false);
 const [answer,setAnswer] = useState("");
 const [questionCount,setQuestionCount] = useState(1);
 const maxQuestions = 5;
 const [finished,setFinished] = useState(false);

 // ----------------------
 // SPEAK QUESTION
 // ----------------------

 function speak(text){

  if(!text) return;

  window.speechSynthesis.cancel();

  const speech = new SpeechSynthesisUtterance(text);

  speech.lang="en-US";

  speech.onstart=()=>setSpeaking(true);
  speech.onend=()=>setSpeaking(false);

  window.speechSynthesis.speak(speech);

 }

 useEffect(()=>{

  if(question){

   const t=setTimeout(()=>{
    speak(question);
   },200);

   return ()=>clearTimeout(t);

  }

 },[question]);

 // ----------------------
 // SEND ANSWER
 // ----------------------

 function handleSend(){

  if(!answer.trim() || finished) return;

  if(onAnswer){
    onAnswer(answer);
  }

  setAnswer("");

  setQuestionCount(prev => {

    const next = prev + 1;

    if(next > maxQuestions){
      setFinished(true);
    }

    return next;

  });

 }

 return(

 <div className="flex flex-col items-center gap-6">

  <InterviewAvatar speaking={speaking}/>

  <div className="bg-white shadow p-4 rounded max-w-xl text-center">

   <p className="text-gray-800 font-medium">
    {question || "Preparing interview question..."}
   </p>

  </div>

  {!finished && (
    <textarea
      value={answer}
      onChange={(e)=>setAnswer(e.target.value)}
      placeholder="Type your answer..."
      className="w-full max-w-xl border rounded p-3"
      rows={4}
    />
  )}

  {!finished && (
    <button
      onClick={handleSend}
      className="px-6 py-3 rounded bg-blue-600 text-white"
    >
      Send Answer
    </button>
  )}

  {finished && (
    <div className="bg-green-50 border border-green-200 p-6 rounded text-center max-w-xl">
      <h3 className="font-bold text-lg mb-2">Interview Completed</h3>
      <p className="text-sm text-gray-600 mb-4">
        The interview session has ended. The AI will now generate your evaluation report.
      </p>
      <button
        onClick={()=>{
          if(onAnswer){
            onAnswer("__INTERVIEW_END__");
          }
        }}
        className="px-6 py-3 rounded bg-green-600 text-white"
      >
        Generate Interview Report
      </button>
    </div>
  )}

 </div>

 );

}