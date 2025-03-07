import { getResponseFromGpt } from "@/ai/ai";

export const config = {
    maxDuration: 60,
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
        responseLimit: '4mb',
    },
};

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            error: 'Method not allowed',
            message: 'This endpoint only supports POST requests'
        });
    }

    try {
        const { text, question, context } = req.body;
        
        if (!text || !question || !context) {
            return res.status(400).json({ 
                error: 'Bad request',
                message: 'Missing required fields: text, question, or context'
            });
        }

        const prompt = `You are an expert literature analyst helping a reader understand a passage from a book they're reading. 

In ${context.chapterName} of the book, here's the surrounding context to help you understand the passage better:
"""
${context.contextText}
"""

The reader has selected this specific passage and would like to understand it better:
"""
${text}
"""

Their question about this passage is: ${question}

Please provide a clear, insightful analysis that helps the reader better understand this passage. Consider the context, themes, and significance within the chapter. If relevant, explain any literary devices, symbolism, or deeper meanings that might enhance their understanding.
`;

        const { result, apiPrice, modelToUse, usage, duration } = await getResponseFromGpt({
            system: 'You are a knowledgeable literary expert who specializes in helping readers understand and appreciate books more deeply. Your responses should be insightful yet accessible.',
            inputText: prompt,
            isJSON: false,
            model: '3'
        });

        return res.status(200).json({ result, apiPrice });

        // await sendLog(`
        //     AI: PersonalCoachAI
        //     User: ${user.username}
        //     Question: ${text}
        //     Result: ${JSON.stringify(result || '').length} characters
        //     price: ${apiPrice}
        //     model: ${modelToUse}
        //     tokens: ${usage.total_tokens}
        //     duration: ${duration}
        //     date: ${new Date().toLocaleString()}
        // `);

        // await db.collection('ai-api-logs').insertOne({
        //     type: 'PersonalCoachAI',
        //     user: user.username,
        //     input: text,
        //     result,
        //     price: apiPrice,
        //     model: modelToUse,
        //     tokens: usage.total_tokens,
        //     date: new Date(),
        //     duration
        // });
    } catch (error) {
        console.error('Error in AI question API:', error);
        return res.status(500).json({ 
            error: 'Internal server error',
            message: 'An error occurred while processing your request'
        });
    }
}