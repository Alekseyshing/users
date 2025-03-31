require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5001,
  nodeEnv: process.env.NODE_ENV || 'development',
  dbPath: process.env.DB_PATH || './database.sqlite',
  jwtSecret: process.env.JWT_SECRET || '8f7d3b2a1e6c5f4d9e2a1b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3',
  apiUrl: process.env.API_URL || 'https://userss.vercel.app',
  corsOrigin: process.env.CORS_ORIGIN || 'https://userss.vercel.app'
}; 