const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { signToken } = require('./authController');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Verify Google token
exports.verifyGoogleToken = catchAsync(async (req, res, next) => {
  const { token } = req.body;

  if (!token) {
    return next(new AppError('Google token is required', 400));
  }

  try {
    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, given_name, family_name, picture, sub } = payload;

    if (!email) {
      return next(new AppError('Google authentication failed: No email provided', 400));
    }

    // Check if user already exists
    let user = await User.findOne({ 
      $or: [
        { email: email.toLowerCase() },
        { googleId: sub }
      ]
    });

    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        firstName: given_name || 'User',
        lastName: family_name || 'Google',
        email: email.toLowerCase(),
        googleId: sub,
        avatar: picture,
        isGoogleAuth: true,
        // Generate a random password for Google users (won't be used for login)
        password: crypto.randomBytes(16).toString('hex') + process.env.JWT_SECRET,
        passwordConfirm: crypto.randomBytes(16).toString('hex') + process.env.JWT_SECRET,
      });
    } else if (!user.isGoogleAuth) {
      // User exists but wasn't created via Google auth - update their record
      user.googleId = sub;
      user.avatar = picture;
      user.isGoogleAuth = true;
      await user.save({ validateBeforeSave: false });
    }

    // Generate JWT token
    const jwtToken = signToken(user._id);

    // Remove sensitive data
    user.password = undefined;
    user.passwordConfirm = undefined;

    res.status(200).json({
      status: 'success',
      token: jwtToken,
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          isGoogleAuth: user.isGoogleAuth
        },
      },
    });
  } catch (error) {
    console.error('Google authentication error:', error);
    
    if (error.message.includes('Invalid token')) {
      return next(new AppError('Invalid Google token', 401));
    }
    
    return next(new AppError('Google authentication failed. Please try again.', 500));
  }
});