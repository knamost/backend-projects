import db from '../db/index.js';
import { usersTable, userSession } from '../db/schema.js';
import argon2 from 'argon2';
import { eq } from 'drizzle-orm';

export const signup = async (req, res) => {
    const { name, email, password } = req.body;

    const [existingUser] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

    if (existingUser) return res.status(409).json({ error: 'Email already exists' });

    const hashedPassword = await argon2.hash(password);

    const [user] = await db.insert(usersTable).values({
        name,
        email,
        password: hashedPassword,
    }).returning({ id: usersTable.id, name: usersTable.name, email: usersTable.email });

    return res.status(201).json({status: "success", data: {userId: user }});
};


export const login = async (req, res) => {
    const { email, password } = req.body;
    
    const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

    if (!user) return res.status(401).json({error: `Invalid credentials`});

    const isPasswordValid = await argon2.verify(user.password, password);
   
    if (!isPasswordValid) {
        return res.status(401).json({error: 'Invalid credentials'});
    }

    //  delete any existing sessions for this user
    await db.delete(userSession).where(eq(userSession.userId, user.id));

    //  creating session here
    const [session] = await db.insert(userSession).values({
        userId: user.id,
    }).returning({ id: userSession.id })

    return res.json({ status: "Login Successfully ", sessionId: session.id });
};


export const getCurrentUser = async (req, res) => {
    return res.json({ user: req.user });
};


export const updateUser = async (req, res) => {
    const { name, email, password, currentPassword } = req.body;

    if (!name && !email && !password) return res.status(400).json({ error: 'Nothing to update' });

    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;

    if (password) {
        if (!currentPassword) return res.status(400).json({ error: 'Current password is required' });

        const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.user.id));
        const isValid = await argon2.verify(user.password, currentPassword);

        if (!isValid) return res.status(401).json({ error: 'Current password is incorrect' });

        updates.password = await argon2.hash(password);
    }

    const [updatedUser] = await db.update(usersTable)
        .set(updates)
        .where(eq(usersTable.id, req.user.id))
        .returning({ id: usersTable.id, name: usersTable.name, email: usersTable.email });

    return res.json({ status: 'success', user: updatedUser });
};
