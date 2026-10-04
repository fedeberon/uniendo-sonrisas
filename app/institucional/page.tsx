import Link from "next/link";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";

const actions = [
  { number: "01", image: "/site-assets/foto-juegos.jpg", title: "Juego y aprendizaje", text: "Acercamos juegos didácticos a escuelas e instituciones para aprender, crear y compartir." },
  { number: "02", image: "/site-assets/foto-deporte.jpg", title: "Deporte y encuentro", text: "Impulsamos espacios donde el deporte construye vínculos, valores y comunidad." },
  { number: "03", image: "/site-assets/foto-comunidad.jpg", title: "Infancias protagonistas", text: "Acompañamos propuestas pensadas por y para niños, niñas, familias e instituciones." },
];

const moments = [
  { image: "/site-assets/foto-sonrisa.jpg", label: "Una comunidad que acompaña" },
  { image: "/site-assets/foto-juegos.jpg", label: "Aprender jugando" },
  { image: "/site-assets/foto-deporte.jpg", label: "Deporte, amistad y valores" },
  { image: "/site-assets/foto-comunidad.jpg", label: "Compartir transforma" },
];

export default function InstitutionalPage() {
  return <main className="civil-site">
    <PublicHeader />
    <section className="civil-hero">
      <div className="civil-hero-copy"><span className="civil-kicker">Asociación Civil · Bolívar</span><h1>Hacer lugar a la infancia es una forma de cambiarlo todo.</h1><p>Trabajamos para que más niños y niñas puedan jugar, aprender, encontrarse y crecer acompañados por su comunidad.</p><div className="civil-actions"><a className="civil-button civil-button-light" href="#que-hacemos">Conocé nuestro trabajo</a><Link className="civil-button civil-button-outline" href="/dashboard">Quiero ser parte</Link></div></div>
      <div className="civil-hero-visual"><div className="civil-logo-card"><img src="/site-assets/logo-blanco-sobre-azul.png" alt="Uniendo Sonrisas Asociación Civil"/></div><div className="civil-hero-photo"><img src="/site-assets/foto-comunidad.jpg" alt="Comunidad reunida en una actividad de Uniendo Sonrisas"/></div></div>
    </section>
    <section className="civil-intro" id="quienes-somos"><div><span className="civil-label">Quiénes somos</span><h2>Una asociación civil que trabaja cerca de las infancias.</h2></div><div><p>Uniendo Sonrisas es una organización de Bolívar que promueve oportunidades de encuentro, juego, educación, deporte y solidaridad.</p><p>Construimos propuestas junto a familias, escuelas, clubes, comedores y organizaciones de la comunidad.</p></div></section>
    <section className="civil-impact"><div><strong>11+</strong><span>Años construyendo comunidad</span></div><div><strong>38</strong><span>Instituciones alcanzadas</span></div><div><strong>14°</strong><span>Edición del Mundialito Nico Treviño</span></div><div><strong>1</strong><span>Propósito: acompañar</span></div></section>
    <section className="civil-work" id="que-hacemos"><div className="civil-section-heading"><div><span className="civil-label">Qué hacemos</span><h2>Acciones que dejan huella.</h2></div><p>Generamos experiencias donde la infancia tiene voz, lugar y posibilidades.</p></div><div className="civil-action-grid">{actions.map((action) => <article className="civil-action-card" key={action.number}><img src={action.image} alt={action.title}/><div><span>{action.number}</span><h3>{action.title}</h3><p>{action.text}</p></div></article>)}</div></section>
    <section className="civil-principles"><div className="civil-principles-image"><img src="/site-assets/foto-sonrisa.jpg" alt="Niña sonriendo durante una actividad comunitaria"/></div><div className="civil-principles-copy"><span className="civil-label">Nuestra manera de hacer</span><h2>El cambio se construye con otros.</h2><div className="civil-principle"><strong>Escuchar</strong><span>Reconocer lo que cada comunidad necesita y poner a las infancias en el centro.</span></div><div className="civil-principle"><strong>Articular</strong><span>Trabajar junto a instituciones, familias y personas que comparten el mismo propósito.</span></div><div className="civil-principle"><strong>Acompañar</strong><span>Sostener procesos y crear espacios de encuentro que puedan crecer en el tiempo.</span></div></div></section>
    <section className="civil-moments" id="momentos"><div className="civil-section-heading"><div><span className="civil-label">Momentos</span><h2>Lo que pasa cuando nos encontramos.</h2></div><a className="civil-text-link" href="https://www.instagram.com/uniendosonrisas/" target="_blank" rel="noreferrer">Ver Instagram oficial ↗</a></div><div className="civil-moment-grid">{moments.map((moment) => <a href="https://www.instagram.com/uniendosonrisas/" target="_blank" rel="noreferrer" key={moment.image}><img src={moment.image} alt={moment.label}/><span>{moment.label}</span></a>)}</div></section>
    <section className="civil-join"><div><span className="civil-label">Sumate</span><h2>Tu tiempo, tus ideas y tu apoyo también transforman realidades.</h2><p>Hay muchas formas de ser parte de una comunidad que acompaña a las infancias.</p></div><Link className="civil-button civil-button-light" href="/dashboard">Quiero ser parte</Link></section>
    <div className="civil-sources">Información institucional e imágenes de actividades: <a href="https://www.presentenoticias.com/" target="_blank" rel="noreferrer">Presente Noticias</a>, <a href="https://www.bolivar.gob.ar/" target="_blank" rel="noreferrer">Municipio de Bolívar</a> e <a href="https://www.instagram.com/uniendosonrisas/" target="_blank" rel="noreferrer">Instagram de Uniendo Sonrisas</a>.</div>
    <PublicFooter />
  </main>;
}
