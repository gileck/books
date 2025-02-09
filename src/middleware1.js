// import clientPromise from './mongo.js';

// export async function middleware(req, ev) {
//     const client = await clientPromise;
//     const db = client.db();

//     req.dbClient = client;
//     req.db = db;

//     return NextResponse.next();
// }

// export const config = {
//     matcher: ['/api/:path*'], // Paths to apply the middleware
// };
