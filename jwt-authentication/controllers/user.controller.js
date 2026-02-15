import db from '../db/index.js';
import { usersTable } from '../db/schema.js';
import argon2 from 'argon2';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';


    //      creating new user/ account
export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password are required' });

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

        return res.status(201).json({status: "success", data: { user } });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Signup failed' });
    }
};

    //  login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
        
        const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email));

        if (!user) return res.status(401).json({error: 'Invalid credentials'});

        const isPasswordValid = await argon2.verify(user.password, password);
       
        if (!isPasswordValid) {
            return res.status(401).json({error: 'Invalid credentials'});
        }

        //  creating a payload for json web token
        const payload = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        };
        
        //  creating jwt token here
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

        return res.json({ status: 'Login successful', token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Login failed' });
    }
};


export const getCurrentUser = async (req, res) => {
    return res.json({ user: req.user });
};



    //      updating user details
export const updateUser = async (req, res) => {
    try {
        const { name, email, password, currentPassword } = req.body;

        if (!name && !email && !password) return res.status(400).json({ error: 'Nothing to update' });

        const update = {};
        if (name) update.name = name;
        if (email) update.email = email;

        if (password) {
            if (!currentPassword) return res.status(400).json({ error: 'Current password is required' });

            const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.user.id));
            const isValid = await argon2.verify(user.password, currentPassword);

            if (!isValid) return res.status(401).json({ error: 'Current password is incorrect' });

            update.password = await argon2.hash(password);
        }

        const [updatedUser] = await db.update(usersTable)
            .set(update)
            .where(eq(usersTable.id, req.user.id))
            .returning({ id: usersTable.id, name: usersTable.name, email: usersTable.email });

        return res.json({ status: 'success', user: updatedUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Update failed' });
    }
};
