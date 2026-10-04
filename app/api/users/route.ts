import { NextRequest } from "next/server";
import { getDb, hasDatabase } from "@/lib/db";

const fallbackUsers = [{ id: "demo-admin", name: "Admin Fundación", email: "admin@uniendosonrisas.org", accessAlias: "sol-risa-luz", role: "admin", status: "Activo", createdAt: "Hoy" }];

export async function GET() {
  if (!hasDatabase()) return Response.json({ users: fallbackUsers, demo: true });
  const sql = getDb();
  const users = await sql`SELECT id, name, email, access_alias AS "accessAlias", role, status, created_at AS "createdAt" FROM admin_users ORDER BY name ASC`;
  return Response.json({ users, demo: false });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  if (!body.name || !body.email || !body.accessAlias) return Response.json({ error: "Nombre, email y alias son obligatorios" }, { status: 400 });
  if (!hasDatabase()) return Response.json({ user: { id: `demo-${Date.now()}`, name: body.name, email: body.email, accessAlias: body.accessAlias, role: body.role || "admin", status: body.status || "Activo", createdAt: "Hoy" }, demo: true }, { status: 201 });
  const sql = getDb();
  const id = `u-${crypto.randomUUID()}`;
  const rows = await sql`INSERT INTO admin_users (id, name, email, access_alias, role, status) VALUES (${id}, ${body.name}, ${body.email}, ${body.accessAlias}, ${body.role || "admin"}, ${body.status || "Activo"}) RETURNING id, name, email, access_alias AS "accessAlias", role, status, created_at AS "createdAt"`;
  return Response.json({ user: rows[0], demo: false }, { status: 201 });
}
