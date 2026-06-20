const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    try {
        let token;
        if (
            req.headers.authorization && 

            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            req.user = await User.findById(
                decoded.id
            ).select("-password");

            if (req.user.isFrozen) {
                res.status(401);
                throw new Error("Account is frozen");
            }

            next();

        } else {
            res.status(401);
            throw new Error("Not authorized, no token");
        }

    } catch (error) {
        res.status(401);
        throw new Error("Not authorized, invalid token");
    }

};


module.exports = protect;