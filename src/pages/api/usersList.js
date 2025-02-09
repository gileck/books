import { getDB } from './db.js';
import { getUser } from './userApi.js';


export default async function handler(req, res) {
    // const user = await getUser(req);
    const db = await getDB();
    const users = await db.collection('users').find({}).toArray();

    res.status(200).json({
        users: users.map(user => ({
            name: user.name,
            username: user.username,
            profilePic: user.profilePic
        }))
    });
}