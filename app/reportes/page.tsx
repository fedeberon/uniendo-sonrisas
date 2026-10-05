import { Shell } from "@/components/shell";
import { ReportsDashboard } from "@/components/reports-dashboard";
import { getMembers, getPayments } from "@/lib/server-data";

export default async function ReportsPage(){ const [members, payments] = await Promise.all([getMembers(), getPayments()]); return <Shell current="Reportes"><ReportsDashboard members={members} payments={payments}/></Shell>; }
