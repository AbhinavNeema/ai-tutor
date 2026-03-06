import dotenv from "dotenv";
dotenv.config();

import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export async function callLLM(prompt) {

  if (!prompt || typeof prompt !== "string") {
    throw new Error("Prompt is empty");
  }

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.2
  });

  let text = completion.choices?.[0]?.message?.content || "";

  // 🔹 Remove markdown wrappers from LLM
  text = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("LLM JSON parse failed:", text);

    return {
      type: "text",
      content: text
    };
  }
}