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

      system: [
        {
          text: `
You must return ONLY valid JSON.
Do not include markdown.

JSON format must be exactly:

{
  "type": "text",
  "content": [
    {
      "type": "paragraph",
      "text": "your answer"
    }
  ]
}
`
        }
      ],

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

  text = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(text);
  } catch (err) {

    console.warn("LLM returned plain text, using fallback JSON");

    // 🔹 Always return valid JSON fallback
    return {
      type: "text",
      content: [
        {
          type: "paragraph",
          text: text
        }
      ]
    };
  }
}