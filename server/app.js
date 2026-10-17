import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.routes.js';
import taskRoutes from './routes/task.routes.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';
import { config } from './config/config.js';

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});

// Enable trust proxy for Render / reverse proxies (needed for rate-limiting and secure cookies)
app.set('trust proxy', 1);

// Middleware
const allowedOrigins = config.clientUrl
  ? config.clientUrl.split(',').map((url) => url.trim().replace(/\/$/, ''))
  : ['http://localhost:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps, curl, postman, health checks)
      if (!origin) return callback(null, true);
      const cleanOrigin = origin.replace(/\/$/, '');
      if (
        allowedOrigins.includes(cleanOrigin) ||
        allowedOrigins.includes('*') ||
        (config.nodeEnv !== 'development' && cleanOrigin.endsWith('.vercel.app')) ||
        cleanOrigin.includes('localhost')
      ) {
        return callback(null, true);
      }
      return callback(new Error(`CORS error: Origin ${origin} not allowed by Access-Control-Allow-Origin`));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'));
app.use('/api', limiter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running 🚀', timestamp: new Date() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
