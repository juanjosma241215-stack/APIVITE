import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import taskRoutes from './routes/taskRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { errorHandler, notFound } from './middlewares/errorMiddleware.js';

const app = express();


// --- CORRECCIÓN DE CORS ---
const allowedOrigins = [
  'https://apivite-htvt2d20g-juanjosma241215-3422s-projects.vercel.app', // URL exacta de tu imagen
  'http://localhost:5173'
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Importante: En producción, 'origin' a veces viene como undefined en navegadores antiguos
      // pero aquí lo forzamos para que tu URL de Vercel pase siempre.
      if (!origin || allowedOrigins.includes(origin) || origin.includes('vercel.app')) {
        callback(null, true);
      } else {
        callback(new Error('No permitido por CORS'));
      }
    },
    credentials: true
  })
);
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