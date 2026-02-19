import jwt from 'jsonwebtoken';
import { userTokenSchema } from '../validation/token.validation.js';

const JWT_SECRET = process.env.JWT_SECRET;

/** Create a signed JWT from a validated payload. */
export async function createToken(payload) {
    const validationResult = await userTokenSchema.safeParseAsync(payload);
    if (validationResult.error) throw new Error(validationResult.error);

    return jwt.sign(validationResult.data, JWT_SECRET);
}

/** Verify and decode a JWT. Returns the payload or null if invalid/expired. */
export function validateUserToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch {
        return null;
    }
}

