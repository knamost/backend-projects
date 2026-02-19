
import express from 'express';

import db from '../db/index.js'
import { usersTable } from '../models/index.js';
import { signupPostRequestBodySchema, loginPostRequestBodySchema } from '../validation/request.validation.js'
import { verifyPassword, hashPassword } from '../utils/hash.js';
import { createToken } from '../utils/token.js'
import { GetUserByEmail } from '../services/user.service.js';

const router = express.Router();

//? signup
router.post('/signup', async(req, res) => {
    const valildationResult = await signupPostRequestBodySchema.safeParseAsync(req.body);
    if (valildationResult.error) return res.status(400).json({ error: valildationResult.error.issues});
    const { firstname, lastname, email, password} = valildationResult.data;

    const existingUser = await GetUserByEmail(email)
    if(existingUser) return res.status(400).json({error: `Email: ${email} already exists.`});

    const hashedPassword = await hashPassword(password);

    const user = await db.insert(usersTable).values({
        firstname,
        lastname,
        email,
        password: hashedPassword,
    }).returning({ id: usersTable.id })

    return res.status(201).json({ data: { userID: user.id }});
});



//? login
router.post('/login', async(req, res) => {
    const valildationResult = await loginPostRequestBodySchema.safeParseAsync(req.body);
    if(valildationResult.error) return res.status(400).json({error: valildationResult.error.issues});
    const { email, password } = valildationResult.data

    const user = await GetUserByEmail(email)
    if(!user) return res.status(400).json({error: `User with email: ${email} does not exists`});

    const isPasswordValid = await verifyPassword(user.password, password);
    if (!isPasswordValid) return res.status(401).json({error: 'Invalid credentials'});


    //? creating a jwt token
    const token = await createToken({ id: user.id})

    return res.json({ token });



});



export default router;
