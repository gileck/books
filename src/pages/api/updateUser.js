
import { getDB } from './db.js';
import { getUser } from './userApi.js';


export default async function handler(req, res) {
    const user = await getUser(req);
    const db = await getDB();
    const { profilePic, name, email } = req.body
    const result = await db.collection('users').updateOne({
        username: user.username
    }, {
        $set: {
            profilePic,
            name,
            email
        }
    })


    res.status(200).json({ result });
}