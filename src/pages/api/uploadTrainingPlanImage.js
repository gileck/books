// import { log } from 'console';
// import fs from 'fs';
// import path from 'path';


// export default async function handler(req, res) {
//     if (req.method !== 'POST') {
//         return res.status(405).json({ message: 'Method not allowed' });
//     }


//     const contentType = req.headers['content-type'];
//     const extension = contentType.split('/')[1]; // Extract the file extension from MIME type
//     const filename = `image-${Date.now()}.${extension}`; // Generate a unique filename
//     const image = req.body;


//     if (!image) {
//         return res.status(400).json({ message: 'No image provided' });
//     }

//     // Log the first few characters of the image data
//     console.log('Received image data:', image.substring(0, 30));

//     // Check if the image data is base64-encoded
//     const base64Pattern = /^data:image\/\w+;base64,/;
//     if (!base64Pattern.test(image)) {
//         return res.status(400).json({ message: 'Invalid image format' });
//     }

//     try {
//         // Remove the base64 header if present
//         const base64Data = image.replace(base64Pattern, '');
//         const imageBuffer = Buffer.from(base64Data, 'base64');

//         const imagePath = path.join(process.cwd(), 'public', 'uploads', filename);

//         // Ensure the directory exists
//         const dir = path.dirname(imagePath);
//         if (!fs.existsSync(dir)) {
//             fs.mkdirSync(dir, { recursive: true });
//         }

//         fs.writeFileSync(imagePath, imageBuffer);

//         const response = await sendToOpenAI(imageBuffer);

//         return res.status(200).json(response);
//     } catch (error) {
//         console.error('Error uploading image:', error);
//         return res.status(500).json({ message: 'Internal server error' });
//     }
// }