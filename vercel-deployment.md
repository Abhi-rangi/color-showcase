# Vercel Deployment Guide

## 🚀 Deploy to Vercel (Static Site)

### Option 1: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (your account)
# - Link to existing project? N
# - Project name? color-showcase
# - Directory? ./
# - Override settings? N
```

### Option 2: Deploy via GitHub

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Next.js and deploy

### Option 3: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Drag and drop your project folder
4. Vercel will handle the rest

## ⚙️ Configuration

### Build Settings (Auto-detected)

- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### Environment Variables

No environment variables needed for this static deployment.

## 📁 Project Structure

```
color-showcase/
├── app/
│   ├── page.tsx          # Main page with color management
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   ├── color-card.tsx     # Color display component
│   └── ui/                # UI components
├── public/
│   ├── logo-teal.png      # Logo assets
│   ├── logo-white.png
│   └── EO_globe_vert_teal.png
└── package.json
```

## 🎯 Features Included

- ✅ Static site generation
- ✅ Local storage persistence
- ✅ Responsive design
- ✅ Color management
- ✅ Logo assets download
- ✅ No backend required

## 🔧 Post-Deployment

1. Your site will be available at `https://your-project.vercel.app`
2. Colors will persist in browser's local storage
3. All functionality works offline
4. Perfect for static hosting

## 📝 Notes

- No server-side rendering needed
- All data stored client-side
- Works perfectly as a static site
- Fast loading and SEO-friendly
