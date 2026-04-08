import mongoose from 'mongoose';

// Encapsula la conexión a MongoDB para reutilizarla desde el arranque del servidor.
export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('La variable MONGODB_URI no esta definida');
  }

  await mongoose.connect(mongoUri);
  console.log('Base de datos conectada');
};
