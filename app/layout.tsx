import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Uniendo Sonrisas | Gestión de socios", description: "Gestión de socios y aportes mensuales de la Fundación Uniendo Sonrisas" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="es"><body>{children}</body></html>; }
