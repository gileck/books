import { getResponseFromGpt } from "@/ai/ai";
import { getUser } from "../userApi";
import { getDB } from "../db";
import { sendLog } from '@/telegramBot/bot.js';

export const config = {
    maxDuration: 60,
};

export default async function handler(req, res) {
    const { text, trainingPlanId } = req.body;
    const user = await getUser(req);
    if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    const db = await getDB();

    const trainingPlan = await db.collection('trainingPlans').findOne({ id: trainingPlanId });

    const prompt = `

    `;

    const { result, apiPrice, modelToUse, usage, duration } = await getResponseFromGpt({
        system: '',
        inputText: prompt,
        isJSON: true,
        model: '3'
    })



    res.status(200).json({ result, apiPrice });

    await sendLog(`
        AI: PersonalCoachAI
        User: ${user.username}
        Question: ${text}
        Result: ${JSON.stringify(result || '').length} characters
        price: ${apiPrice}
        model: ${modelToUse}
        tokens: ${usage.total_tokens}
        duration: ${duration}
        date: ${new Date().toLocaleString()}
    `);

    await db.collection('ai-api-logs').insertOne({
        type: 'PersonalCoachAI',
        user: user.username,
        input: text,
        result,
        price: apiPrice,
        model: modelToUse,
        tokens: usage.total_tokens,
        date: new Date(),
        duration
    });

}