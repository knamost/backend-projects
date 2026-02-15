import jwt from 'jsonwebtoken';

export const attachUser = async (req, res, next) => {
    // Header Authorization : Bearer <TOKEN>
    const tokenHeader = req.headers['authorization'];

    if (!tokenHeader) return next();

    if (!tokenHeader.startsWith('Bearer')) return res.status(400).json({error: 'authorization headers must starts with Bearer'})

    const token = tokenHeader.split(' ')[1];

    try {
        //  decoding token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        // if token is invalid/expired
    }

    next();
};


export const isAuthenticated = (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'You are not logged in' });
    next();
};
