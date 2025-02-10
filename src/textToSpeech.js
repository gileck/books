// Import the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech').v1beta1
const fs = require('fs');
const util = require('util');
const path = require('path');


const keyBase64 = process.env.GOOGLE_APPLICATION_CREDENTIALS;

const credentials = JSON.parse(Buffer.from(keyBase64, 'base64').toString('utf-8'));
const client = new textToSpeech.TextToSpeechClient({
    credentials,
});

function generateSSMLWithMarks(text) {
    const words = text.split(" ");
    let ssml = "<speak>";

    words.forEach((word, index) => {
        ssml += ` <mark name="${word}-${index}"/> ${word}`;
    });

    ssml += "</speak>";
    return ssml;
}

export async function synthesizeSpeech(text) {
    const textWithMarks = generateSSMLWithMarks(text)
    // console.log({ textWithMarks });

    const request = {
        enableTimePointing: ['SSML_MARK'],
        input: {
            ssml: `<speak>
            ${textWithMarks}
            </speak>`
        },
        voice: {
            languageCode: 'en-US',
            name: 'en-US-Wavenet-F'
        },
        audioConfig: { audioEncoding: 'MP3' },
    };

    const [response] = await client.synthesizeSpeech(request);
    // console.log({ response });

    return {
        audioContent: response.audioContent.toString('base64'),
        timepoints: response.timepoints
    }
}

