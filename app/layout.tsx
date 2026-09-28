import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Archivo } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "Jadwal Gerak",
    template: "%s | Jadwal Gerak",
  },
  description:
    "Informasi jadwal event olahraga di Indonesia: fun run, maraton, trail run, gowes, renang, dan turnamen komunitas.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className={`${plusJakartaSans.variable} ${archivo.variable} antialiased`}>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
