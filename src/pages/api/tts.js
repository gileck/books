import { synthesizeSpeech } from '../../textToSpeech';

export default async function handler(req, res) {
    try {
        const { text, voice } = req.body;
        const data = await synthesizeSpeech(text, voice);
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(data || {});
    } catch (error) {
        console.error('TTS Error:', error);
        res.status(500).json({ error: 'Error synthesizing speech' });
    }
}
