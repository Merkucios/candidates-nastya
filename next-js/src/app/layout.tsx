import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ИНСТРУКТАЖ | КГБНОУ КДЦ Созвездие",
  description: "Обучение и аттестация вожатых",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
