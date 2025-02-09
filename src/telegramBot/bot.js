import dotenv from 'dotenv';
import path from 'path';
import TelegramBot from "node-telegram-bot-api";
const isDev = !!(process.env.NODE_ENV === 'development')
if (isDev) {
    dotenv.config({
        path: path.resolve('/Users/gil/Projects/training-plan/.env')
    });
}
console.log(process.env.TELEGRAM_BOT_KEY);
const bot = new TelegramBot(process.env.TELEGRAM_BOT_KEY, { polling: false })
const logsChatId = '-4204667120'
const groupChatId = '-4217945529'

bot.on('polling_error', (error) => {
    console.log('polling_error');
})

export const sendLog = (message) => {
    return bot.sendMessage(logsChatId, message);
}

export const sendMessage = (message) => {
    return bot.sendMessage(groupChatId, message);
}




