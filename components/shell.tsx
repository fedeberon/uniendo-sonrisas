import Link from "next/link";
import type React from "react";
import { Icon } from "./icons";
import { PwaInstall } from "./pwa-install";

export function Shell({ children, current = "Inicio" }: { children: React.ReactNode; current?: string }) {
  const links = [["Inicio","/dashboard","grid"],["Socios","/socios","users"],["Pagos","/pagos","wallet"],["Reportes","/reportes","chart"],["Configuración","/configuracion","settings"]] as const;
  return <div className="shell"><aside className="sidebar"><div className="brand admin-brand"><img src="/site-assets/logo-blanco-sobre-azul.png" alt="Uniendo Sonrisas"/><div className="brand-copy"><strong>Uniendo Sonrisas</strong><span>Administración<br/>Asociación Civil</span></div></div><div className="nav-label">Panel de gestión</div><nav className="nav">{links.map(([label,href,icon])=><Link className={current===label?"active":""} href={href} key={href}><Icon name={icon}/><span style={{marginLeft:10}}>{label}</span></Link>)}</nav><div className="sidebar-bottom"><PwaInstall/><br/>Fundación Uniendo Sonrisas<br/><span style={{display:"inline-block",marginTop:6}}>Gestión de socios y aportes</span></div></aside><main className="main"><header className="topbar"><div className="crumb">Fundación / <b>{current}</b></div><div className="top-actions"><span className="bell"><Icon name="bell"/></span><div className="user-chip"><div className="avatar">AD</div><span>Admin Fundación</span></div></div></header>{children}</main></div>;
}
