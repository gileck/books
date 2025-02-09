import { synthesizeSpeech } from '../../textToSpeech';

export default async function handler(req, res) {
    try {
        const { text } = req.body;
        const data = await synthesizeSpeech(text);
        res.setHeader("Content-Type", "audio/mpeg"); // or audio/wav depending on encoding

        res.status(200).send(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error synthesizing speech' });
    }
}
