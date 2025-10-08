# GitHub Storage Setup (2 Minutes)

## 🚀 Quick Setup for Global Admin Changes

### Step 1: Create GitHub Personal Access Token

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name: "Color Showcase"
4. Select scopes: ✅ **repo** (Full control of private repositories)
5. Click "Generate token"
6. **Copy the token** (you won't see it again!)

### Step 2: Create Environment File

Create `.env.local` in your project root:

```bash
NEXT_PUBLIC_GITHUB_TOKEN=your-github-token-here
```

### Step 3: Update Repository Settings

In `lib/github-storage.ts`, update these values:

```typescript
const GITHUB_OWNER = "your-github-username"; // Your GitHub username
const GITHUB_REPO = "color-showcase"; // Your repository name
```

### Step 4: Create Data Directory

In your GitHub repository, create a folder called `data` (this will store the colors.json file)

### Step 5: Deploy to Vercel

1. Push your code to GitHub
2. In Vercel dashboard, add environment variable:
   - `NEXT_PUBLIC_GITHUB_TOKEN`
3. Deploy!

## 🎯 How It Works

### **Admin Changes:**

1. **Add/Edit/Delete Colors** → Saved to GitHub repository
2. **Global Effect** → All users see changes immediately
3. **Version Control** → Track all color changes in Git history
4. **Free** → No external database needed

### **User Experience:**

1. **Load Colors** → Fetches from GitHub repository
2. **Real-time Updates** → Changes appear on page refresh
3. **Fallback** → Uses localStorage if GitHub fails
4. **No Setup** → Works immediately for users

## ✅ Benefits

- **Free**: No external database costs
- **Global**: Admin changes visible to all users
- **Version Control**: Track all changes in Git
- **Simple**: Just GitHub token needed
- **Reliable**: GitHub's infrastructure
- **Fast**: CDN-backed file serving

## 🔧 File Structure

Your repository will have:

```
color-showcase/
├── data/
│   └── colors.json          # Admin color changes
├── app/
├── components/
└── ...
```

## 📱 Console Messages

- **"Loaded colors from GitHub"** - Successfully fetched from GitHub
- **"Successfully saved colors to GitHub"** - Admin changes saved
- **"GitHub token not configured"** - Using localStorage fallback
- **"Colors file not found in GitHub"** - Using default colors

## 🎨 Admin Workflow

1. **Enable Admin Mode** → Make color changes
2. **Changes Auto-Save** → Saved to GitHub repository
3. **Global Effect** → All users see changes
4. **Version History** → Track changes in Git

This gives you global admin persistence with just a GitHub token! 🚀
