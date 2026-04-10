import User from '../models/User.js';
import { hashPassword, verifyPassword } from '../utils/password.js';

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email
});

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({ message: 'Nombre, correo y contraseña son obligatorios.' });
    }

    if (password.trim().length < 8) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres.' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ message: 'Ese correo ya está registrado.' });
    }

    const securePassword = await hashPassword(password.trim());

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: securePassword,
      rol: 'user'
    });

    return res.status(201).json({
      message: 'Cuenta creada correctamente.',
      user: sanitizeUser(user)
    });
  } catch (error) {
    return next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({ message: 'Correo y contraseña son obligatorios.' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos.' });
    }

    const isPasswordValid = await verifyPassword(password.trim(), user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos.' });
    }

    return res.json({
      message: 'Sesión iniciada correctamente.',
      user: sanitizeUser(user)
    });
  } catch (error) {
    return next(error);
  }
};