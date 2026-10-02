<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
## Arquitectura BaseHATBRA

### Autenticación y Rutas
- Endpoints estándar de autenticación: `/login` y `/register`.
- Protección global de rutas en `middleware.ts` para `/dashboard/*` y `/api/*`.

### Configuración y Clientes Supabase (`/lib/supabase`)
- `config.ts`: Validación fail-closed (`assertSupabaseConfig`) de las variables de entorno `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- `server.ts`: Cliente para Server Components y Server Actions usando `@supabase/ssr`.
- `client.ts`: Cliente para Client Components (`createBrowserClient`).
- `database.ts`: Tipado TypeScript para tablas (`profiles`, `services`, `requests`, `reviews`).

### Interfaz y Layout (`/components/layout`)
- `AppShell.tsx`: Envoltorio principal del dashboard.
- `Sidebar.tsx`: Menú lateral adaptativo por rol (`client`, `provider`, `admin`).
- `Header.tsx`: Barra superior con datos del usuario.