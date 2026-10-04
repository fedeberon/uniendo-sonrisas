import { NextRequest } from "next/server";
import { getDb, hasDatabase } from "@/lib/db";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  if (!body.name || !body.email || !body.accessAlias) return Response.json({ error: "Nombre, email y alias son obligatorios" }, { status: 400 });
  if (!hasDatabase()) return Response.json({ user: { id, ...body }, demo: true });
  const sql = getDb();
  const rows = await sql`UPDATE admin_users SET name=${body.name}, email=${body.email}, access_alias=${body.accessAlias}, role=${body.role || "admin"}, status=${body.status || "Activo"} WHERE id=${id} RETURNING id, name, email, access_alias AS "accessAlias", role, status, created_at AS "createdAt"`;
  if (!rows[0]) return Response.json({ error: "Usuario no encontrado" }, { status: 404 });
  return Response.json({ user: rows[0], demo: false });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!hasDatabase()) return Response.json({ ok: true, demo: true });
  const sql = getDb();
  await sql`DELETE FROM admin_users WHERE id=${id}`;
  return Response.json({ ok: true, demo: false });
}
