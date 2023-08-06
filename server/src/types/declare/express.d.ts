declare namespace Express {
  interface Request {
    user?: {
      id: string;
      role: 'user' | 'host' | 'admin';
    };
  }
}

// don't export there
