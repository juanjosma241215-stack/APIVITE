import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import taskRoutes from './routes/taskRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { errorHandler, notFound } from './middlewares/errorMiddleware.js';

// Configuración central de Express.
const app = express();

// Permitimos peticiones del frontend configurado en variables de entorno.
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173'
  })
);

// Log de peticiones y parser JSON para body requests.
app.use(morgan('dev'));
app.use(express.json());

// Ruta de prueba para verificar que la API está viva.
app.get('/', (_req, res) => {
  res.json({
    message: 'API de Apivite funcionando',
    status: 'ok'
  });
});

// Módulo CRUD de tareas.
app.use('/api/tasks', taskRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/auth', authRoutes);

// Middleware final para rutas inexistentes y errores del servidor.
app.use(notFound);
app.use(errorHandler);

export default app;
