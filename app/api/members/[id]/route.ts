import { NextRequest } from "next/server";
import { getDb, hasDatabase } from "@/lib/db";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  if (!hasDatabase()) return Response.json({ member: { id, ...body }, demo: true });
  const sql = getDb();
  const rows = await sql`UPDATE members SET name=${body.name}, email=${body.email || null}, phone=${body.phone || ""}, address=${body.address || ""}, plan=${body.plan || "Socio colaborador"}, status=${body.status || "Activo"} WHERE id=${id} RETURNING *`;
  if (!rows[0]) return Response.json({ error: "Socio no encontrado" }, { status: 404 });
  return Response.json({ member: rows[0], demo: false });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!hasDatabase()) return Response.json({ ok: true, demo: true });
  const sql = getDb();
  await sql`DELETE FROM members WHERE id=${id}`;
  return Response.json({ ok: true, demo: false });
}
