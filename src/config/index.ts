import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

interface Config {
  nodeEnv: string;
  port: number;
  corsOrigin: string;
  apiUrl: string;
  database: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    url: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
}

const config: Config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5001', 10),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  apiUrl: process.env.API_URL || 'http://localhost:5001',
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'users_db',
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/users_db'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  }
};

export default config; 