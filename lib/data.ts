export type MemberStatus = "Activo" | "Pendiente" | "Inactivo";

export type Member = {
  id: string; externalId?: number | null; name: string; email: string | null; phone: string; address?: string | null; joinedAt: string;
  status: MemberStatus; plan: string; avatar: string; paidMonths: number; totalMonths: number;
};

export type Payment = { id: string; memberId: string; amount: number; paidAt: string; period: string; periodKeys?: string[]; status: string; method: string; monthsCount?: number; receiptData?: string | null; receiptName?: string | null; receiptStatus?: string; submittedBy?: string | null };

export const demoMembers: Member[] = [
  { id:"m-001", name:"María González", email:"maria.gonzalez@email.com", phone:"11 4567 8901", joinedAt:"12 feb 2024", status:"Activo", plan:"Socio colaborador", avatar:"MG", paidMonths:12, totalMonths:12 },
  { id:"m-002", name:"Julián Rodríguez", email:"julian.rodriguez@email.com", phone:"11 5123 7788", joinedAt:"08 mar 2024", status:"Activo", plan:"Socio fundador", avatar:"JR", paidMonths:11, totalMonths:12 },
  { id:"m-003", name:"Sofía Martínez", email:"sofia.martinez@email.com", phone:"11 6345 2210", joinedAt:"21 abr 2024", status:"Pendiente", plan:"Socio colaborador", avatar:"SM", paidMonths:8, totalMonths:12 },
  { id:"m-004", name:"Diego Fernández", email:"diego.fernandez@email.com", phone:"11 4788 0192", joinedAt:"02 may 2024", status:"Activo", plan:"Socio colaborador", avatar:"DF", paidMonths:12, totalMonths:12 },
  { id:"m-005", name:"Carolina López", email:"carolina.lopez@email.com", phone:"11 3234 6541", joinedAt:"15 jun 2024", status:"Inactivo", plan:"Socio colaborador", avatar:"CL", paidMonths:6, totalMonths:12 },
];

export const demoPayments: Payment[] = [
  { id:"p-001", memberId:"m-001", amount:8500, paidAt:"03 sep 2024", period:"Septiembre 2024", status:"Pagado", method:"Transferencia" },
  { id:"p-002", memberId:"m-002", amount:8500, paidAt:"02 sep 2024", period:"Septiembre 2024", status:"Pagado", method:"Mercado Pago" },
  { id:"p-003", memberId:"m-004", amount:8500, paidAt:"01 sep 2024", period:"Septiembre 2024", status:"Pagado", method:"Transferencia" },
  { id:"p-004", memberId:"m-001", amount:8500, paidAt:"04 ago 2024", period:"Agosto 2024", status:"Pagado", method:"Transferencia" },
];

export function initials(name: string) { return name.split(" ").map((part) => part[0]).slice(0,2).join("").toUpperCase(); }
export function money(value: number) { return new Intl.NumberFormat("es-AR", { style:"currency", currency:"ARS", maximumFractionDigits:0 }).format(value); }
