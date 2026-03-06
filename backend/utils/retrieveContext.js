import CourseEmbedding from "../models/CourseEmbedding.js";
import { createEmbedding } from "../services/embeddingService.js";

export async function retrieveContext(courseId, question) {

  const queryEmbedding = await createEmbedding(question);

  const results = await CourseEmbedding.aggregate([
    {
      $vectorSearch: {
        index: "vector_index_1",  
        path: "embedding",
        queryVector: queryEmbedding,
        numCandidates: 100,
        limit: 5,
        filter: {
          courseId: courseId
        }
      }
    },
    {
      $project: {
        chunkText: 1,
        score: { $meta: "vectorSearchScore" }
      }
    }
  ]);

  return results.map(r => r.chunkText).join("\n\n");
}