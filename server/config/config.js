import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret_change_me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  jwtRememberMeExpiresIn: process.env.JWT_REMEMBER_ME_EXPIRES_IN || '30d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV || 'development',
};
