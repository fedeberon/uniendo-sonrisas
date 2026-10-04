import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Uniendo Sonrisas | Gestión de socios", description: "Gestión de socios y aportes mensuales de la Fundación Uniendo Sonrisas", applicationName: "Uniendo Sonrisas", appleWebApp: { capable: true, title: "Uniendo Sonrisas", statusBarStyle: "default" }, icons: { icon: "/site-assets/logo-icon.png", apple: "/site-assets/logo-icon.png" } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="es"><body>{children}</body></html>; }
