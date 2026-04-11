import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import taskRoutes from './routes/taskRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { errorHandler, notFound } from './middlewares/errorMiddleware.js';

const app = express();

// --- CONFIGURACIÓN DE CORS TOTAL ---
const allowedOrigins = [
  'https://apivite-nu.vercel.app', // Tu dominio principal
  'http://localhost:5173'          // Tu local para pruebas
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Si el origen es local, está en la lista o es CUALQUIER subdominio de vercel.app
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        callback(new Error('No permitido por CORS para el origen: ' + origin));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(morgan('dev'));
app.use(express.json());

// Ruta de prueba para verificar que el backend está vivo
app.get('/', (_req, res) => {
  res.json({
    message: 'API de Apivite funcionando correctamente',
    status: 'ok',
    database: 'Connected (MongoDB Atlas)',
    author: 'Juan José'
  });
});

// Rutas de la API
app.use('/api/tasks', taskRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/auth', authRoutes);

// Manejo de errores
app.use(notFound);
app.use(errorHandler);

export default app;