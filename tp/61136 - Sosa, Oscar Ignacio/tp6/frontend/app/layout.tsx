import type { Metadata } from "next";
import "./globals.css";
import "./styles.css";
import { CarritoProvider } from "./context/CarritoContext";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "TP6 Shop - Tienda Online",
  description: "Compra los mejores productos en línea",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" }}>
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
