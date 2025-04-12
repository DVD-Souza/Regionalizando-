const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expirado.' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(400).json({ message: 'Token inválido.' });
        }
        res.status(500).json({ message: 'Erro ao verificar o token.' });
    }
};
