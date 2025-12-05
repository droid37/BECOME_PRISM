#!/usr/bin/env node
/**
 * BECOME PRISM: Auto-UI Photographer
 * Automatically captures the extension popup UI and generates Web Store screenshots
 * 
 * Usage: npm run capture-ui
 * Dependencies: npm install puppeteer sharp
 */

import { execSync } from 'child_process';
import puppeteer from 'puppeteer';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = './dist';
const STORE_ASSETS_DIR = './store_assets';
const TEMP_SCREENSHOT = './temp_screenshot.png';
const OUTPUT_SCREENSHOT = path.join(STORE_ASSETS_DIR, 'screenshot-1280x800.png');
const BACKGROUND_COLOR = '#141e2d'; // Deep Navy

// Ensure directory exists
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✓ Created directory: ${dirPath}`);
  }
}

// Clean up temp files
function cleanup() {
  if (fs.existsSync(TEMP_SCREENSHOT)) {
    fs.unlinkSync(TEMP_SCREENSHOT);
    console.log('✓ Cleaned up temp files');
  }
}

// Find extension ID from browser targets
async function findExtensionId(browser) {
  const targets = browser.targets();
  
  for (const target of targets) {
    const url = target.url();
    if (url && url.startsWith('chrome-extension://')) {
      const match = url.match(/chrome-extension:\/\/([a-z]{32})/);
      if (match) {
        return match[1];
      }
    }
  }
  
  // Alternative: Check service worker targets
  const serviceWorkers = await browser.targets().filter(t => t.type() === 'service_worker');
  for (const sw of serviceWorkers) {
    const url = sw.url();
    if (url && url.startsWith('chrome-extension://')) {
      const match = url.match(/chrome-extension:\/\/([a-z]{32})/);
      if (match) {
        return match[1];
      }
    }
  }
  
  throw new Error('Could not find extension ID. Make sure the extension is loaded.');
}

async function main() {
  console.log('='.repeat(60));
  console.log('BECOME PRISM: Auto-UI Photographer');
  console.log('='.repeat(60));
  
  try {
    // Step 1: Build the extension
    console.log('\n[1/4] Building extension...');
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✓ Build complete');
    
    // Ensure directories exist
    ensureDir(STORE_ASSETS_DIR);
    
    // Step 2: Launch Chrome with extension
    console.log('\n[2/4] Launching Chrome with extension...');
    const browser = await puppeteer.launch({
      headless: false, // Need to see extension
      args: [
        `--disable-extensions-except=${path.resolve(DIST_DIR)}`,
        `--load-extension=${path.resolve(DIST_DIR)}`,
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ]
    });
    
    // Wait a bit for extension to load
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Step 3: Find extension ID
    console.log('\n[3/4] Finding extension ID...');
    const extensionId = await findExtensionId(browser);
    console.log(`✓ Extension ID: ${extensionId}`);
    
    // Step 4: Open extension popup
    const popupUrl = `chrome-extension://${extensionId}/index.html`;
    console.log(`✓ Opening: ${popupUrl}`);
    
    const page = await browser.newPage();
    await page.goto(popupUrl, { waitUntil: 'networkidle0', timeout: 10000 });
    
    // Wait for root element
    await page.waitForSelector('#root', { timeout: 5000 });
    
    // Additional wait for animations to settle
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Step 5: Capture screenshot
    console.log('\n[4/4] Capturing screenshot...');
    await page.setViewport({
      width: 340,
      height: 480,
      deviceScaleFactor: 2 // High resolution
    });
    
    await page.screenshot({
      path: TEMP_SCREENSHOT,
      type: 'png',
      clip: {
        x: 0,
        y: 0,
        width: 340,
        height: 480
      }
    });
    console.log(`✓ Screenshot captured: ${TEMP_SCREENSHOT}`);
    
    // Step 6: Process with Sharp
    console.log('\n[5/5] Processing screenshot...');
    
    // Create 1280x800 canvas with Deep Navy background
    const canvas = sharp({
      create: {
        width: 1280,
        height: 800,
        channels: 3,
        background: BACKGROUND_COLOR
      }
    });
    
    // Load the screenshot
    const screenshot = sharp(TEMP_SCREENSHOT);
    const screenshotMetadata = await screenshot.metadata();
    
    // Calculate center position
    const centerX = Math.floor((1280 - screenshotMetadata.width) / 2);
    const centerY = Math.floor((800 - screenshotMetadata.height) / 2);
    
    // Composite screenshot onto canvas
    await canvas
      .composite([
        {
          input: await screenshot.toBuffer(),
          left: centerX,
          top: centerY
        }
      ])
      .png()
      .toFile(OUTPUT_SCREENSHOT);
    
    console.log(`✓ Processed screenshot saved: ${OUTPUT_SCREENSHOT}`);
    
    // Cleanup
    cleanup();
    
    // Close browser
    await browser.close();
    
    console.log('\n' + '='.repeat(60));
    console.log('✓ Screenshot generation complete!');
    console.log(`✓ Output: ${OUTPUT_SCREENSHOT}`);
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    cleanup();
    process.exit(1);
  }
}

// Run if called directly
main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  cleanup();
  process.exit(1);
});

