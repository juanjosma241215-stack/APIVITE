import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import taskRoutes from './routes/taskRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { errorHandler, notFound } from './middlewares/errorMiddleware.js';

const app = express();

// --- CORRECCIÓN DE CORS PARA PRODUCCIÓN ---
// Permitimos múltiples orígenes o usamos una función para validar
const allowedOrigins = [
  process.env.FRONTEND_URL, // Tu futura URL de Vercel
  'http://localhost:5173'   // Para que sigas pudiendo probar en local
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Si no hay origen (como peticiones de Postman) o está en la lista permitida
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('No permitido por CORS'));
      }
    },
    credentials: true
  })
);
// ------------------------------------------

app.use(morgan('dev'));
app.use(express.json());

// Ruta de prueba
app.get('/', (_req, res) => {
  res.json({
    message: 'API de Apivite funcionando',
    status: 'ok',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rutas
app.use('/api/tasks', taskRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/auth', authRoutes);

// Manejo de errores
app.use(notFound);
app.use(errorHandler);

export default app;