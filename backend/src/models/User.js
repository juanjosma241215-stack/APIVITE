import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true
    },
    nombre_usuario: {
      type: String,
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
      type: String
    },
    contrasena: {
      type: String
    },
    rol: {
      type: String,
      default: 'user',
      trim: true
    },
    monthlyBudget: {
      type: Number,
      default: 1200000,
      min: 0
    },
    budgetAlertThreshold: {
      type: Number,
      default: 100,
      min: 1,
      max: 300
    }
  },
  {
    timestamps: true,
    collection: 'usuarios'
  }
);

const User = mongoose.model('User', userSchema);

export default User;
