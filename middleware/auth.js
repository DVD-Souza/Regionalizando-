const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: 'Acesso negado. Token não fornecido ou mal formatado.' });
    }

    const token = authHeader.split(" ")[1];

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
