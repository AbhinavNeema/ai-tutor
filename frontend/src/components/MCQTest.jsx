import {useState} from "react";

export default function MCQTest({data}){

 const [answers,setAnswers] = useState({});
 const [submitted,setSubmitted] = useState(false);

 function submit(){
  setSubmitted(true);
 }

 return(

 <div className="p-4">

  {data.questions.map((q,i)=>(
   <div key={i} className="mb-6">

    <div>{q.question}</div>

    {q.options.map((opt,idx)=>(
     <label key={idx} className="block">

      <input
       type="radio"
       name={`q${i}`}
       onChange={()=>setAnswers({...answers,[i]:idx})}
      />

      {opt}

     </label>
    ))}

    {submitted && answers[i]!==q.correctIndex &&(
     <div className="text-red-500">
      Explanation: {q.explanation}
     </div>
    )}

   </div>
  ))}

  {!submitted && (
   <button onClick={submit}>
    Submit Test
   </button>
  )}

 </div>

 );

}