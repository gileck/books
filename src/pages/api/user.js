import { getUser } from './userApi.js';


export default async function handler(req, res) {
    const user = await getUser(req);
    res.status(200).json({ user });
}