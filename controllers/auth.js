const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const User = require('../models/user');

//  @desc   Register user
//  @route  Post /api/v1/auth/register
//  @access Public

exports.register = asyncHandler(async (req, res, next) => {
   const { name, email, password, role } = req.body;

   //create user
    const user = await User.create({
        name,
        email,
        password,
        role
    })

    sendTokenResponse(user, 200, res);
});

//  @desc   Login user
//  @route  Post /api/v1/auth/Login
//  @Public

exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    //validate email & password
    if(!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400 ));
    }

    //check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        return next(new ErrorResponse('Invalid credentials, 400'));
    }

    // check  if password matches
    const isMatch = await user.matchPassword(password);

    if(!isMatch) {
        return next(new ErrorResponse('Invalid Credentials', 401));
    }

    sendTokenResponse(user, 200, res);
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    //create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        });
};
