import db from '../db/index.js'
import { usersTable } from '../db/schema.js'

export const getAllUsers = async (req, res) => {
    try {
        // if (!req.user) return res.status(401).json({error: "your must be authenitcated"})

        const users = await db
        .select({
            id: usersTable.id,
            name: usersTable.name,
            email: usersTable.email,
        })
        .from(usersTable);

        return res.json({ users });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to fetch users' });
    }
};