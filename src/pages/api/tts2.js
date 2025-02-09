const { ElevenLabsClient } = require('elevenlabs');

const apiKey = 'sk_df725506ce883e8dabc8ee5b27db141240d335fa3d7be50e';
const voiceId = '21m00Tcm4TlvDq8ikWAM';
const text = 'Your sample text here.';

const elevenlabs = new ElevenLabsClient({
    apiKey: apiKey
});

async function synthesizeSpeech(text) {
    const audioBuffer = await elevenlabs.textToSpeech.convertWithTimestamps({
        text,
        voice: 'Sarah',
        model_id: 'eleven_multilingual_v2',
        output_format: 'mp3'
    });
    console.log({ audioBuffer });

    return audioBuffer
}

async function readStream(stream) {
    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks).toString('base64');
}

export default async function handler(req, res) {
    try {
        const { text } = req.body;
        const stream = await synthesizeSpeech(text);
        res.setHeader("Content-Type", "audio/mpeg"); // or audio/wav depending on encoding
        const content = await readStream(stream);
        res.status(200).json({
            audioContent: content,
            timepoints: []
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error synthesizing speech' });
    }
}
