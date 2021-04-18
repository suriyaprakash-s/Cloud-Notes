const jwt = require('jsonwebtoken')

module.exports = function(req, res, next){
    const token = req.header('x-auth-token');

    if(!token){
        res.status(401).json({msg:'No token, authorization denied'});
    }

    try {
        const decode = jwt.decode(token, 'sampleSecretCode');
        req.user = decode.user;
        next();
    } catch (error) {
        res.status(401).json({msg:'Token is not valid'});
    }
};
