// Import the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech').v1beta1
const fs = require('fs');
const util = require('util');
const path = require('path');

function getClient() {
    try {
        const keyBase64 = process.env.GOOGLE_APPLICATION_CREDENTIALS;
        const credentials = JSON.parse(Buffer.from(keyBase64, 'base64').toString('utf-8'));
        const client = new textToSpeech.TextToSpeechClient({
            credentials,
        });
    return client;
    } catch (e) {
        // console.log(e);
        return null;
    }
    
}



function generateSSMLWithMarks(text) {
    const words = text.split(" ");
    let ssml = "<speak>";

    words.forEach((word, index) => {
        ssml += ` <mark name="${word}-${index}"/> ${word}`;
    });

    ssml += "</speak>";
    return ssml;
}

export async function synthesizeSpeech(text, voiceId = 'en-US-Neural2-F') {
    if (!text) {
        return null;
    }
    const textWithMarks = generateSSMLWithMarks(text);

    const request = {
        enableTimePointing: ['SSML_MARK'],
        input: {
            ssml: `<speak>${textWithMarks}</speak>`
        },
        voice: {
            languageCode: 'en-US',
            name: voiceId // Use the provided voice ID
        },
        audioConfig: { audioEncoding: 'MP3' },
    };

    const client = getClient();
    if (!client) {
        return null;
    }

    const [response] = await client.synthesizeSpeech(request);

    if (!response || !response.audioContent) {
        return null
    }

    return {
        audioContent: response.audioContent.toString('base64'),
        timepoints: response.timepoints
    }
}

