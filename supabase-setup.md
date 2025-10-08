# Supabase Setup Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub
4. Click "New Project"
5. Choose organization and enter project name
6. Set database password
7. Choose region (closest to your users)
8. Click "Create new project"

### Step 2: Get Your Credentials

1. Go to Project Settings → API
2. Copy the following values:
   - **Project URL** (looks like: `https://abcdefgh.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

### Step 3: Create Environment File

Create `.env.local` in your project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Step 4: Create Database Table

Run this SQL in Supabase SQL Editor:

```sql
-- Create colors table
CREATE TABLE colors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  hex TEXT NOT NULL,
  rgb TEXT NOT NULL,
  usage TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE colors ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for public read/write)
CREATE POLICY "Allow all operations" ON colors
  FOR ALL USING (true);

-- Insert default colors
INSERT INTO colors (id, name, hex, rgb, usage, category) VALUES
('default-1', 'Primary Dark Cyan', '#005a5e', 'rgb(0, 90, 94)', 'Main brand color, buttons, links', 'primary'),
('default-2', 'Secondary Purple', '#7c3aed', 'rgb(124, 58, 237)', 'Accent color, highlights, CTAs', 'primary'),
('default-3', 'Tertiary Teal', '#0d9488', 'rgb(13, 148, 136)', 'Supporting elements, icons', 'primary'),
('default-4', 'Success Green', '#059669', 'rgb(5, 150, 105)', 'Success states, confirmations', 'semantic'),
('default-5', 'Warning Orange', '#d97706', 'rgb(217, 119, 6)', 'Warnings, alerts, notifications', 'semantic'),
('default-6', 'Error Red', '#dc2626', 'rgb(220, 38, 38)', 'Error states, destructive actions', 'semantic'),
('default-7', 'Neutral Dark', '#374151', 'rgb(55, 65, 81)', 'Primary text, headings', 'neutral'),
('default-8', 'Neutral Medium', '#6b7280', 'rgb(107, 114, 128)', 'Secondary text, descriptions', 'neutral'),
('default-9', 'Neutral Light', '#f3f4f6', 'rgb(243, 244, 246)', 'Backgrounds, subtle borders', 'neutral'),
('default-10', 'Pure White', '#ffffff', 'rgb(255, 255, 255)', 'Card backgrounds, main content areas', 'neutral');
```

### Step 5: Deploy to Vercel

1. Push your code to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

## 🎯 Benefits

- ✅ **Free Tier**: 50,000 monthly active users
- ✅ **Real-time**: Changes sync across all users
- ✅ **Persistent**: Data survives page refreshes
- ✅ **Global**: Works from any browser/device
- ✅ **Admin Changes**: Become new defaults for everyone
- ✅ **Vercel Compatible**: Perfect for static sites

## 🔧 Features

- **Real-time Updates**: Changes appear instantly for all users
- **Admin Mode**: Your changes become the new defaults
- **Cross-Device**: Works on any device/browser
- **Backup**: Data stored in PostgreSQL database
- **Scalable**: Handles thousands of users
