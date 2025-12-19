import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} >
        <SessionProviderWrapper >
          <div className="flex">
            
            <Sidebar />
            <main className="flex-1 ml-64 p-8 bg-gray-50 min-h-screen">
              {children}
            </main>
          </div>
        </SessionProviderWrapper >
      </body>
    </html>
  );
}
