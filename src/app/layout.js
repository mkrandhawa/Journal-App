import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import MobileNav from "@/components/MobileNav";
SessionProviderWrapper


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "My Journal",
  description: "Jounal App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} >
        <SessionProviderWrapper >
          <div className="flex">
            
            <Sidebar />
            <MobileNav />
            <main className="flex-1
                ml-0 md:ml-64
                p-4 md:p-8
                bg-gray-50
                min-h-screen
                pb-20 md:pb-0">
              {children}
            </main>
          </div>
        </SessionProviderWrapper >
      </body>
    </html>
  );
}
