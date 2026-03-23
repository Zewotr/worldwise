# WorldWise

WorldWise is a React app for tracking cities you have visited.

## Database setup (Supabase)

The app now reads/writes cities from a Supabase PostgreSQL database, not `data/cities.json`.

1. Create a Supabase project.
2. Open the SQL editor and run `database/supabase.sql`.
3. Copy `.env.example` to `.env` and set:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Install deps and run:

```bash
npm install
npm run dev
```

## Notes

- The previous local JSON server script was removed.
- `data/cities.json` can be kept only as historical/sample data.
