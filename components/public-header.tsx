import Link from "next/link";

export function PublicHeader() { return <header className="public-header"><Link href="/institucional" className="public-brand"><span className="brand-mark">✦</span><span>Uniendo <em>Sonrisas</em></span></Link><nav className="public-nav"><Link href="/institucional#quienes-somos">Quiénes somos</Link><Link href="/institucional#acciones">Acciones</Link><Link href="/institucional/comision-directiva">Comisión directiva</Link></nav><Link href="/dashboard" className="public-panel">Panel de socios <span>↗</span></Link></header>; }
