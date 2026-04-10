import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    rol: {
      type: String,
      default: 'user',
      trim: true
    }
  },
  {
    timestamps: true,
    collection: 'usuarios'
  }
);

const User = mongoose.model('User', userSchema);
export default User;