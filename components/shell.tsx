"use client";

import Link from "next/link";
import type React from "react";
import { useState } from "react";
import { Icon } from "./icons";
import { PwaInstall } from "./pwa-install";

export function Shell({ children, current = "Inicio" }: { children: React.ReactNode; current?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [["Inicio","/dashboard","grid"],["Socios","/socios","users"],["Pagos","/pagos","wallet"],["Reportes","/reportes","chart"],["Configuración","/configuracion","settings"]] as const;
  const toggleMenu = (event: React.SyntheticEvent<HTMLButtonElement>) => { event.stopPropagation(); setMenuOpen((value) => !value); };
  return <div className="shell"><button type="button" className="mobile-menu-button" aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"} aria-expanded={menuOpen} aria-controls="mobile-sidebar" onPointerDown={toggleMenu} onClick={(event) => event.stopPropagation()}><span/><span/><span/></button>{menuOpen && <button type="button" className="mobile-menu-overlay" aria-label="Cerrar menú" onClick={() => setMenuOpen(false)}/>}<aside id="mobile-sidebar" className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}><div className="brand admin-brand"><div className="admin-logo-frame"><img src="/site-assets/logo-blanco-sobre-azul.png" alt="Uniendo Sonrisas"/></div><div className="brand-copy"><strong>Uniendo Sonrisas</strong><span>Administración<br/>Asociación Civil</span></div></div><div className="nav-label">Panel de gestión</div><nav className="nav">{links.map(([label,href,icon])=><Link onClick={() => setMenuOpen(false)} className={current===label?"active":""} href={href} key={href}><Icon name={icon}/><span style={{marginLeft:10}}>{label}</span></Link>)}</nav><div className="sidebar-bottom"><PwaInstall/><br/>Fundación Uniendo Sonrisas<br/><span style={{display:"inline-block",marginTop:6}}>Gestión de socios y aportes</span></div></aside><main className="main"><header className="topbar"><div className="crumb">Fundación / <b>{current}</b></div><div className="top-actions"><span className="bell"><Icon name="bell"/></span><div className="user-chip"><div className="avatar">AD</div><span>Admin Fundación</span></div></div></header>{children}</main></div>;
}
