import type { RequestHandler, text } from '@sveltejs/kit';

export const POST: RequestHandler = async (req) => {
    const { file, password } = req.body;

    const algorithm = 'aes-256-ctr';
    const iv = crypto.randomBytes(16);
    const salt = crypto.randomBytes(64);
    const iterations = 100000;
    const keyLength = 32;
    const key = crypto.pbkdf2Sync(password, salt, iterations, keyLength, 'sha512');
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encryptedFile = Buffer.concat([cipher.update(file), cipher.final()]);

    return text(encryptedFile);
}