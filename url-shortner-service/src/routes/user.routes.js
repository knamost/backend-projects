
import express from 'express';

import db from '../db/index.js'
import { usersTable } from '../models/index.js';
import { eq } from 'drizzle-orm';
import argon2 from 'argon2';
import { signupPostRequestBodySchema } from '../validation/request.validation.js'


const router = express.Router();

//? signup
router.post('/signup', async(req, res) => {
    const valildationResult = await signupPostRequestBodySchema.safeParseAsync(req.body)

    if (valildationResult.error) {
        return res.status(400).json({ error: valildationResult.error.issues});
    }

    const { firstname, lastname, email, password} = valildationResult.data


    const [existingUser] = await db
    .select({
        id: usersTable.id,
    })
    .from(usersTable)
    .where(eq(usersTable.email, email));

    
    if(existingUser) return res.status(400).json({error: `Email: ${email} already exists.`});

    const hashedPassword = await argon2.hash(password);


    const [user] = await db.insert(usersTable).values({
        firstname,
        lastname,
        email,
        password: hashedPassword,
    }).returning({ id: usersTable.id })

    return res.status(201).json({ data: { userID: user.id }});
});


export default router;
