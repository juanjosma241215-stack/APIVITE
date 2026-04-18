import User from '../models/User.js';
import { hashPassword, verifyPassword } from '../utils/password.js';

const DEFAULT_BUDGET = 1200000;

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name || user.nombre_usuario || 'Usuario',
  email: user.email,
  monthlyBudget: Number(user.monthlyBudget || DEFAULT_BUDGET),
  budgetAlertThreshold: Number(user.budgetAlertThreshold || 100)
});

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, monthlyBudget } = req.body;

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({ message: 'Nombre, correo y contrasena son obligatorios.' });
    }

    if (password.trim().length < 8) {
      return res.status(400).json({ message: 'La contrasena debe tener al menos 8 caracteres.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.collection.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ message: 'Ese correo ya esta registrado. Inicia sesion.' });
    }

    const securePassword = await hashPassword(password.trim());
    const parsedBudget = Number(monthlyBudget);

    const user = await User.create({
      name: name.trim(),
      nombre_usuario: name.trim(),
      email: normalizedEmail,
      password: securePassword,
      contrasena: securePassword,
      monthlyBudget: Number.isFinite(parsedBudget) && parsedBudget >= 0 ? parsedBudget : DEFAULT_BUDGET,
      budgetAlertThreshold: 100,
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
      return res.status(400).json({ message: 'Correo y contrasena son obligatorios.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.collection.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ message: 'Correo o contrasena incorrectos.' });
    }

    const plainPassword = password.trim();
    const storedPassword = user.password || user.contrasena || '';
    let isPasswordValid = await verifyPassword(plainPassword, storedPassword);

    if (!isPasswordValid && storedPassword && storedPassword === plainPassword) {
      isPasswordValid = true;

      const migratedPassword = await hashPassword(plainPassword);
      await User.updateOne(
        { _id: user._id },
        {
          $set: {
            name: user.name || user.nombre_usuario || 'Usuario',
            nombre_usuario: user.nombre_usuario || user.name || 'Usuario',
            password: migratedPassword,
            contrasena: migratedPassword
          }
        }
      );

      user.name = user.name || user.nombre_usuario || 'Usuario';
      user.nombre_usuario = user.nombre_usuario || user.name || 'Usuario';
      user.password = migratedPassword;
      user.contrasena = migratedPassword;
    }

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Correo o contrasena incorrectos.' });
    }

    return res.json({
      message: 'Sesion iniciada correctamente.',
      user: sanitizeUser(user)
    });
  } catch (error) {
    return next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    return res.json({ user: sanitizeUser(user) });
  } catch (error) {
    return next(error);
  }
};

export const updateBudget = async (req, res, next) => {
  try {
    const { userId, monthlyBudget, budgetAlertThreshold } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'Usuario no identificado.' });
    }

    const parsedBudget = Number(monthlyBudget);
    const parsedThreshold = Number(budgetAlertThreshold);

    if (!Number.isFinite(parsedBudget) || parsedBudget < 0) {
      return res.status(400).json({ message: 'El presupuesto debe ser un numero valido.' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        monthlyBudget: parsedBudget,
        budgetAlertThreshold:
          Number.isFinite(parsedThreshold) && parsedThreshold > 0 ? parsedThreshold : 100
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    return res.json({
      message: 'Presupuesto actualizado correctamente.',
      user: sanitizeUser(user)
    });
  } catch (error) {
    return next(error);
  }
};
