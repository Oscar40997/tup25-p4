import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { CarritoProvider } from "./context/CarritoContext";
import Navbar from "./components/Navbar";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "E-Commerce",
  description: "Sitio de comercio electrónico con Next.js y FastAPI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${roboto.variable} antialiased bg-gray-50`}>
        <CarritoProvider>
          <Navbar />
          {children}
        </CarritoProvider>
      </body>
    </html>
  );
}
