import clientPromise from '../../mongo.js';

export async function getDB() {
    const client = await clientPromise;
    // client.db().collection('activity').deleteMany({})
    return client.db();
}