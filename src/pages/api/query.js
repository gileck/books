import { getResponseFromGpt } from "@/ai/ai"
export default async function handler(req, res) {
    const inputText = req.inputText
    console.log({ inputText })


    const { result, apiPrice } = await getResponseFromGpt({
        system: '',
        inputText: inputText,
        isJSON: false,
        model: '4'
    })
    res.status(200).json({ result, apiPrice })
}