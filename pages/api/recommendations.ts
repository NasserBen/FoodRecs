// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NearTextType } from 'types';
import type { NextApiRequest, NextApiResponse } from 'next';
import weaviate, { WeaviateClient, ApiKey } from 'weaviate-ts-client';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Object>
) {
  try {
    const { method } = req;
    let { query, userInterests } = req.body;

    const weaviateClusterUrl = process.env.WEAVIATE_CLUSTER_URL?.replace("https://", "")

    switch (method) {

      case 'POST': {

        let headers: { [key: string]: string } = {};

        if (process.env.OPENAI_API_KEY) {
            headers['X-OpenAI-Api-Key'] = process.env.OPENAI_API_KEY;
        }
        
        if (process.env.COHERE_API_KEY) {
            headers['X-Cohere-Api-Key'] = process.env.COHERE_API_KEY;
        }
        
        const client: WeaviateClient = weaviate.client({
          scheme: 'https',
          host: weaviateClusterUrl || 'recommender.c0.us-west3.gcp.weaviate.cloud',
          apiKey: new ApiKey(process.env.WEAVIATE_API_KEY || ''), 
          headers: headers,
        });

        let nearText: NearTextType = {
          concepts: [],
        }

        nearText.certainty = .6

        nearText.concepts = query;

        let generatePrompt = "Briefly describe why this restaurant might be perfect for someone who has interests or preferences in " + userInterests + ". the restaurant's name is {name}, category: {category}, location: {vicinity}, and review: {generated_review}. Don't make up anything that wasn't given in this prompt and don't ask how you can help.";

        let recDataBuilder = client.graphql
          .get()
          .withClassName('Restaurant')
          .withFields(
            'name rating user_ratings_total price_level vicinity formatted_address place_id types business_status formatted_phone_number website opening_hours reviews_count category generated_review'
          )
          .withNearText(nearText)
          .withLimit(20);
        
        if (headers['X-Cohere-Api-Key']) {
          recDataBuilder = recDataBuilder.withGenerate({
            singlePrompt: generatePrompt,
          });
        }
        
      const recData = await recDataBuilder.do();

        res.status(200).json(recData);
        break;
      }
      default:
        res.status(400);
        break;
    }
  } catch (err) {
    console.error(err);
    res.status(500);
  }
}
