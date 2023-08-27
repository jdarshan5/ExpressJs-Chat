import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

export interface UserDocument extends mongoose.Document {
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  fcmToken: String | null,
  created_at: Date,
  generateJWT(): string,
  comparePassword(password: String): boolean,
}

const UserSchema: Schema = new Schema<UserDocument>({
  email: {
    type: String,
    immutable: true,
    unique: true,
  },
  password: {
    type: String,
  },
  firstName: String,
  lastName: String,
  fcmToken: {
    type: String || null,
    default: null,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return err;
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (password: string | Buffer): boolean {
  return bcrypt.compareSync(password, this.password);
}

UserSchema.methods.generateJWT = function () {
  let payload = {
    id: this._id,
    email: this.email,
    create_at: this.created_at,
  };
  return jwt.sign(payload, process.env.JWT_SECRET);
}

export default mongoose.model<UserDocument>('Users', UserSchema);