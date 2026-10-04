import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Uniendo Sonrisas | Gestión",
    short_name: "Uniendo Sonrisas",
    description: "Gestión de socios y pagos de la Fundación Uniendo Sonrisas",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#f6f8fb",
    theme_color: "#0e2347",
    lang: "es",
    icons: [
      { src: "/site-assets/logo-icon.png", sizes: "175x180", type: "image/png", purpose: "any" },
    ],
  };
}
