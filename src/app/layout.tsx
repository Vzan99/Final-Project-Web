import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CustomToastContainer from "@/components/customToastContainer";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import StoreProvider from "@/components/storeProvider";
import AuthProvider from "@/components/authProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Precise",
  description: "Your better future",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreProvider>
          <AuthProvider>
            <Navbar />
            <CustomToastContainer />
            {children}
            <Footer />
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
