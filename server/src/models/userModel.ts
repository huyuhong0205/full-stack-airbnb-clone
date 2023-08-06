// MongoDB
import mongoose, { Document, Model, Schema } from 'mongoose';
// Encrypt password
import bcrypt from 'bcryptjs';

/* eslint-disable @typescript-eslint/ban-types -- for mongodb schema type */

///////////////////////////////////////////////////////////////////
// Schema
///////////////////////////////////////////////////////////////////

interface iUser extends Document, iUserMethods {
  name: string;
  email: string;
  password: string;
  passwordChangeAt: Date;
  photo: string;
  role: 'user' | 'host' | 'admin';
  activity: boolean;
}

interface iUserMethods {
  correctPassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;

  changePasswordAfter(JWTTimestamp: number): boolean;
}

type tUserModel = Model<iUser, {}, iUserMethods>;

const userSchema = new Schema<iUser, tUserModel, iUserMethods>({
  name: {
    type: String,
    required: true,
    maxlength: 30,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, // turn user email to lowercase, NOT a validator
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 12,
    select: false, // default cannot be query
  },

  passwordChangeAt: {
    type: Date,
  },

  photo: {
    type: String,
    default: 'default-profile-photo.png',
  },

  role: {
    type: String,
    enum: {
      values: ['user', 'host', 'admin'],
    },
    default: 'user',
  },

  activity: {
    type: Boolean,
    default: true,
  },
});

///////////////////////////////////////////////////////////////////
// Instance method
///////////////////////////////////////////////////////////////////

// Compare user entered password and user password in DB
userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
): Promise<boolean> {
  const result = await bcrypt.compare(candidatePassword, userPassword);
  return result;
};

// Check if user changed password after the JWT token was issued
userSchema.methods.changePasswordAfter = function (
  JWTTimestamp: number
): boolean {
  // (1) check if user has changed his or her password
  if (!this.passwordChangeAt) return false;

  // (2) get change password timestamp from DB, `this` point to current document
  const changeTimestamp = (this.passwordChangeAt as Date).getTime();

  // (3) return
  return JWTTimestamp * 1000 < changeTimestamp; // JWTTimestamp(s), changeTimestamp(ms)
};

///////////////////////////////////////////////////////////////////
// Document middleware
///////////////////////////////////////////////////////////////////

// ENCRYPT PASSWORD (before document `save`)
userSchema.pre('save', async function (next) {
  // (1) check if password has changed, if not go next
  if (!this.isModified('password')) return next();

  // (2) hash password with cost 12
  this.password = await bcrypt.hash(this.password, 12); // this point current document

  // (3) go next
  return next();
});

// UPDATE passwordChangeAt field
userSchema.pre('save', async function (next) {
  // (1) check password has changed and not a new user, if not go next
  if (!this.isModified('password') || this.isNew) return next();

  // (2) set passwordChangeAt field on current document
  this.passwordChangeAt = new Date(Date.now() - 2000); // minus 2s to ensure that token is always created after the password change

  // (3) go next
  return next();
});

// Export model
const User = mongoose.model<iUser, tUserModel>('User', userSchema);

export default User;
