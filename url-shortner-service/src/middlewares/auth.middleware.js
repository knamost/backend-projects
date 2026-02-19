

/** to get req,res,next suggestion
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */

import { validateUserToken } from "../utils/token.js";


export function authenticateMiddleware(req, res, next) {
    // Header Authorization : Bearer <TOKEN>
    const authHeader = req.headers['authorization'];
    if(!authHeader) return next();   // not a logged in user

    // checking 'Bearer' exists  or not in header
    if(!authHeader.startsWith('Bearer')) return res.status(400).json({ error: `Authorization Headers must starts with 'Bearer'` });


    const [_, token] = authHeader.split(' ');   // [Bearer, <TOKEN>]

    // getting payload from jwt( paylod: user data)
    const payload = validateUserToken(token);

    // creating a new property user on request
    req.user = payload;

    next();
};
