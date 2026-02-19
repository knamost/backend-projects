import { validateUserToken } from "../utils/token.js";

/**
 * Parses the Authorization header and attaches the decoded user to `req.user`.
 * If no header is present, continues without attaching (guest user).
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export function authenticate(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return next();

    if (!authHeader.startsWith('Bearer')) {
        return res.status(400).json({ error: "Authorization header must start with 'Bearer'" });
    }

    const [, token] = authHeader.split(' ');
    const payload = validateUserToken(token);

    req.user = payload;
    next();
}

/**
 * Guard middleware — rejects the request if the user is not authenticated.
 * Must be used after `authenticate`.
 */
export function requireAuth(req, res, next) {
    if (!req.user?.id) return res.status(401).json({ error: 'Authentication required' });
    next();
}
