import mongoose from 'mongoose';

// Modelo base para usuarios del proyecto, preparado para la coleccion "usuarios".
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
    }
  },
  {
    timestamps: true,
    collection: 'usuarios'
  }
);

const User = mongoose.model('User', userSchema);

export default User;
