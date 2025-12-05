import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react';

import { crx, ManifestV3Export } from '@crxjs/vite-plugin';

import manifest from './src/manifest.json';

import fs from 'fs';

import path from 'path';

import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cast manifest to the correct type
const manifestTyped = manifest as ManifestV3Export;

// --- The Alchemist's Forge Plugin ---

function assetAutomator() {

  return {

    name: 'asset-automator-plugin',

    // This function runs after the bundle is generated

    closeBundle() {

      console.log('BECOME PRISM: Running Asset Automator...');

      

      const publicDir = path.resolve(__dirname, 'public');

      const distDir = path.resolve(__dirname, 'dist');

      const assetsDir = path.resolve(distDir, 'assets');



      // 1. Ensure the dist/assets directory exists

      if (!fs.existsSync(assetsDir)) {

        fs.mkdirSync(assetsDir, { recursive: true });

        console.log(' - Created dist/assets/ directory.');

      }



      // 2. Find and move the eye_logo.png

      const logoSource = path.resolve(publicDir, 'eye_logo.png');

      const logoDest = path.resolve(distDir, 'eye_logo.png');



      // Vite often copies it, but we ensure it

      if (fs.existsSync(logoSource) && !fs.existsSync(logoDest)) {

        fs.copyFileSync(logoSource, logoDest);

        console.log(' - Ensured eye_logo.png is in dist.');

      }



      // 3. Fix manifest.json to use fixed filenames (content.js, background.js)

      const manifestPath = path.resolve(distDir, 'manifest.json');

      if (fs.existsSync(manifestPath)) {

        const manifestContent = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

        

        // Find content script file and rename it

        if (manifestContent.content_scripts && manifestContent.content_scripts[0]?.js) {

          const contentScriptPath = manifestContent.content_scripts[0].js[0];

          const contentScriptFullPath = path.resolve(distDir, contentScriptPath);

          const contentJsPath = path.resolve(distDir, 'content.js');

          

          if (fs.existsSync(contentScriptFullPath) && contentScriptPath !== 'content.js') {

            fs.copyFileSync(contentScriptFullPath, contentJsPath);

            manifestContent.content_scripts[0].js[0] = 'content.js';

            console.log(' - Renamed content script to content.js');

          }

        }

        

        // Find background script file and rename it

        if (manifestContent.background?.service_worker) {

          const bgScriptPath = manifestContent.background.service_worker;

          const bgScriptFullPath = path.resolve(distDir, bgScriptPath);

          const bgJsPath = path.resolve(distDir, 'background.js');

          

          if (fs.existsSync(bgScriptFullPath) && bgScriptPath !== 'background.js') {

            fs.copyFileSync(bgScriptFullPath, bgJsPath);

            manifestContent.background.service_worker = 'background.js';

            console.log(' - Renamed background script to background.js');

          }

        }

        

        // Write updated manifest

        fs.writeFileSync(manifestPath, JSON.stringify(manifestContent, null, 2));

        console.log(' - Updated manifest.json with fixed filenames');

      }



      console.log('BECOME PRISM: Asset Automation Complete.');

    }

  }

}

// ------------------------------------



export default defineConfig({

  plugins: [

    react(),

    crx({ manifest: manifestTyped }),

    assetAutomator(), // Activate our new plugin

  ],

  build: {

    rollupOptions: {

      output: {

        // Ensure output filenames are simple and predictable

        // CRXJS will automatically map src/content/index.ts -> content.js

        // and src/background/index.ts -> background.js based on manifest.json

        entryFileNames: (chunkInfo) => {

          // Keep popup as-is, but ensure content and background use simple names

          if (chunkInfo.name === 'content' || chunkInfo.name === 'src/content/index') {

            return 'content.js';

          }

          if (chunkInfo.name === 'background' || chunkInfo.name === 'src/background/index') {

            return 'background.js';

          }

          // Default for popup and other entries

          return 'assets/[name]-[hash].js';

        },

        chunkFileNames: 'assets/[name]-[hash].js',

        assetFileNames: 'assets/[name]-[hash].[ext]',

      },

    },

  },

});
