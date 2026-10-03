import type React from "react";

export function Icon({ name }: { name: "grid"|"users"|"wallet"|"chart"|"settings"|"bell"|"arrow"|"plus"|"search" }) {
  const paths: Record<string, React.ReactNode> = {
    grid:<><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    users:<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    wallet:<><rect x="2" y="5" width="20" height="15" rx="2"/><path d="M2 10h20M16 15h.01"/></>,
    chart:<><path d="M3 3v18h18"/><path d="m7 16 4-5 3 3 5-7"/></>,
    settings:<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.42 1.42-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V20h-2v-.48A1.7 1.7 0 0 0 12.38 18a1.7 1.7 0 0 0-1.88.34l-.06.06-1.42-1.42.06-.06A1.7 1.7 0 0 0 9.42 15 1.7 1.7 0 0 0 8 14H7v-2h1a1.7 1.7 0 0 0 1.42-1 1.7 1.7 0 0 0-.34-1.88l-.06-.06 1.42-1.42.06.06A1.7 1.7 0 0 0 13.38 8c.62-.25 1.03-.86 1.03-1.52V6h2v.48A1.7 1.7 0 0 0 17.44 8a1.7 1.7 0 0 0 1.88-.34l.06-.06 1.42 1.42-.06.06A1.7 1.7 0 0 0 20.4 11H21v2h-.6a1.7 1.7 0 0 0-1 2Z"/></>,
    bell:<><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></>,
    arrow:<><path d="M5 12h14M13 6l6 6-6 6"/></>, plus:<><path d="M12 5v14M5 12h14"/></>, search:<><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>
  };
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
