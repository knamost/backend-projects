import db from '../db/index.js';
import { usersTable, userSession } from '../db/schema.js';
import { eq } from 'drizzle-orm';


export const attachUser = async (req, res, next) => {
    const sessionId = req.headers['session-id'];

    if (!sessionId) return next();

    const [session] = await db
    .select({
        sessionId: userSession.id,
        id: usersTable.id,
        userId: userSession.userId,
        name: usersTable.name,
        email: usersTable.email,
    })
    .from(userSession)
    .rightJoin(usersTable, eq(usersTable.id, userSession.userId))
    .where(eq(userSession.id, sessionId));

    if (!session) return next();

    req.user = session;
    next();
};


export const isAuthenticated = (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'You are not logged in' });
    next();
};

// In login controller, before inserting new session:
// await db.delete(userSession).where(eq(userSession.userId, user.id));
