# FishWale.com

Premium Online Fish Market for Agartala & Tripura.

## Running Locally

1. Create a `.env.local` file based on the instructions inside it. You'll need Supabase credentials (URL, anon key, and service role key).
2. Install dependencies: `npm install`
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Cloudflare Workers

This project uses the `@opennextjs/cloudflare` adapter.
To deploy, you can use the standard Cloudflare Wrangler commands (e.g. `npm run deploy` if set up).

**Important:** You must set the secrets in your Cloudflare dashboard (or via `npx wrangler secret put`) for:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Connecting the custom domain (fishwale.com) is a manual step inside the Cloudflare dashboard once DNS is ready.
