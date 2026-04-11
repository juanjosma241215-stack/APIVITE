import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import taskRoutes from './routes/taskRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { errorHandler, notFound } from './middlewares/errorMiddleware.js';

const app = express();

// --- CONFIGURACIÓN DE CORS PARA COMPATIBILIDAD TOTAL (iOS/Android/Web) ---
const allowedOrigins = [
  'https://apivite-nu.vercel.app',
  'https://apivite-git-main-juanjosma241215-3422s-projects.vercel.app',
  'http://localhost:5173'
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Permitimos si no hay origen (apps móviles/postman) o si está en la lista/subdominios vercel
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        callback(new Error('Bloqueado por CORS: ' + origin));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // OPTIONS es vital para iPhone
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  })
);

// Habilitar el manejo de peticiones OPTIONS (Preflight) explícitamente para Safari
app.options('*', cors());

app.use(morgan('dev'));
app.use(express.json());

// Ruta de prueba
app.get('/', (_req, res) => {
  res.json({
    message: 'API de Apivite optimizada para iOS y Android',
    status: 'ok',
    environment: process.env.NODE_ENV || 'production'
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