import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import VoiceAssistant from "@/components/VoiceAssistant";

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Bihar Tourism - Smart Digital Platform for Eco & Cultural Tourism",
  description: "Discover the rich heritage and natural beauty of Bihar. Experience eco-tourism and cultural tourism in the land of enlightenment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${poppins.className} antialiased`}>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen pb-20 md:pb-0">{children}</main>
          <VoiceAssistant />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
