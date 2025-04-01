interface Config {
  port: number;
  corsOrigin: string;
  apiUrl: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 5001,
  corsOrigin: process.env.CORS_ORIGIN || 'https://usersfront.vercel.app',
  apiUrl: process.env.API_URL || 'https://userss.vercel.app'
};

export default config; 