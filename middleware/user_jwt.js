const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {

    const token = req.header('Authorization');

    if(!token) {
        return res.status(401).json({
            status: false,
            message: 'No token, authentication denied'
        });
    }

    try{
        await jwt.verify(token, process.env.jwtUserSecret, (err, decoded) => {
            if(err) {
                return res.status(401).json({
                    status: false,
                    message: 'Token not valid'
                });
            } else {
                req.user = decoded.user;
                next();
            }
        });
    } catch(err) {
        console.log('Something went wrong with the middleware' + err);
        res.status(500).json({
            status: false,
            message: 'Server error'
        })
    }
}