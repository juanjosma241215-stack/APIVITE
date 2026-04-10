import mongoose from 'mongoose'; // ✅ Esta línea debe estar

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('La variable MONGODB_URI no esta definida');
  }

  mongoose.connection.on('connected', () => console.log('✅ Mongoose conectado'));
  mongoose.connection.on('error', (err) => console.error('❌ Error Mongoose:', err));
  mongoose.connection.on('disconnected', () => console.log('⚠️ Mongoose desconectado'));

  await mongoose.connect(mongoUri);
  console.log('Base de datos conectada');
};