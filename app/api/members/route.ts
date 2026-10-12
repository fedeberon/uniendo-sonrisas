import { NextRequest } from "next/server";
import { demoMembers } from "@/lib/data";
import { getDb, hasDatabase } from "@/lib/db";
import { formatDate } from "@/lib/server-data";

export async function GET() {
  if (!hasDatabase()) return Response.json({ members: demoMembers, demo: true });
  const sql = getDb();
  const rows = await sql`SELECT id, external_id AS "externalId", dni, name, email, phone, address, joined_at AS "joinedAt", status, plan, avatar FROM members ORDER BY joined_at DESC, name ASC`;
  const members = rows.map((member) => ({ ...member, joinedAt: formatDate(member.joinedAt as string | Date) }));
  return Response.json({ members, demo: false });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  if (!body.name) return Response.json({ error: "El nombre es obligatorio" }, { status: 400 });
  const memberNumber = body.externalId === "" || body.externalId == null ? null : Number(body.externalId);
  if (memberNumber !== null && (!Number.isInteger(memberNumber) || memberNumber < 1)) return Response.json({ error: "El número de socio debe ser un entero positivo" }, { status: 400 });
  const dni = body.dni?.trim() || null;
  if (dni && !/^\d{7,8}$/.test(dni)) return Response.json({ error: "El DNI debe contener entre 7 y 8 dígitos" }, { status: 400 });
  if (!hasDatabase()) return Response.json({ member: { id: `demo-${Date.now()}`, joinedAt: "Hoy", status: "Activo", paidMonths: 0, totalMonths: 12, ...body }, demo: true }, { status: 201 });
  const sql = getDb();
  const id = `m-${crypto.randomUUID()}`;
  try {
    const rows = await sql`INSERT INTO members (id, external_id, dni, name, email, phone, address, plan, avatar) VALUES (${id}, ${memberNumber}, ${dni}, ${body.name}, ${body.email || null}, ${body.phone || ""}, ${body.address || ""}, ${body.plan || "Socio colaborador"}, ${body.avatar || ""}) RETURNING id, external_id AS "externalId", dni, name, email, phone, address, joined_at AS "joinedAt", status, plan, avatar`;
    return Response.json({ member: rows[0], demo: false }, { status: 201 });
  } catch (error) {
    if ((error as { code?: string }).code === "23505") return Response.json({ error: "El DNI o número de socio ya está asignado a otro socio" }, { status: 409 });
    throw error;
  }
}
