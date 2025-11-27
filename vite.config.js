import { defineConfig } from 'vite';
import angular from 'vite-plugin-angular'; // Import the Angular plugin

export default defineConfig({
  plugins: [angular()], // Add the Angular plugin to the plugins array
  server: {
    port: 4200,
    allowedHosts: ['logaritmo', '.duckdns.org:4200'], // Optional: Configure the development server port
  },
  // Other Vite configuration options can be added here
});