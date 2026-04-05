import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        gallery: resolve(__dirname, 'gallery.html'),
        cart: resolve(__dirname, 'cart.html'),
      },
    },
  },
});
