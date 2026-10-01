import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "EWARI",
    short_name: "EWARI",
    description: "Style that feels like you.",
    start_url: "/",
    display: "standalone",
    background_color: "#F7F3EC",
    theme_color: "#2A211D",
    orientation: "portrait",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }
    ],
  };
}
