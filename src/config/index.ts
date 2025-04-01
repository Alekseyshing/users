import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const config = {
  nodeEnv: process.env.NODE_ENV || 'production',
  port: Number(process.env.PORT) || 5001,
  corsOrigin: process.env.CORS_ORIGIN || 'https://usersfront.vercel.app',
  apiUrl: process.env.API_URL || 'https://userss.vercel.app',
  database: {
    url: process.env.DATABASE_URL,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    name: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_here',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
};

export default config; 