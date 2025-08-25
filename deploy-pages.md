# Deploy Al-Quran Flashcard to Cloudflare Pages

## Cloudflare Pages Deployment

This project is designed for **Cloudflare Pages** - a static site hosting platform with global CDN.

### Option 1: GitHub Integration (Recommended)

1. **Push to GitHub** (already done):
   ```bash
   git add .
   git commit -m "Update project"
   git push origin main
   ```

2. **Deploy via Cloudflare Dashboard**:
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Navigate to "Pages"
   - Connect to GitHub repository: `asrulmunir/al-quran-flashcard`
   - Use these settings:
     - **Project name**: `al-quran-flashcard`
     - **Production branch**: `main`
     - **Build command**: (leave empty - static files)
     - **Build output directory**: `/`
   - **Auto-deployment**: Enabled (deploys on every push)

### Option 2: Wrangler CLI

```bash
# Deploy directly from local files
wrangler pages deploy . --project-name=al-quran-flashcard

# Or create new project and deploy
wrangler pages project create al-quran-flashcard
wrangler pages deploy . --project-name=al-quran-flashcard
```

### Option 3: Manual Upload

1. **Create ZIP file**:
   ```bash
   zip -r al-quran-flashcard.zip index.html styles.css script.js api-spec.yaml README.md
   ```

2. **Upload via Dashboard**:
   - Go to Cloudflare Pages
   - Click "Upload assets"
   - Upload the ZIP file
   - Set project name: `al-quran-flashcard`

## Current Deployment

✅ **Live URL**: https://24c74c7f.al-quran-flashcard.pages.dev
✅ **GitHub**: https://github.com/asrulmunir/al-quran-flashcard
✅ **Auto-deployment**: Configured from GitHub

## Features After Deployment

✅ **Global CDN**: Fast loading worldwide  
✅ **HTTPS**: Automatic SSL certificate  
✅ **Custom Domain**: Optional custom domain support  
✅ **Analytics**: Built-in web analytics  
✅ **Caching**: Optimized static file caching  
✅ **Auto-deployment**: Updates on every Git push  

## Project Structure

```
al-quran-flashcard/
├── index.html          # Main application
├── styles.css          # Styling and animations  
├── script.js           # JavaScript functionality
├── api-spec.yaml       # Al-Quran API specification
├── README.md           # Documentation (Bahasa Melayu)
├── wrangler.toml       # Cloudflare Pages config
└── .gitignore          # Git ignore rules
```

## Post-Deployment Checklist

- [ ] Test all flashcard functionality
- [ ] Verify API calls to Al-Quran API work
- [ ] Check responsive design on mobile
- [ ] Test keyboard shortcuts
- [ ] Verify all translations load correctly
- [ ] Test progress tracking and statistics

## Troubleshooting

**CORS Issues**: The app calls external API, ensure CORS is handled properly  
**Loading Issues**: Check browser console for any JavaScript errors  
**API Failures**: Verify Al-Quran API is accessible from deployment  

---

**Note**: This project uses **Cloudflare Pages** for static hosting. No Workers functionality is required.
