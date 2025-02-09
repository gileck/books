import { encryptData } from '@/crypto.js';
import clientPromise from '../../mongo.js';
import { sendLog } from '@/telegramBot/bot.js';
const cookie = require('cookie');
const calculateExpires = () => {
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    return oneYearFromNow
};

export default async function POST(req, res) {
    const client = await clientPromise;
    const db = client.db();
    const { username, password } = req.body;
    console.log({ username, password });

    const users = await db.collection('users').find({ username }).toArray();
    if (users.length === 0) {
        res.status(400).json({ error: 'User does not exist' });
        return;
    }
    const user = users[0];
    if (user.password !== password) {
        res.status(400).json({ error: 'Password is incorrect' });
        return;
    }
    const hashedUsername = encryptData(username);

    const cookieOptions = {
        expires: calculateExpires(),
        path: '/',

    };
    const serializedCookie = cookie.serialize('key', hashedUsername, cookieOptions);
    res.setHeader('Set-Cookie', serializedCookie);
    res.status(200).json({ message: 'User logged in' });

    await sendLog(`User ${username} logged in`)

}