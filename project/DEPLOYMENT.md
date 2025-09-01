# Netlify Deployment Guide

This guide will help you deploy your React + TypeScript + Vite application to Netlify.

## 🚀 Quick Deploy

### Option 1: Deploy from Git Repository (Recommended)

1. **Push your code to GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Add Netlify configuration"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Choose your Git provider and repository
   - Netlify will auto-detect the settings from `netlify.toml`

3. **Deploy**
   - Click "Deploy site"
   - Your site will be live in minutes!

### Option 2: Manual Deploy

1. **Build the project locally**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Go to [Netlify](https://netlify.com)
   - Drag and drop the `dist` folder to the deploy area

## ⚙️ Configuration

### Build Settings (Auto-configured via netlify.toml)

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node.js version**: 18

### Environment Variables

Set these in Netlify Dashboard → Site Settings → Environment Variables:

```bash
NODE_ENV=production
VITE_APP_NAME="Your App Name"
# Add other variables from .env.example as needed
```

## 🔧 Advanced Configuration

### Custom Domain

1. Go to Site Settings → Domain management
2. Add your custom domain
3. Configure DNS settings as instructed
4. SSL certificate will be automatically provisioned

### Branch Deploys

- **Production**: `main` branch → your-site.netlify.app
- **Preview**: Other branches → deploy-preview-123--your-site.netlify.app
- **Pull Requests**: Automatic deploy previews

### Performance Optimizations

The configuration includes:

- ✅ Asset caching (1 year for static assets)
- ✅ Gzip compression
- ✅ Security headers
- ✅ Lighthouse performance monitoring
- ✅ SPA routing support

### Security Headers

Automatically configured:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

## 🛠️ Troubleshooting

### Common Issues

1. **Build Fails**
   ```bash
   # Check build locally first
   npm run build
   
   # Check Node.js version
   node --version  # Should be 18+
   ```

2. **Routes Not Working (404 on refresh)**
   - The `_redirects` file handles SPA routing
   - Ensure it's in the `public` folder

3. **Environment Variables Not Working**
   - Prefix with `VITE_` for client-side variables
   - Set in Netlify dashboard, not in code

4. **Slow Build Times**
   ```bash
   # Enable build cache in netlify.toml
   [build]
     command = "npm ci && npm run build"
   ```

### Build Logs

Check build logs in Netlify dashboard:
- Site Overview → Production deploys → View function logs

### Performance Issues

1. **Enable Lighthouse plugin** (already configured)
2. **Optimize images**: Use WebP format
3. **Code splitting**: Vite handles this automatically
4. **Bundle analysis**:
   ```bash
   npm run analyze
   ```

## 📊 Monitoring

### Analytics

Add to your environment variables:
```bash
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
```

### Error Tracking

Consider adding:
- Sentry for error tracking
- LogRocket for session replay
- Hotjar for user behavior

## 🔄 CI/CD Pipeline

### Automatic Deploys

- ✅ Push to main → Production deploy
- ✅ Pull request → Deploy preview
- ✅ Branch push → Branch deploy

### Deploy Hooks

Create deploy hooks for:
- CMS updates
- Scheduled rebuilds
- External API changes

## 📱 Testing

### Deploy Previews

Every pull request gets a unique URL:
```
https://deploy-preview-123--your-site.netlify.app
```

### Local Testing

Test production build locally:
```bash
npm run build
npm run preview
```

## 🚨 Security

### Environment Variables

- Never commit `.env` files
- Use Netlify dashboard for secrets
- Prefix client variables with `VITE_`

### Content Security Policy

Add to netlify.toml if needed:
```toml
[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline'"
```

## 📞 Support

- [Netlify Documentation](https://docs.netlify.com/)
- [Netlify Community](https://community.netlify.com/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#netlify)

## 🎯 Next Steps

1. **Set up monitoring**: Add analytics and error tracking
2. **Optimize performance**: Run Lighthouse audits
3. **Add forms**: Use Netlify Forms for contact forms
4. **Functions**: Add serverless functions if needed
5. **Edge functions**: Use for advanced routing/middleware

---

**Happy Deploying! 🚀**
