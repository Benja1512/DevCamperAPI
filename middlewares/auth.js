const jwt = require('jsonwebtoken');
const asyncHandler = ('./async');
const ErrorResponse = require('../urils/errorResponse');
const User = require('../models/User');

//protect rules
export.protect = asyncHandler(async(req, res, next) => {
    let token

    if(
        req.headers.authorization &&
        req.headers.authorization.startWith('Bearer'))
    {
    token = req.headers.authorization.split('')[1];

    }
   // else if (req.cockies.token){
    // token = req.cookies.token
    // }

    // make sure token exists
    if(!token) {
        return next(new ErrorResponse('Not authorize to access this route', 401));
    }
    try{
        //verify token
        const  decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log(decoded);
        req.user = await User.findById(decoded.id);

        next();
    } catch(err) {
        return next(new ErrorResponse('Not authorize to access this route', 401));
    }

});