import { encryptData } from '@/crypto.js';
import clientPromise from '../../mongo.js';

export default async function GET(req, res) {
    res.setHeader('Set-Cookie', ``);
    res.status(200).json({});

}