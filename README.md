# FishWale.com

FishWale is a premium fresh fish delivery eCommerce platform built with Next.js, Tailwind CSS, Supabase, and Razorpay.

## Features
- **Storefront:** Browse fish by category, view bestsellers, responsive design.
- **Cart & Checkout:** Dynamic delivery zones based on pin code, multiple addresses per user, secure checkout via Razorpay.
- **Discount Coupons:** Generate flat or percentage discount codes with usage limits.
- **User Accounts:** OTP and OAuth login, order history, address management.
- **Admin Panel:** Complete inventory management (products, categories, stock levels), order processing, delivery zones, coupons, and dynamic homepage banners.

## Prerequisites
- Node.js (v18+)
- Supabase Account
- Razorpay Account
- Cloudflare Account (for production deployment)

## Environment Variables
Create a `.env.local` file in the root directory (based on `.env.example` if available) and add the following keys:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
*Note: In production, `NEXT_PUBLIC_SITE_URL` should be `https://fishwale.com`.*

## Getting Started (Local Development)
1. **Install Dependencies:**
   ```bash
   npm install
   ```
2. **Run the Development Server:**
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Admin Access
To access the Admin dashboard (`/admin`), your user account must have the `admin` role in the Supabase `profiles` table.
1. Sign up/Login on the website.
2. Go to your Supabase SQL Editor and run:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE email = 'your_email@example.com';
   ```
3. Refresh the page, and you will see the "Admin" link in the navigation menu.

## Deployment to Cloudflare Pages
This project uses `@cloudflare/next-on-pages` for deployment to Cloudflare Pages (Edge network).

1. **GitHub/GitLab/Bitbucket:** Push this repository to your remote git provider.
2. **Cloudflare Dashboard:**
   - Go to **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**.
   - Select your FishWale repository.
   - **Framework preset:** Next.js
   - **Build command:** `npx @cloudflare/next-on-pages`
   - **Build output directory:** `.vercel/output/static`
3. **Environment Variables:**
   Add all the environment variables from your `.env.local` to the Cloudflare Pages settings.
   > **CRITICAL**: For the live production environment, ensure you use your **Razorpay Live Keys**, not the Test keys.
4. **Deploy!** Cloudflare will build and deploy your site.

## Custom Domain Go-Live (fishwale.com)
1. In Cloudflare Pages, go to your project -> **Custom Domains**.
2. Click **Set up a custom domain** and enter `fishwale.com`.
3. Cloudflare will automatically provision the SSL certificates and configure the DNS if your domain is managed by Cloudflare.
4. **Update Webhooks:** Go to your Razorpay Dashboard -> Settings -> Webhooks, and update the Webhook URL to: `https://fishwale.com/api/webhooks/razorpay`.
5. **Update Next Auth / Site URL:** Ensure `NEXT_PUBLIC_SITE_URL` in Cloudflare Env Vars is set to `https://fishwale.com`.
