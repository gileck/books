import { getDB } from '../../db.js';
import { isAdmin } from '../../userApi.js';
export default async function handler(req, res) {
    const db = await getDB();
    const admin = await isAdmin(req);
    if (!admin) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    const { username } = req.query;
    const result = await db.collection('users').deleteOne({
        username
    })
    res.status(200).json({
        result
    });
}