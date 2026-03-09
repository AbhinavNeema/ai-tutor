import dotenv from "dotenv";
dotenv.config();

import {
  BedrockRuntimeClient,
  ConverseCommand
} from "@aws-sdk/client-bedrock-runtime";

const groq = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "us-east-1"
});

export async function callLLM(prompt) {

  if (!prompt || typeof prompt !== "string") {
    throw new Error("Prompt is empty");
  }

  const completion = await groq.send(
    new ConverseCommand({
      modelId: "meta.llama3-8b-instruct-v1:0",
      messages: [
        {
          role: "user",
          content: [{ text: prompt }]
        }
      ],
      inferenceConfig: {
        temperature: 0.2
      }
    })
  );

  let text = completion.output?.message?.content?.[0]?.text || "";

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