const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config/keys');
const User = require('../models/User');

module.exports =  async (req,res,next) => {
    const {authorization} = req.headers;

    if (!authorization) {
        return res.status(422).json({error: "Authenticate user"});
    }

    jwt.verify(authorization, JWT_SECRET, (err, payload) => {
        if (err) {
            return res.status(401).json({error: "Authenticate user"});
        }
        const {_id} = payload;
        User.findById(_id).select("-password").then((userdata) => {
            req.user = userdata;
            next();
        });
    });

}