import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vidya IT Services - Web Development, CCTV, Digital Marketing | Hapur UP",
  description: "Vidya IT Services - Hapur's trusted IT company since 2016. Web Development, CCTV Installation, Digital Marketing, Hardware & Cloud Solutions.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
