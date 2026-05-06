const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (val) {
          return /^\S+@\S+\.\S+$/.test(val);
        },
        message: 'Please provide a valid email',
      },
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    password: {
      type: String,
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    avatar: {
      type: String,
      default: null,
    },
    isGoogleAuth: {
      type: Boolean,
      default: false,
    },
    googleId: {
      type: String,
      sparse: true,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual field for password confirmation
userSchema
  .virtual('passwordConfirm')
  .get(function () {
    return this._passwordConfirm;
  })
  .set(function (val) {
    this._passwordConfirm = val;
  });

// Validate that password and confirm match before save (only for non-Google users)
userSchema.pre('validate', function (next) {
  if (this.isGoogleAuth) {
    // Skip password validation for Google users
    return next();
  }

  if (this.isModified('password')) {
    if (!this._passwordConfirm) {
      this.invalidate('passwordConfirm', 'Please confirm your password');
    }
    if (this.password !== this._passwordConfirm) {
      this.invalidate('passwordConfirm', 'Passwords do not match');
    }
  }
  next();
});

// Hash password if modified and user is not a Google user
userSchema.pre('save', async function (next) {
  if (this.isGoogleAuth || !this.isModified('password')) return next();

  const SALT_ROUNDS = 12;
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);

  // Clean up confirm (not persisted anyway)
  this._passwordConfirm = undefined;
  next();
});

// Instance method to check password correctness
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  if (this.isGoogleAuth) {
    return false; // Google users can't use password login
  }
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Instance method to check if password changed after token issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTime = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTime;
  }
  return false;
};

// Instance method to create password reset token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Expires in 10 minutes
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// Filter inactive users in queries
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('User', userSchema);