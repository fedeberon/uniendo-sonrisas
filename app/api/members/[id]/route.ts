import { NextRequest } from "next/server";
import { getDb, hasDatabase } from "@/lib/db";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  if (!body.name) return Response.json({ error: "El nombre es obligatorio" }, { status: 400 });
  if (!hasDatabase()) return Response.json({ member: { id, ...body }, demo: true });
  const sql = getDb();
  const memberNumber = body.externalId === "" || body.externalId == null ? null : Number(body.externalId);
  if (memberNumber !== null && (!Number.isInteger(memberNumber) || memberNumber < 1)) return Response.json({ error: "El número de socio debe ser un entero positivo" }, { status: 400 });
  const dni = body.dni?.trim() || null;
  if (dni && dni.includes(".")) return Response.json({ error: "El DNI no puede contener puntos" }, { status: 400 });
  try {
    const rows = await sql`UPDATE members SET external_id=${memberNumber}, dni=${dni}, name=${body.name}, email=${body.email || null}, phone=${body.phone || ""}, address=${body.address || ""}, plan=${body.plan || "Socio colaborador"}, status=${body.status || "Activo"} WHERE id=${id} RETURNING id, external_id AS "externalId", dni, name, email, phone, address, joined_at AS "joinedAt", status, plan, avatar`;
    if (!rows[0]) return Response.json({ error: "Socio no encontrado" }, { status: 404 });
    return Response.json({ member: rows[0], demo: false });
  } catch (error) {
    if ((error as { code?: string }).code === "23505") return Response.json({ error: "El DNI o número de socio ya está asignado a otro socio" }, { status: 409 });
    throw error;
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!hasDatabase()) return Response.json({ ok: true, demo: true });
  const sql = getDb();
  await sql`DELETE FROM members WHERE id=${id}`;
  return Response.json({ ok: true, demo: false });
}
