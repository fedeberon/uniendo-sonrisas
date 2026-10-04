"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };

export function PwaInstall() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [installed, setInstalled] = useState(false);
  useEffect(() => { const onBeforeInstall = (event: Event) => { event.preventDefault(); setInstallPrompt(event as BeforeInstallPromptEvent); }; const onInstalled = () => setInstalled(true); window.addEventListener("beforeinstallprompt", onBeforeInstall); window.addEventListener("appinstalled", onInstalled); navigator.serviceWorker?.register("/sw.js").catch(() => undefined); return () => { window.removeEventListener("beforeinstallprompt", onBeforeInstall); window.removeEventListener("appinstalled", onInstalled); }; }, []);
  if (installed) return null;
  const install = async () => { if (!installPrompt) { setHelpOpen(true); return; } await installPrompt.prompt(); const choice = await installPrompt.userChoice; if (choice.outcome === "accepted") setInstallPrompt(null); };
  return <><button className="pwa-install" onClick={install}>＋ Instalar en el teléfono</button>{helpOpen && <div className="modal-backdrop" onClick={() => setHelpOpen(false)}><div className="card pwa-help" onClick={(event) => event.stopPropagation()}><button className="close" onClick={() => setHelpOpen(false)}>×</button><div className="card-title">Agregar Uniendo Sonrisas</div><p>Desde Android o Chrome, elegí “Instalar aplicación” o “Agregar a pantalla de inicio”.</p><p>En iPhone: tocá <strong>Compartir</strong> en Safari y elegí <strong>Agregar a pantalla de inicio</strong>.</p><button className="primary" onClick={() => setHelpOpen(false)}>Entendido</button></div></div>}</>;
}
