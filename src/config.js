const config = {
  port: process.env.PORT || 5001,
  corsOrigin: process.env.CORS_ORIGIN || 'https://usersfront.vercel.app',
  apiUrl: process.env.API_URL || 'https://usersfront.vercel.app'
};

export default config; 