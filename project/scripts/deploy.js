#!/usr/bin/env node

/**
 * Netlify Deployment Script
 * 
 * This script helps with building and deploying to Netlify
 * Usage: npm run deploy or node scripts/deploy.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, description) {
  log(`\n${description}...`, 'cyan');
  try {
    execSync(command, { stdio: 'inherit' });
    log(`✅ ${description} completed`, 'green');
  } catch (error) {
    log(`❌ ${description} failed`, 'red');
    process.exit(1);
  }
}

function checkPrerequisites() {
  log('🔍 Checking prerequisites...', 'blue');
  
  // Check if package.json exists
  if (!fs.existsSync('package.json')) {
    log('❌ package.json not found. Are you in the project root?', 'red');
    process.exit(1);
  }
  
  // Check if netlify.toml exists
  if (!fs.existsSync('netlify.toml')) {
    log('❌ netlify.toml not found. Please ensure Netlify configuration exists.', 'red');
    process.exit(1);
  }
  
  // Check if node_modules exists
  if (!fs.existsSync('node_modules')) {
    log('⚠️  node_modules not found. Installing dependencies...', 'yellow');
    runCommand('npm install', 'Installing dependencies');
  }
  
  log('✅ Prerequisites check passed', 'green');
}

function buildProject() {
  log('\n🏗️  Building project...', 'blue');
  
  // Clean previous build
  if (fs.existsSync('dist')) {
    log('🧹 Cleaning previous build...', 'yellow');
    runCommand('rm -rf dist', 'Cleaning dist directory');
  }
  
  // Run type check
  runCommand('npm run type-check', 'Type checking');
  
  // Run build
  runCommand('npm run build', 'Building project');
  
  // Verify build output
  if (!fs.existsSync('dist')) {
    log('❌ Build failed - dist directory not created', 'red');
    process.exit(1);
  }
  
  if (!fs.existsSync('dist/index.html')) {
    log('❌ Build failed - index.html not found in dist', 'red');
    process.exit(1);
  }
  
  log('✅ Build completed successfully', 'green');
}

function checkNetlifyCLI() {
  try {
    execSync('netlify --version', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

function deployToNetlify() {
  log('\n🚀 Deploying to Netlify...', 'blue');
  
  if (!checkNetlifyCLI()) {
    log('⚠️  Netlify CLI not found. Installing...', 'yellow');
    runCommand('npm install -g netlify-cli', 'Installing Netlify CLI');
  }
  
  // Check if user is logged in
  try {
    execSync('netlify status', { stdio: 'pipe' });
  } catch (error) {
    log('🔐 Please log in to Netlify...', 'yellow');
    runCommand('netlify login', 'Logging in to Netlify');
  }
  
  // Deploy
  const args = process.argv.slice(2);
  const isProduction = args.includes('--prod') || args.includes('-p');
  
  if (isProduction) {
    log('🌟 Deploying to production...', 'magenta');
    runCommand('netlify deploy --prod --dir=dist', 'Production deployment');
  } else {
    log('🧪 Deploying to preview...', 'yellow');
    runCommand('netlify deploy --dir=dist', 'Preview deployment');
  }
}

function showDeploymentInfo() {
  log('\n📊 Deployment Information:', 'blue');
  log('• Build directory: dist/', 'cyan');
  log('• Configuration: netlify.toml', 'cyan');
  log('• Redirects: public/_redirects', 'cyan');
  log('• Environment: .env.example (template)', 'cyan');
  
  log('\n📚 Useful Commands:', 'blue');
  log('• npm run deploy          - Deploy to preview', 'cyan');
  log('• npm run deploy --prod   - Deploy to production', 'cyan');
  log('• netlify open            - Open Netlify dashboard', 'cyan');
  log('• netlify logs            - View function logs', 'cyan');
  log('• netlify env:list        - List environment variables', 'cyan');
}

function main() {
  log('🎯 Netlify Deployment Script', 'bright');
  log('================================', 'bright');
  
  try {
    checkPrerequisites();
    buildProject();
    
    const args = process.argv.slice(2);
    
    if (args.includes('--build-only')) {
      log('\n✅ Build completed. Skipping deployment (--build-only flag)', 'green');
      return;
    }
    
    if (args.includes('--help') || args.includes('-h')) {
      showDeploymentInfo();
      return;
    }
    
    deployToNetlify();
    
    log('\n🎉 Deployment completed successfully!', 'green');
    showDeploymentInfo();
    
  } catch (error) {
    log(`\n❌ Deployment failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { main, checkPrerequisites, buildProject, deployToNetlify };
