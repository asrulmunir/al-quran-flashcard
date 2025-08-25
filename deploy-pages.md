# Deploy Al-Quran Flashcard to Cloudflare Pages

## Option 1: Cloudflare Pages (Recommended - Easier)

### Steps:

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Al-Quran Flashcard app"
   git branch -M main
   git remote add origin https://github.com/yourusername/al-quran-flashcard.git
   git push -u origin main
   ```

2. **Deploy via Cloudflare Dashboard**:
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Navigate to "Pages"
   - Click "Create a project"
   - Connect to GitHub and select your repository
   - Use these settings:
     - **Project name**: `al-quran-flashcard`
     - **Production branch**: `main`
     - **Build command**: (leave empty)
     - **Build output directory**: `/`
   - Click "Save and Deploy"

3. **Custom Domain** (Optional):
   - In Pages settings, add custom domain
   - Example: `flashcard.yourdomain.com`

## Option 2: Cloudflare Workers

### Prerequisites:
```bash
npm install -g wrangler
wrangler login
```

### Deploy:
```bash
./deploy.sh
```

## Option 3: Manual Cloudflare Pages Upload

1. **Create a ZIP file**:
   ```bash
   zip -r al-quran-flashcard.zip index.html styles.css script.js api-spec.yaml README.md
   ```

2. **Upload via Dashboard**:
   - Go to Cloudflare Pages
   - Click "Upload assets"
   - Upload the ZIP file
   - Set project name: `al-quran-flashcard`

## Features After Deployment:

✅ **Global CDN**: Fast loading worldwide
✅ **HTTPS**: Automatic SSL certificate
✅ **Custom Domain**: Optional custom domain support
✅ **Analytics**: Built-in web analytics
✅ **Caching**: Optimized static file caching

## Expected URLs:

- **Cloudflare Pages**: `https://al-quran-flashcard.pages.dev`
- **Cloudflare Workers**: `https://al-quran-flashcard.your-subdomain.workers.dev`
- **Custom Domain**: `https://your-custom-domain.com`

## Post-Deployment Checklist:

- [ ] Test all flashcard functionality
- [ ] Verify API calls to Al-Quran API work
- [ ] Check responsive design on mobile
- [ ] Test keyboard shortcuts
- [ ] Verify all translations load correctly
- [ ] Test progress tracking and statistics

## Troubleshooting:

**CORS Issues**: The app calls external API, ensure CORS is handled properly
**Loading Issues**: Check browser console for any JavaScript errors
**API Failures**: Verify Al-Quran API is accessible from your deployment
