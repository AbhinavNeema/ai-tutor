import fs from "fs";
import { convertPDFToImages } from "../utils/pdfToImages.js";
import { readTextFromImage } from "../utils/ocrReader.js";
import { callLLM } from "../services/llmService.js";

export async function evaluateAnswerSheet(req,res){

  try{

    const file = req.file;

    if(!file){
      return res.status(400).json({
        error:"No file uploaded"
      });
    }

    let extractedText="";

    // =====================
    // PDF → images
    // =====================

    if(file.mimetype==="application/pdf"){

      const images = await convertPDFToImages(file.path);

      for(const img of images){

        const text = await readTextFromImage(img);

        extractedText += "\n" + text;

      }

    }

    // =====================
    // Image directly
    // =====================

    else{

      const text = await readTextFromImage(file.path);

      extractedText = text;

    }


    // =====================
    // LLM evaluation
    // =====================

    const prompt = `
You are a university professor grading a student's answer sheet.

Student answers extracted via OCR:

${extractedText}

Evaluate the answers.

Return STRICT JSON:

{
 "results":[
   {
     "question":"string",
     "score":number,
     "feedback":"short explanation"
   }
 ],
 "totalScore":number,
 "summary":"overall feedback"
}
`;

    const evaluation = await callLLM(prompt);

    res.json(evaluation);

  }
  catch(err){

    console.error(err);

    res.status(500).json({
      error:err.message
    });

  }

}

export async function evaluateTypedAnswers(req,res){

  try{

    const answers = req.body.answers;

    if(!answers){
      return res.status(400).json({
        error:"No answers provided"
      });
    }

    const prompt = `
You are a university professor grading answers.

Student answers:

${JSON.stringify(answers,null,2)}

Return STRICT JSON:

{
 "results":[
   {
     "question":"string",
     "score":number,
     "feedback":"short explanation"
   }
 ],
 "totalScore":number,
 "summary":"overall feedback"
}
`;

    const evaluation = await callLLM(prompt);

    res.json(evaluation);

  }
  catch(err){

    console.error(err);

    res.status(500).json({
      error:err.message
    });

  }

}