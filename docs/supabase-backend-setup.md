# Supabase Backend Skeleton Setup

## Environment variables

Add these values to your local environment:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## Apply database migration

Run the SQL migration in your Supabase project:

- File: `supabase/migrations/20260311163500_backend_phase1_phase3.sql`
- File: `supabase/migrations/20260311174000_project_assets_storage.sql`

You can apply it through the Supabase SQL editor or via Supabase CLI migration flow.

## API routes included

- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:id`
- `PATCH /api/projects/:id`
- `DELETE /api/projects/:id`
- `POST /api/projects/:id/assets` (multipart image upload to `project-assets` bucket)
- `GET /api/projects/:id/versions` (list snapshots)
- `POST /api/projects/:id/versions/:versionId/restore` (restore snapshot)

These routes currently authorize via existing NextAuth session (`auth().user.id`) and use Supabase database tables.
