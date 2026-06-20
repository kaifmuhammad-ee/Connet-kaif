import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Kaif Muhammad | Serial Entrepreneur & Enquiry Hub",
  description: "Official enquiry portal for Kaif Muhammad. Get in touch regarding Zee Chai, ZeeSip, Eallisto, Kinford School, and Le Weekend ventures.",
  keywords: ["Kaif Muhammad", "Entrepreneur", "Zee Chai", "ZeeSip", "Eallisto", "Enquiry Hub"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${outfit.variable} ${inter.variable} font-sans antialiased bg-[#F5F0E6] text-black`}
      >
        {children}
      </body>
    </html>
  );
}
