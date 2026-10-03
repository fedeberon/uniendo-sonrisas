# Uniendo Sonrisas

Gestor de socios y cuotas mensuales para la Fundación Uniendo Sonrisas.

## Desarrollo

```bash
npm install
cp .env.example .env.local
npm run dev
```

La aplicación funciona con datos demo si todavía no existe `DATABASE_URL`. Para activar Google OAuth, crear credenciales OAuth 2.0 de tipo aplicación web y agregar `http://localhost:3000/api/auth/callback/google` como redirect URI. En Vercel, usar el mismo callback con el dominio de producción.

## Base de datos

La aplicación usa Neon Postgres, provisionable desde Vercel Marketplace. Crear las tablas ejecutando `db/schema.sql` en la base conectada a Vercel y completar `DATABASE_URL`. `ADMIN_EMAILS` acepta una lista separada por comas.
