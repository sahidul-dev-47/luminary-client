import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata = {
  title: "Luminary — Read · Discover · Shine",
  description:
    "Luminary is a premium ebook sharing platform connecting readers with talented writers from around the world.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0D0D1A] text-[#F8FAFC]">
        <Navbar />
        <main className="flex-1 pt-16">{children}</main>
        <Footer></Footer>
      </body>
    </html>
  );
}
