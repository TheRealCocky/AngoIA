const jwt = require('jsonwebtoken');


const authMiddleware= (res,req, next)=>{
    const authHeader= req.headers.authorization;
// Verifica se o header existe e começa com "Bearer "
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        res.status(401).json({message:'Token não fornecido ou inválido'})
    }

    const token = authHeader.split(' ')[1];
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch (error){
        res.status(500).json({message:'Token inválido ou expirado'})
    }
}

module.exports = authMiddleware;