import User from '../models/User.js';
import { hashPassword, verifyPassword } from '../utils/password.js';

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name || user.nombre_usuario || 'Usuario',
  email: user.email
});

// Crea un nuevo usuario si el correo aun no esta registrado.
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({ message: 'Nombre, correo y contrasena son obligatorios.' });
    }

    if (password.trim().length < 8) {
      return res.status(400).json({ message: 'La contrasena debe tener al menos 8 caracteres.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.collection.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ message: 'Ese correo ya esta registrado.' });
    }

    const securePassword = await hashPassword(password.trim());

    const user = await User.create({
      name: name.trim(),
      nombre_usuario: name.trim(),
      email: normalizedEmail,
      password: securePassword,
      contrasena: securePassword,
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

// Valida credenciales y devuelve los datos publicos del usuario.
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

    // Compatibilidad con usuarios antiguos que guardaban la contrasena en texto plano.
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
