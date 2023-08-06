import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default ({ mode }: { mode: 'production' | 'development' }) => {
  return defineConfig({
    plugins: [react()],

    // [NOTE] !important for development purpose
    // for `it has the "SameSite=None" attribute but is missing the "secure" attribute.` error from chrome
    // we need to use ssl in dev server
    server:
      mode === 'development'
        ? {
            https: {
              key: './ssl/minshuku-privateKey.key',
              cert: './ssl/minshuku.crt',
            },
          }
        : undefined,
  });
};
