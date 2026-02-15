import jwt from 'jsonwebtoken';

export const attachUser = (req, res, next) => {
    // Header Authorization : Bearer <TOKEN>
    const tokenHeader = req.headers['authorization'];

    if (!tokenHeader) return next();

    if (!tokenHeader.startsWith('Bearer ')) return res.status(400).json({error: 'Authorization header must start with Bearer'})

    const token = tokenHeader.split(' ')[1];

    if (!token) return next();

    try {
        //  decoding token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        // if token is invalid/expired
    }

    next();
};

    //  ensures that you have to be logged in.
export const requireAuth = (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'You are not logged in' });
    next();
};


export const restrictRole = function(role) {
    return function(req, res, next) {
        if (req.user.role !== role) return res.status(403).json({error: 'Access denied. Insufficient permissions.'});

        return next();
    }
}