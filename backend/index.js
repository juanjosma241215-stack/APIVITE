import 'dotenv/config';
import app from './src/app.js';
import { connectDB } from './src/config/db.js';

// Puerto del servidor, con fallback local por si no existe variable de entorno.
const PORT = process.env.PORT || 4000;

// Arranca primero la base de datos y luego el servidor HTTP.
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Backend ejecutandose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('No fue posible iniciar el backend:', error.message);
    process.exit(1);
  }
};

startServer();
