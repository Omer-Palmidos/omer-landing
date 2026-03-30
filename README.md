# omer-landing

Tegridy Farms project — GitHub + Vercel + Neon. Pipeline specs live in docs/pipeline/ in this repo.

## Environments

- **Vercel:** DATABASE_URL is set for production, preview, and development when Randy runs project-setup (encrypted).
- **Local:** Copy .env.example to .env.local and paste your Neon connection string into DATABASE_URL.
