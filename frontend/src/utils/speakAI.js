export function speakAI(text,setSpeaking){

 if(!text) return;

 const speech = new SpeechSynthesisUtterance(text);

 speech.lang = "en-US";
 speech.rate = 1;

 speech.onstart = ()=>{
  setSpeaking(true);
 }

 speech.onend = ()=>{
  setSpeaking(false);
 }

 window.speechSynthesis.cancel();
 window.speechSynthesis.speak(speech);

}