import { callLLM } from "./services/llmService.js";

async function test() {
  const res = await callLLM("Explain recursion in one sentence.");
  console.log(JSON.stringify(res, null, 2));
}

test();