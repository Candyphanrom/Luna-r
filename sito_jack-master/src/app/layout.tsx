import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    template: "%s | LUN/R - Future of Manufacturing",
    default: "LUN/R - Precision 3D Printed Artifacts",
  },
  description: "LUN/R specializes in precision engineered 3D printed artifacts, cyberpunk aesthetics, and custom tech accessories. From digital dreams to physical reality.",
  keywords: ["3D printing", "Cyberpunk", "Tech accessories", "Custom 3D printed statue", "Mechanical keyboard parts", "LUN/R"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased font-sans`} suppressHydrationWarning>
        <CartProvider>
          <CartDrawer />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
