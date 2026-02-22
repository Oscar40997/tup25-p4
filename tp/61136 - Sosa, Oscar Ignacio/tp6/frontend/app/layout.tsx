import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { CarritoProvider } from "./context/CarritoContext";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShopHub - Tienda Online",
  description: "Compra los mejores productos en línea",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${roboto.variable} antialiased bg-gray-50`}>
        <AuthProvider>
          <CarritoProvider>
            <Navbar />
            {children}
          </CarritoProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
