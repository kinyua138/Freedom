#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Netlify Deployment Script');
console.log('============================\n');

// Configuration
const PROJECT_DIR = 'project';
const BUILD_DIR = 'dist';
const NETLIFY_CONFIG = 'netlify.toml';

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkPrerequisites() {
  log('📋 Checking prerequisites...', 'blue');
  
  // Check if project directory exists
  if (!fs.existsSync(PROJECT_DIR)) {
    log('❌ Project directory not found!', 'red');
    process.exit(1);
  }
  
  // Check if netlify.toml exists
  if (!fs.existsSync(NETLIFY_CONFIG)) {
    log('❌ netlify.toml not found in root directory!', 'red');
    process.exit(1);
  }
  
  // Check if package.json exists
  const packageJsonPath = path.join(PROJECT_DIR, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    log('❌ package.json not found in project directory!', 'red');
    process.exit(1);
  }
  
  log('✅ All prerequisites met', 'green');
}

function runBuild() {
  log('\n🔨 Building project...', 'blue');
  
  try {
    process.chdir(PROJECT_DIR);
    
    // Install dependencies if node_modules doesn't exist
    if (!fs.existsSync('node_modules')) {
      log('📦 Installing dependencies...', 'yellow');
      execSync('npm install', { stdio: 'inherit' });
    }
    
    // Run build
    log('🏗️ Running build command...', 'yellow');
    execSync('npm run build', { stdio: 'inherit' });
    
    // Check if build output exists
    if (!fs.existsSync(BUILD_DIR)) {
      log('❌ Build failed - dist directory not created!', 'red');
      process.exit(1);
    }
    
    log('✅ Build completed successfully', 'green');
    
    // Go back to root directory
    process.chdir('..');
    
  } catch (error) {
    log('❌ Build failed!', 'red');
    console.error(error.message);
    process.exit(1);
  }
}

function checkNetlifyCLI() {
  log('\n🔧 Checking Netlify CLI...', 'blue');
  
  try {
    execSync('netlify --version', { stdio: 'pipe' });
    log('✅ Netlify CLI is installed', 'green');
    return true;
  } catch (error) {
    log('⚠️ Netlify CLI not found', 'yellow');
    log('Install it with: npm install -g netlify-cli', 'yellow');
    return false;
  }
}

function deployToNetlify() {
  const hasNetlifyCLI = checkNetlifyCLI();
  
  if (!hasNetlifyCLI) {
    log('\n📋 Manual Deployment Instructions:', 'blue');
    log('1. Install Netlify CLI: npm install -g netlify-cli', 'yellow');
    log('2. Login to Netlify: netlify login', 'yellow');
    log('3. Deploy: netlify deploy --prod --dir=project/dist', 'yellow');
    log('\nOr upload the project/dist folder manually at netlify.com', 'yellow');
    return;
  }
  
  try {
    log('\n🚀 Deploying to Netlify...', 'blue');
    
    // Check if user is logged in
    try {
      execSync('netlify status', { stdio: 'pipe' });
    } catch (error) {
      log('🔐 Please login to Netlify first:', 'yellow');
      execSync('netlify login', { stdio: 'inherit' });
    }
    
    // Deploy
    log('📤 Uploading to Netlify...', 'yellow');
    execSync(`netlify deploy --prod --dir=${PROJECT_DIR}/${BUILD_DIR}`, { stdio: 'inherit' });
    
    log('✅ Deployment completed successfully!', 'green');
    
  } catch (error) {
    log('❌ Deployment failed!', 'red');
    console.error(error.message);
    log('\n📋 Alternative deployment methods:', 'blue');
    log('1. Git-based: Push to repository and connect at netlify.com', 'yellow');
    log('2. Manual: Upload project/dist folder at netlify.com', 'yellow');
  }
}

function showSummary() {
  log('\n📊 Deployment Summary:', 'blue');
  log('• Base directory: project', 'reset');
  log('• Build command: npm run build', 'reset');
  log('• Publish directory: dist', 'reset');
  log('• Configuration: netlify.toml', 'reset');
  
  log('\n🔗 Useful Links:', 'blue');
  log('• Netlify Dashboard: https://app.netlify.com/', 'reset');
  log('• Documentation: https://docs.netlify.com/', 'reset');
  log('• Support: https://community.netlify.com/', 'reset');
}

// Main execution
function main() {
  try {
    checkPrerequisites();
    runBuild();
    deployToNetlify();
    showSummary();
    
    log('\n🎉 Deployment process completed!', 'bold');
    
  } catch (error) {
    log('\n💥 Deployment process failed!', 'red');
    console.error(error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { main, checkPrerequisites, runBuild, deployToNetlify };
