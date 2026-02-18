import jwt from 'jsonwebtoken';
import { userTokenSchema } from '../validation/token.validation.js';

const JWT_SECRET = process.env.JWT_SECRET;


export async function createToken(payload){
    const valildationResult = await userTokenSchema.safeParseAsync(payload);
    if (valildationResult.error) throw new Error(valildationResult.error);

    const payloadValidatedData = valildationResult.data

    const token = jwt.sign(payloadValidatedData, JWT_SECRET);
    return token;
}