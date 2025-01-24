import { defineConfig } from 'vite';
import * as path from 'node:path';

/// THIS FILE IS USED FOR EXAMPLE PURPOSES ONLY
export default defineConfig({
  resolve: {
    alias: {
      'intmax2-client-sdk': path.resolve(__dirname, '../../browser-sdk/dist'),
    },
  },
});
