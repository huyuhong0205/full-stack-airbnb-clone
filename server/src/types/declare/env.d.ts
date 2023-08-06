declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';

      DB: string;
      DB_PASS: string;

      PORT: number; // 3000

      JWT_SECRET: string;
      JWT_EXPIRES: string;
      JWT_COOKIE_EXPIRES: number;

      GOOGLE_API_KEY: string;
    }
  }
}

export {}; // required
