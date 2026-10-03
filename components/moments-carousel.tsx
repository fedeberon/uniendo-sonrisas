"use client";
import { useState } from "react";

const moments = [
  { image:"https://presentenoticias-s3.cdn.net.ar/s3i233/2026/09/presentenoticias/images/02/75/27/2752707_2e2bd2cc026f7a8b5b15d7a9c5f15d19f1f8d9e8023b645373b6363e6a6ec18c/md.webp", title:"Jugar también es aprender", text:"Materiales y juegos que llegan a instituciones de Bolívar." },
  { image:"https://presentenoticias-s3.cdn.net.ar/s3i233/2026/01/presentenoticias/images/02/44/62/2446279_d15cfe5e558f965a862dce92f87578e06dd1edf3efab24c000f8f9fa6df8aead/md.webp", title:"Encuentros que dejan huella", text:"El Mundialito Nico Treviño reúne deporte, familias y solidaridad." },
  { image:"https://www.bolivar.gob.ar/imagenes/20230119182359-el-municipio-acompaa-el-desarrollo-del.jpg", title:"Una comunidad que se encuentra", text:"Cada actividad se construye con instituciones, clubes y vecinos." },
];

export function MomentsCarousel(){ const [current,setCurrent]=useState(0); const moment=moments[current]; const move=(step:number)=>setCurrent((current+step+moments.length)%moments.length); return <section id="momentos" className="moments-section"><div className="moments-copy"><div className="section-label">Momentos que nos unen</div><h2>La alegría también se organiza.</h2><p>Una pequeña selección de imágenes públicas de actividades y encuentros de Uniendo Sonrisas. Para ver más momentos, visitá nuestras redes.</p><a className="inst-button" href="https://www.instagram.com/uniendosonrisas/" target="_blank" rel="noreferrer">Ver Instagram ↗</a><div className="carousel-controls"><button onClick={()=>move(-1)} aria-label="Imagen anterior">←</button><span>{String(current+1).padStart(2,"0")} / {String(moments.length).padStart(2,"0")}</span><button onClick={()=>move(1)} aria-label="Imagen siguiente">→</button></div></div><div className="moment-frame"><img src={moment.image} alt={moment.title}/><div className="moment-caption"><strong>{moment.title}</strong><span>{moment.text}</span></div></div></section>; }
