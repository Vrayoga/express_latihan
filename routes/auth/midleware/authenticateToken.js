const jwt = require ('jsonwebtoken');
const secretKey = 'kunciRahasiaAman';
function authenticateToken(req,res,next) {
    const token = req.header('authorization');

    if (!token){
        return res.status(401).json({error: 'akses ditolak,tidak ada data'});
    }
    const tokenParts = token.split ('');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer'){
        return res.status(401).json({ error : 'format tidak valid'})
    }
    const tokenValue = tokenParts[1];

    jwt.verify(tokenValue, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error : 'token tidak valid'});

        }
        const {userId , username} = decoded;
        req.user = {userId, username};
        next();
    })
}

module.exports = authenticateToken;