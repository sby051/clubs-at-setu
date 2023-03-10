import type { RequestHandler, text } from '@sveltejs/kit';

// decrypt
export const POST: RequestHandler = async ({ body }) => {
    const { blob, password } = JSON.parse(body);

    const algorithm = 'aes-256-ctr';
    const iv = crypto.randomBytes(16);
    const salt = crypto.randomBytes(64);
    const iterations = 100000;
    const keyLength = 32;
    const key = crypto.pbkdf2Sync(password, salt, iterations, keyLength, 'sha512');
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    const decryptedFile = Buffer.concat([decipher.update(blob), decipher.final()]);
    return text(decryptedFile);
}