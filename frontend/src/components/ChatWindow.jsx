import { useEffect, useRef } from "react";
import { useChatStore } from "../store/chatStore";
import Message from "./Message";
import MCQPanel from "./modes/MCQPanel";
import InterviewPanel from "./modes/InterviewPanel";
import PaperPanel from "./modes/PaperPanel";

export default function ChatWindow() {

  const rawMessages = useChatStore(state => state.messages);
  const messages = Array.isArray(rawMessages) ? rawMessages : [];

  const containerRef = useRef(null);
  const bottomRef = useRef(null);

  function handlePaperSubmit(data){
    console.log("Paper submit", data);
  }

  // ==========================
  // AUTO SCROLL TO BOTTOM
  // ==========================

  useEffect(() => {

    requestAnimationFrame(() => {

      if(bottomRef.current){
        bottomRef.current.scrollIntoView({
          behavior: "smooth"
        });
      }

    });

  }, [messages]);

  return (

    <div
      ref={containerRef}
      id="chat-scroll-container"
      className="flex-1 overflow-y-auto p-6 space-y-4"
    >

      {messages.map((m,i)=>{

        let content;

        if(m?.data?.type==="mcq"){
          content = <MCQPanel data={m.data}/>
        }

        else if(m?.data?.type==="interview"){
          content = (
            <InterviewPanel
              data={m.data}
              onAnswer={(answer)=>console.log("Interview answer:",answer)}
            />
          )
        }

        else if(m?.data?.type==="paper"){
          content = (
            <PaperPanel
              data={m.data}
              onSubmit={handlePaperSubmit}
            />
          )
        }

        else{
          content = <Message message={m}/>
        }

        return (
          <div
            key={m.id || i}
            className="animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            {content}
          </div>
        )

      })}

      {/* SCROLL TARGET */}
      <div ref={bottomRef} />

    </div>

  );

}