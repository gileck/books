import { createHash, randomBytes, createCipheriv, createDecipheriv, scryptSync } from 'crypto';
const SECRET_KEY = 'your-secret-key'; // Replace with your actual secret key

// Function to encrypt data
const encryptData = (data) => {
    const key = scryptSync(SECRET_KEY, 'salt', 32); // Generate a key
    const iv = randomBytes(16); // Generate an initialization vector
    const cipher = createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
};

// Function to decrypt data
const decryptData = (encryptedData) => {
    const [ivHex, encryptedHex] = encryptedData.split(':');
    const key = scryptSync(SECRET_KEY, 'salt', 32);
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

function hash(data) {
    const hash = createHash('sha256');
    hash.update(data);
    return hash.digest('hex');
}



export { encryptData, decryptData, hash };