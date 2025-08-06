# SellersMedia POC - Supabase & Vercel Setup Guide

## 🚀 Quick Setup Steps

### 1. **Supabase Setup** (5 minutes)

#### Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create account
2. Click "New Project"
3. Choose organization and enter:
   - **Project Name**: `sellermedia-poc`
   - **Database Password**: (choose strong password)
   - **Region**: Choose closest to your users

#### Configure Database
1. Go to **SQL Editor** in Supabase dashboard
2. Copy and paste the entire content of `supabase-schema.sql`
3. Click **Run** to create all tables and functions

#### Get API Keys
1. Go to **Settings → API**
2. Copy these values:
   - **Project URL** (e.g., `https://abcdefghijk.supabase.co`)
   - **anon/public key** (the long string starting with `eyJhbGci...`)

#### Update Configuration
1. Open `config.js` in your project
2. Replace the placeholder values:
```javascript
const SUPABASE_CONFIG = {
  url: 'https://YOUR-PROJECT-ID.supabase.co', // Your actual URL
  anon_key: 'your-actual-anon-key-here'      // Your actual anon key
};
```

### 2. **Vercel Deployment** (3 minutes)

#### Option A: GitHub + Vercel (Recommended)
1. Push your code to GitHub repository
2. Go to [vercel.com](https://vercel.com) and sign up with GitHub
3. Click **New Project** and import your repository
4. Deploy with default settings
5. Your site will be live at `https://your-project-name.vercel.app`

#### Option B: Drag & Drop Deploy
1. Go to [vercel.com](https://vercel.com)
2. Drag your entire project folder to the Vercel homepage
3. Deploy instantly

### 3. **Authentication Configuration**

#### Enable Email Authentication
1. In Supabase dashboard, go to **Authentication → Settings**
2. Under **Site URL**, add your Vercel domain:
   - `https://your-project-name.vercel.app`
3. Under **Redirect URLs**, add:
   - `https://your-project-name.vercel.app/dashboard.html`

#### For Local Development
1. Also add for testing:
   - Site URL: `http://localhost:3000` (or your local server)
   - Redirect URL: `http://localhost:3000/dashboard.html`

---

## 🧪 Testing Your Setup

### Local Testing
1. Open `index.html` in browser (or use local server)
2. Enter any email/password to create account
3. Check email for verification (optional for POC)
4. Upload CSV with ASINs in management screen
5. View generated reports

### CSV Test Data
```csv
asin,market,rate
B08N5WRWNW,US,15.5
B07XJ8C8F5,UK,12.3
B09KMVJY8P,DE,18.7
B07VJKQXW9,FR,14.2
B08XQVYQMH,IT,16.8
B09N3ZPQRS,ES,13.1
B08HMWZBXC,CA,17.3
B07PDHSJ41,JP,11.9
```

---

## 📊 Features Enabled

✅ **User Authentication** - Sign up/Sign in with email  
✅ **ASIN Management** - Upload, edit, delete ASINs with rates  
✅ **Database Storage** - All data saved to PostgreSQL  
✅ **Monthly Reports** - Mock performance data generation  
✅ **Row Level Security** - Users only see their own data  
✅ **Responsive Design** - Works on desktop and mobile  

---

## 🔧 Optional Customizations

### Custom Domain (Vercel Pro)
1. Go to Vercel project settings → Domains
2. Add your custom domain
3. Update Supabase redirect URLs accordingly

### Email Templates
1. In Supabase → Authentication → Email Templates
2. Customize signup/reset password emails

### Performance Monitoring
1. Enable Supabase Analytics
2. Add Vercel Analytics

---

## 🆘 Troubleshooting

### Authentication Issues
- Check console for errors
- Verify Supabase URLs in config.js
- Ensure redirect URLs match exactly

### Database Issues
- Check Row Level Security policies are enabled
- Verify user has proper permissions
- Check Supabase logs for errors

### Deployment Issues
- Ensure all files uploaded to Vercel
- Check Vercel function logs
- Verify HTTPS is enabled

---

## 🚀 Next Steps for Production

1. **Email Verification**: Enable required email confirmation
2. **Rate Limiting**: Add Supabase rate limiting
3. **Error Tracking**: Integrate Sentry or similar
4. **Analytics**: Add Google Analytics or Vercel Analytics  
5. **Backup**: Enable Supabase database backups
6. **CDN**: Optimize assets with Vercel Edge Network

**Total Setup Time**: ~10 minutes  
**Monthly Cost**: $0 (free tiers for both services)