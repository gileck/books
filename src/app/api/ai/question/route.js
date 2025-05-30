import { getResponseFromGpt } from "@/ai/ai";
import { NextResponse } from 'next/server';

export const maxDuration = 60;

export async function POST(request) {
    try {
        const { text, question, context, answerLength = 'medium' } = await request.json();

        if (!text || !question || !context) {
            return NextResponse.json(
                {
                    error: 'Bad request',
                    message: 'Missing required fields: text, question, or context'
                },
                { status: 400 }
            );
        }

        // Define length instructions based on answerLength parameter


        const prompt = `You are an expert literature analyst helping a reader understand a passage from a book they're reading. 

In ${context.chapterName} of the book, here's the surrounding context to help you understand the passage better:
"""
${context.contextText}
"""

The reader has selected this specific passage and would like to understand it better:
"""
${text}
"""

Their question or request is: ${question}

Keep your response concise and to the point, around 2-3 sentences.

Please provide a clear, simple, insightful analysis that helps the reader better understand this passage. 
`;

        const { result, apiPrice, modelToUse, usage, duration } = await getResponseFromGpt({
            system: 'You are a knowledgeable literary expert who specializes in helping readers understand and appreciate books more deeply. Your responses should be insightful yet accessible.',
            inputText: prompt,
            isJSON: false,
            model: '3'
        });

        return NextResponse.json({ result, apiPrice });

        // Logging code commented out as in the original
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
        return NextResponse.json(
            { error: 'Failed to process request', message: error.message },
            { status: 500 }
        );
    }
}
