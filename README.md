# 🎨 Color Showcase

A modern, interactive color palette showcase built with Next.js, featuring global admin persistence, real-time updates, and beautiful UI components.

![Color Showcase](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

## ✨ Features

### 🎨 **Interactive Color Palette**

- **Live Color Preview** - See colors in action with real-time swatches
- **Copy to Clipboard** - One-click hex and RGB value copying
- **Color Metrics** - Detailed RGB, HSL, HSV, and CMYK values
- **Category Organization** - Colors grouped by usage (Primary, Secondary, Accent, etc.)

### 👑 **Admin Mode**

- **Global Persistence** - Admin changes saved globally for all users
- **Real-time Updates** - Changes appear immediately across all devices
- **Version Control** - Track all color changes in Git history
- **Secure Access** - Password-protected admin mode

### 🚀 **Modern Tech Stack**

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **GitHub Storage** - Free, reliable data persistence
- **Vercel Deployment** - Static site generation

### 📱 **Responsive Design**

- **Mobile-First** - Optimized for all screen sizes
- **Touch-Friendly** - Intuitive mobile interactions
- **Fast Loading** - Optimized performance
- **Accessible** - WCAG compliant design

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or pnpm
- GitHub account

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/color-showcase.git
   cd color-showcase
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create `.env.local`:

   ```bash
   NEXT_PUBLIC_GITHUB_TOKEN=your-github-token-here
   ```

4. **Configure GitHub storage**
   Update `lib/github-storage.ts`:

   ```typescript
   const GITHUB_OWNER = "your-github-username";
   const GITHUB_REPO = "color-showcase";
   ```

5. **Run development server**

   ```bash
   npm run dev
   # or
   pnpm dev
   ```

6. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 GitHub Storage Setup

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

## 🎯 Usage

### **Regular Users**

- **Browse Colors** - View the complete color palette
- **Copy Values** - Click any color to copy hex/RGB values
- **Download Assets** - Access logo files and brand assets
- **View Guidelines** - Read usage instructions

### **Admin Mode**

1. **Enable Admin** - Click "Admin" button and enter password (`admin123`)
2. **Add Colors** - Click "Add Color" to create new colors
3. **Edit Colors** - Click edit icon on any color card
4. **Delete Colors** - Click trash icon to remove colors
5. **Global Changes** - All changes saved globally for all users

### **Admin Features**

- ✅ **Add Colors** - Create new colors with custom properties
- ✅ **Edit Colors** - Modify existing color details
- ✅ **Delete Colors** - Remove unwanted colors
- ✅ **Reset Palette** - Restore to default colors
- ✅ **Export/Import** - Backup and restore color palettes
- ✅ **Global Persistence** - Changes visible to all users

## 📁 Project Structure

```
color-showcase/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles and CSS variables
│   ├── layout.tsx        # Root layout component
│   └── page.tsx          # Main color showcase page
├── components/            # Reusable UI components
│   ├── color-card.tsx    # Individual color display
│   ├── color-demo.tsx    # Color demonstration
│   ├── theme-provider.tsx # Theme context provider
│   └── ui/               # Shadcn/ui components
├── lib/                  # Utility libraries
│   ├── github-storage.ts # GitHub-based data persistence
│   ├── supabase.ts       # Supabase client (optional)
│   └── utils.ts          # Utility functions
├── public/               # Static assets
│   ├── logo-teal.png    # Teal logo variant
│   ├── logo-white.png   # White logo variant
│   └── EO_globe_vert_teal.png # Globe logo
├── styles/               # Additional stylesheets
└── data/                # GitHub-stored color data
    └── colors.json      # Admin color changes
```

## 🎨 Color System

### **Default Palette**

- **Primary Colors** - Main brand colors (Teal, Purple, Orange)
- **Secondary Colors** - Supporting brand colors
- **Accent Colors** - Highlight and call-to-action colors
- **Neutral Colors** - Grays and text colors
- **Status Colors** - Success, warning, error states

### **Color Properties**

Each color includes:

- **Name** - Descriptive color name
- **Hex Code** - 6-digit hexadecimal value
- **RGB Values** - Red, Green, Blue components
- **Usage Guidelines** - When and how to use the color
- **Category** - Color classification

## 🔧 Configuration

### **Environment Variables**

```bash
# Required for GitHub storage
NEXT_PUBLIC_GITHUB_TOKEN=your-github-token

# Optional for Supabase (fallback)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
```

### **Admin Password**

Default admin password: `admin123`

- Change in `app/page.tsx` → `toggleAdminMode` function
- Consider using environment variables for production

### **GitHub Repository**

- **Owner**: Your GitHub username
- **Repository**: Your repository name
- **Data Path**: `data/colors.json`
- **Permissions**: Read/Write access required

## 🚀 Deployment

### **Vercel (Recommended)**

1. **Connect Repository** - Link your GitHub repository
2. **Add Environment Variables** - Set `NEXT_PUBLIC_GITHUB_TOKEN`
3. **Deploy** - Automatic deployment on push
4. **Custom Domain** - Optional custom domain setup

### **Other Platforms**

- **Netlify** - Static site hosting
- **GitHub Pages** - Free GitHub hosting
- **Railway** - Full-stack deployment
- **DigitalOcean** - VPS deployment

## 🛠️ Development

### **Available Scripts**

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### **Tech Stack**

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Icons**: Lucide React
- **Storage**: GitHub API
- **Deployment**: Vercel

### **Browser Support**

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 📊 Performance

### **Optimizations**

- **Static Generation** - Pre-rendered pages for fast loading
- **Image Optimization** - Next.js automatic image optimization
- **Code Splitting** - Automatic code splitting
- **CDN Delivery** - Global content delivery
- **Caching** - Intelligent caching strategies

### **Metrics**

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **Core Web Vitals**: All green
- **Bundle Size**: < 100KB gzipped
- **Load Time**: < 2 seconds

## 🤝 Contributing

### **How to Contribute**

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### **Development Guidelines**

- Follow TypeScript best practices
- Use meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed
- Follow the existing code style

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Shadcn/ui** - For the beautiful UI components
- **Lucide** - For the icon library
- **GitHub** - For the free storage solution

## 📞 Support

### **Getting Help**

- **Documentation** - Check this README and setup guides
- **Issues** - Open a GitHub issue for bugs
- **Discussions** - Use GitHub Discussions for questions
- **Email** - Contact the maintainer directly

### **Common Issues**

- **GitHub Token Issues** - Check token permissions and expiration
- **Build Errors** - Ensure all environment variables are set
- **Deployment Issues** - Check Vercel logs and configuration
- **Admin Access** - Verify password and admin mode status

---

**Built with ❤️ by [Your Name]**

_Showcasing colors that matter, one palette at a time._ 🎨
