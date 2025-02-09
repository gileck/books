import axios from 'axios';
import dotenv from 'dotenv';
import OpenAI from "openai";
import fs from 'fs'
import path from 'path'

let OPENAI_API_KEY = null
if (process.env.NODE_ENV === 'development') {
    const { parsed } = dotenv.config()
    OPENAI_API_KEY = parsed.OPENAI_API_KEY
} else {
    OPENAI_API_KEY = process.env.OPENAI_API_KEY
}

// const { parsed: { OPENAI_API_KEY } } = dotenv.config()
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const MILLION = 1000000
const modelPrices = {
    'gpt-4o-mini': {
        prompt_tokens_price: 0.15 / MILLION,
        completion_tokens_price: 0.6 / MILLION
    },
    'gpt-3.5-turbo': {
        prompt_tokens_price: 0.5 / MILLION,
        completion_tokens_price: 1.5 / MILLION
    },
    'gpt-4-turbo': {
        prompt_tokens_price: 10 / MILLION,
        completion_tokens_price: 30 / MILLION
    },
    'gpt-4o': {
        prompt_tokens_price: 5 / MILLION,
        completion_tokens_price: 15 / MILLION
    },
}

function calcPrice(model, tokens) {
    const { completion_tokens, prompt_tokens } = tokens
    const prompt_tokens_price = modelPrices[model].prompt_tokens_price
    const completion_tokens_price = modelPrices[model].completion_tokens_price
    const price = ((prompt_tokens) * prompt_tokens_price) + ((completion_tokens) * completion_tokens_price)
    return Math.round((price * 3.7) * 1000) / 1000;
}

const models = {
    '3': 'gpt-4o-mini',
    '4': 'gpt-4o',

}
export async function getResult({ messages, systemText, inputText, max_tokens, isJSON, temperature, model }) {
    const modelToUse = models[model] || 'gpt-4o-mini'
    const gptOptions = {
        model: modelToUse,
        temperature: temperature || 0.8,
        response_format: { "type": isJSON ? "json_object" : 'text' },
        max_tokens: max_tokens || 10000,
        messages: messages || [
            {
                "role": "system",
                "content": `${systemText}`

            },
            {
                "role": "user",
                "content": `${inputText}`
            }
        ],

    }
    const response = await openai.chat.completions.create(gptOptions).catch(e => {
        console.log(`ERROR in getResponseFromGpt: ${e.message}`)
        return null
    })
    if (!response) {
        return null
    }
    // console.log({response})
    const content = response.choices[0].message.content
    const finish_reason = response.choices[0].finish_reason
    const usage = response.usage
    const apiPrice = calcPrice(modelToUse, usage)

    fs.appendFileSync(path.resolve('./gptFiles', `${(new Date()).toLocaleTimeString()}.json`), `
    ${JSON.stringify({ content, usage, apiPrice, finish_reason }, null, 2) + '\n\n'}
    `)

    return {
        finish_reason,
        result: isJSON ? JSON.parse(content) : content,
        apiPrice
    }
}

export async function getResponseFromGpt({ system, inputText, isJSON, model }) {
    const modelToUse = models[model] || 'gpt-4o-mini'


    const data = {
        model: modelToUse,
        temperature: 0.8,
        response_format: { "type": isJSON ? "json_object" : 'text' },
        messages: [
            {
                "role": "system",
                "content": `${system}`

            },
            {
                "role": "user",
                "content": `${inputText}`
            }
        ],
        max_tokens: 10000,
    }


    console.log({ data });

    const startTime = new Date()


    const response = await openai.chat.completions.create(data).catch(e => {
        console.log(`ERROR in getResponseFromGpt: ${e.message}`)
        return {
            error: e.message,

        }
    })

    const endTime = new Date()
    const duration = (endTime - startTime) / 1000

    if (!response || response.error) {
        return {
            result: null,
            apiPrice: 0,
            modelToUse,
            error: true,
            message: response?.error,
            duration,
            usage: response?.usage || {},
        }
    }


    const content = response.choices[0].message.content
    const finish_reason = response.choices[0].finish_reason
    const usage = response.usage

    const apiPrice = calcPrice(modelToUse, usage)

    if (process.env.NODE_ENV === 'development') {
        fs.appendFileSync(path.resolve('./gptFiles', `${(new Date()).toLocaleTimeString()}.json`), `
    ${JSON.stringify({ content, usage, apiPrice, finish_reason }, null, 2) + '\n\n'}
    `)
    }

    let result = null
    try {
        result = isJSON ? JSON.parse(content) : content
    } catch (e) {
        console.log(e.message)
        console.log({content})
        return {
            result: null,
            apiPrice: 0,
            modelToUse,
            error: true,
            message: e.message,
            finish_reason,
            duration,
            usage
        }
    }

    return {
        result,
        apiPrice,
        modelToUse,
        usage,
        duration
    }


}