import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500"],
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
        className={`${inter.variable} font-sans antialiased bg-[#F5F0E6] text-black`}
      >
        {children}
      </body>
    </html>
  );
}
