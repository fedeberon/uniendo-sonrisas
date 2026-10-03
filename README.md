# Uniendo Sonrisas

Gestor de socios y cuotas mensuales para la Fundación Uniendo Sonrisas.

## Desarrollo

```bash
npm install
cp .env.example .env.local
npm run dev
```

La aplicación funciona con datos demo si todavía no existe `DATABASE_URL`. Para activar Google OAuth, crear credenciales OAuth 2.0 de tipo aplicación web y agregar `http://localhost:3000/api/auth/callback/google` como redirect URI. En Vercel, usar el mismo callback con el dominio de producción.

## Base de datos y migraciones

La aplicación usa Neon Postgres, provisionable desde Vercel Marketplace. Vercel inyecta `DATABASE_URL` al conectar la base. Las migraciones versionadas viven en `db/migrations` y se ejecutan automáticamente antes de cada build mediante `prebuild`.

Para ejecutarlas localmente:

```bash
npm run db:migrate
```

Cada migración se registra en `schema_migrations` y no vuelve a ejecutarse. Para agregar cambios, crear un nuevo archivo ordenado, por ejemplo `002_add_notes.sql`; nunca modificar una migración ya aplicada.

`db/schema.sql` se mantiene como script SQL completo de referencia para inspección o creación manual.
