# 🚀 Netlify Deployment & Domain Guide

This guide will walk you through deploying your Lovelli project to Netlify and connecting your custom domain.

---

## 🏗️ Step 1: Prepare for Deployment

I have already created a `public/_redirects` file for you. This is **CRITICAL** for React apps on Netlify to ensure that page refreshes on subpages (like `/about` or `/projects`) don't return a 404 error.

## 🚢 Step 2: Deploy to Netlify

### Option A: Via GitHub (Recommended)
1.  Push your code to a **GitHub**, **GitLab**, or **Bitbucket** repository.
2.  Log in to [Netlify](https://app.netlify.com/).
3.  Click **"Add new site"** > **"Import an existing project"**.
4.  Select your repository.
5.  **Build Settings**:
    *   **Build Command**: `npm run build`
    *   **Publish directory**: `dist`
6.  **Environment Variables**:
    You **MUST** add your Supabase keys here for the site to work:
    *   Click "Add environment variables".
    *   Add `VITE_SUPABASE_URL` with your Supabase URL.
    *   Add `VITE_SUPABASE_ANON_KEY` with your Supabase Anon Key.
7.  Click **"Deploy site"**.

### Option B: Via Netlify CLI
1.  Install CLI: `npm install netlify-cli -g`
2.  Login: `netlify login`
3.  Deploy: `netlify deploy --build` (Select "Create & configure a new site").

---

## 🌐 Step 3: Connect Your Custom Domain

Once your site is deployed:

1.  In your Netlify dashboard, go to **Site configuration** > **Domain management**.
2.  Click **"Add a domain"**.
3.  Enter your domain name (e.g., `www.youragency.com`).
4.  Netlify will give you two ways to connect:

### Method 1: Use Netlify DNS (Easiest)
1.  Netlify will provide you with 4 custom Name Servers (e.g., `dns1.p01.nsone.net`).
2.  Go to your domain registrar (GoDaddy, Namecheap, Google Domains).
3.  Change your domain's Name Servers to the ones Netlify provided.
4.  *Wait up to 24 hours for propagation.*

### Method 2: External DNS (Manual)
If you want to keep your current DNS provider:
1.  **A Record**: Point `@` to Netlify's load balancer IP: `75.101.145.87`.
2.  **CNAME Record**: Point `www` to your Netlify subdomain (e.g., `your-site-name.netlify.app`).

---

## 🔒 Step 4: Enable HTTPS (SSL)

1.  In **Domain management**, scroll down to **HTTPS**.
2.  Once your DNS has propagated, click **"Verify DNS configuration"**.
3.  Netlify will automatically provision a free Let's Encrypt SSL certificate for you.

---

## 🛠️ Troubleshooting

*   **404 on Refresh**: Ensure `public/_redirects` contains `/* /index.html 200`.
*   **Supabase Not Connecting**: Check that your Environment Variables in Netlify are named exactly `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
*   **Styling Issues**: Ensure you ran `npm run build` and the publish directory is set to `dist`.

---

**Congratulations! Your award-winning site is now live!** 🎉
