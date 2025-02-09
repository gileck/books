import clientPromise from '../../mongo.js';


export default async function handler(req, res) {
    const client = await clientPromise;
    const db = client.db();
    const username = req.query.username;
    const users = await db.collection('users').find({ username }).toArray();
    if (users.length === 0) {
        return null
    }
    const user = users[0];
    res.status(200).json({
        user: {
            name: user.name,
            username: user.username,
            profilePic: user.profilePic
        }
    });
}