declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      MONGODB_URI: string;
      NODE_ENV: 'development' | 'production' | 'test';
      JWT_SECRET: string;
      CORS_ORIGIN: string;
    }
  }
}

export {}; 