declare module '../config' {
  const config: {
    port: number;
    nodeEnv: string;
    dbPath: string;
    jwtSecret: string;
    apiUrl: string;
    corsOrigin: string;
  };
  export default config;
} 