import { decryptData, encryptData } from '@/crypto.js';
import clientPromise from '../../mongo.js';

export async function isAdmin(req) {
    const client = await clientPromise;
    const db = client.db();
    const cookie = req.cookies.key;
    if (!cookie) {
        return null
    }
    const username = decryptData(cookie);
    const users = await db.collection('users').find({ username }).toArray();
    if (users.length === 0) {
        return null
    }
    const user = users[0];
    return user.username === "gileck"
}

export async function getUser(req) {
    const client = await clientPromise;
    const db = client.db();
    const cookie = req.cookies.key;
    if (!cookie) {
        return null
    }
    const username = decryptData(cookie);
    const users = await db.collection('users').find({ username }).toArray();
    if (users.length === 0) {
        return null
    }
    const user = users[0];
    return user
}