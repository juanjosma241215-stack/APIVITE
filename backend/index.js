import 'dotenv/config';
import app from './src/app.js';
import { connectDB } from './src/config/db.js';

// Render asigna un puerto dinámico mediante la variable PORT
const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    // 1. Conectar a MongoDB Atlas
    await connectDB();
    console.log('✅ Conexión a MongoDB exitosa');

    // 2. Iniciar el servidor
    // Importante: Usamos 0.0.0.0 para que sea accesible externamente en Render
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor listo y escuchando en el puerto: ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error.message);
    process.exit(1);
  }
};

startServer();