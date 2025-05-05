const jwt = require('jsonwebtoken');


const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    console.log('Authorization header:', authHeader);
    console.log('Token extraído:', token);
    console.log('JWT_SECRET:', process.env.JWT_SECRET);

    if (!token) {
        return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Erro ao verificar token:', error);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expirado.' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(400).json({ message: 'Token inválido.' });
        }
        res.status(500).json({ message: 'Erro ao verificar o token.' });
    }
};

module.exports = { protect };
