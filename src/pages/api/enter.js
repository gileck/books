import { getUser, isAdmin } from './userApi.js';
import { sendLog } from '@/telegramBot/bot.js';
export default async function handler(req, res) {
    const user = await getUser(req);
    if (user.username !== 'gileck') {
        await sendLog(`${user.username} entered the site`);
    }
    res.status(200).json({});
}