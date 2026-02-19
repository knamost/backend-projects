import express from 'express';
import { signupPostRequestBodySchema, loginPostRequestBodySchema } from '../validation/request.validation.js';
import { verifyPassword, hashPassword } from '../utils/hash.js';
import { createToken } from '../utils/token.js';
import { getUserByEmail, createUser } from '../services/user.service.js';

const router = express.Router();


// POST /user/signup — register a new user
router.post('/signup', async (req, res) => {
    const validationResult = await signupPostRequestBodySchema.safeParseAsync(req.body);
    if (validationResult.error) return res.status(400).json({ error: validationResult.error.issues });

    const { firstname, lastname, email, password } = validationResult.data;

    const existingUser = await getUserByEmail(email);
    if (existingUser) return res.status(400).json({ error: `Email: ${email} already exists.` });

    const hashedPassword = await hashPassword(password);
    const user = await createUser({ firstname, lastname, email, password: hashedPassword });

    return res.status(201).json({ data: { userID: user.id } });
});


// POST /user/login — authenticate and receive a JWT
router.post('/login', async (req, res) => {
    const validationResult = await loginPostRequestBodySchema.safeParseAsync(req.body);
    if (validationResult.error) return res.status(400).json({ error: validationResult.error.issues });

    const { email, password } = validationResult.data;

    const user = await getUserByEmail(email);
    if (!user) return res.status(400).json({ error: `User with email: ${email} does not exist` });

    const isPasswordValid = await verifyPassword(user.password, password);
    if (!isPasswordValid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = await createToken({ id: user.id });

    return res.json({ token });
});


export default router;
