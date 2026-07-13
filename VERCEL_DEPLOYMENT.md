# 🚀 Vercel Deployment Guide for AuraStyle

## Quick Start

### Option 1: Deploy with Vercel CLI (Fastest)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Navigate to frontend directory
cd frontend

# 3. Deploy
vercel --prod
```

The CLI will:
- Ask for project name (suggest: aurastyle)
- Detect Vite setup automatically
- Set up production domain
- Deploy in ~2 minutes

### Option 2: Connect GitHub Repository (Recommended)

1. **Sign up on Vercel**
   - Go to https://vercel.com
   - Sign in with GitHub
   - Authorize access

2. **Import Project**
   - Click "Add New" → "Project"
   - Select your GitHub repo (beauty-by-deib/AuraStyle-Escrow)
   - Import

3. **Configure Build**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Set Environment Variables**
   - Go to Settings → Environment Variables
   - Add all variables from `.env.local`:
     ```
     VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
     VITE_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
     VITE_CONTRACT_ID=CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
     VITE_USDC_CONTRACT_ID=CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA
     VITE_API_URL=https://api.aurastyle.com
     VITE_ENVIRONMENT=production
     ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~3-5 minutes)
   - Get live URL (e.g., https://aurastyle.vercel.app)

---

## Environment Variables Setup

### What Each Variable Does

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_SOROBAN_RPC_URL` | Stellar blockchain RPC | https://soroban-testnet.stellar.org |
| `VITE_NETWORK_PASSPHRASE` | Testnet identifier | "Test SDF Network ; September 2015" |
| `VITE_CONTRACT_ID` | Deployed escrow contract | CXXXXXXX... |
| `VITE_USDC_CONTRACT_ID` | USDC token contract | CBIELTK6... |
| `VITE_API_URL` | Backend API (optional) | https://api.aurastyle.com |
| `VITE_ENVIRONMENT` | Build environment | production |

### How to Update After Deployment

**Update via Vercel Dashboard:**
1. Go to Project Settings
2. Click "Environment Variables"
3. Edit the variable
4. Trigger redeploy: Push to GitHub or click "Redeploy"

**Update via Vercel CLI:**
```bash
vercel env pull  # Download current env vars
# Edit .env.local locally
vercel env push  # Upload changes
```

---

## Configuration Files

### `.env.local` (Development)
```
VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
VITE_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
VITE_CONTRACT_ID=CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_USDC_CONTRACT_ID=CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA
VITE_API_URL=http://localhost:3000
VITE_ENVIRONMENT=development
```

### `.env.production` (Production)
```
VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
VITE_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
VITE_CONTRACT_ID=CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_USDC_CONTRACT_ID=CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA
VITE_API_URL=https://api.aurastyle.com
VITE_ENVIRONMENT=production
```

### `vercel.json` (Optional)
Create in project root to customize Vercel behavior:

```json
{
  "buildCommand": "cd frontend && npm run build",
  "outputDirectory": "frontend/dist",
  "installCommand": "cd frontend && npm install",
  "env": {
    "VITE_SOROBAN_RPC_URL": "@vite_soroban_rpc_url",
    "VITE_NETWORK_PASSPHRASE": "@vite_network_passphrase",
    "VITE_CONTRACT_ID": "@vite_contract_id",
    "VITE_USDC_CONTRACT_ID": "@vite_usdc_contract_id",
    "VITE_API_URL": "@vite_api_url",
    "VITE_ENVIRONMENT": "@vite_environment"
  }
}
```

---

## Pre-Deployment Checklist

- [ ] CONTRACT_ID updated with deployed contract address
- [ ] USDC_CONTRACT_ID correct (CBIELTK6...)
- [ ] All environment variables set in Vercel dashboard
- [ ] `.env.local` in `.gitignore` (don't commit secrets)
- [ ] `npm run build` works locally
- [ ] No build errors in Vercel logs
- [ ] Frontend loads at https://[project].vercel.app
- [ ] Wallet connection works
- [ ] Can select styles
- [ ] Can enter stylist address

---

## Deployment Steps

### Step 1: Prepare Repository
```bash
# Make sure .env.local is in .gitignore
echo ".env.local" >> .gitignore

# Commit changes
git add frontend/.env.production
git commit -m "add: vercel environment configuration"
git push origin main
```

### Step 2: Update CONTRACT_ID
Before deploying, you need a deployed contract:
1. Follow DEPLOYMENT.md to deploy contract to testnet
2. Get CONTRACT_ID from deployment output
3. Update in Vercel dashboard: Settings → Environment Variables

### Step 3: Deploy Frontend

**Option A: Vercel CLI**
```bash
cd frontend
vercel --prod
```

**Option B: GitHub Integration**
- Push to main branch
- Vercel automatically deploys
- Check Deployments tab for status

### Step 4: Verify Deployment
```bash
# Visit your Vercel URL
https://[your-project].vercel.app

# Test:
✓ Page loads
✓ "Connect Wallet" button visible
✓ No console errors (F12)
✓ Wallet connection works
```

---

## Troubleshooting

### Build Fails: "Module not found"
**Problem:** Missing dependencies
**Solution:**
```bash
cd frontend
npm install
npm run build
```

### Deploy Fails: "VITE_CONTRACT_ID not defined"
**Problem:** Environment variables not set
**Solution:**
1. Go to Vercel dashboard
2. Project Settings → Environment Variables
3. Add all VITE_* variables
4. Redeploy

### Frontend Shows Blank Page
**Problem:** Build output not generated
**Check:**
1. Build logs in Vercel dashboard (Deployments tab)
2. Verify `dist/index.html` exists
3. Check browser console for errors (F12)
4. Verify environment variables are loaded (F12 → Application)

### Wallet Connection Fails
**Problem:** RPC URL or contract ID wrong
**Check:**
1. CONTRACT_ID is correct (starts with C, 56 chars)
2. SOROBAN_RPC_URL is correct
3. Contract actually deployed on testnet
4. Check browser console for specific error

### Slow Deployment or Build Timeout
**Problem:** Dependencies installation taking too long
**Solution:**
1. Go to Settings → Build & Development
2. Increase Build Timeout to 60 minutes
3. Clear cache: Settings → Git → Clear Git Cache
4. Redeploy

---

## After Deployment

### Monitor Performance
1. **Vercel Analytics** (free tier)
   - Dashboard → Analytics
   - Monitor page load time, CLS, etc.

2. **Vercel Functions** (if using serverless)
   - Monitor function execution
   - Check error logs

### Update Configuration
**To change CONTRACT_ID or other settings:**
1. Update in Vercel dashboard
2. Trigger redeploy (push to main or click Redeploy)
3. Verify at https://[project].vercel.app

### Custom Domain
1. Go to Project Settings → Domains
2. Add your domain (e.g., aurastyle.com)
3. Update DNS records (Vercel provides instructions)
4. Wait 10-30 minutes for DNS to propagate

### Enable Analytics
1. Settings → Analytics
2. Enable Web Analytics (free)
3. Monitor real user metrics

---

## Maintenance

### Monthly Tasks
- [ ] Check Vercel dashboard for alerts
- [ ] Review build logs for warnings
- [ ] Update environment variables if needed
- [ ] Verify wallet integration still works
- [ ] Check for dependency security updates

### Scaling
If traffic grows:
1. Vercel auto-scales (no action needed)
2. Monitor costs in Vercel billing
3. Consider caching headers for better performance
4. Add CDN if needed (already included with Vercel)

---

## Costs

**Vercel Pricing (as of 2026):**
- Hobby (free): ✅ Perfect for testnet
  - 100 GB bandwidth/month
  - 1000 function invocations/day
  - 12 deployments/month
  
- Pro ($20/month): For production
  - Unlimited bandwidth
  - Unlimited deployments
  - Priority support

**For AuraStyle MVP:** Hobby tier is sufficient

---

## Support & Resources

- **Vercel Docs:** https://vercel.com/docs
- **Vite Deployment:** https://vitejs.dev/guide/static-deploy.html
- **AuraStyle DEPLOYMENT.md:** See DEPLOYMENT.md for contract setup
- **GitHub Integration:** https://vercel.com/docs/git/vercel-for-github

---

**Deployment ready? Start with Option 1 (Vercel CLI) for fastest setup!** 🚀
