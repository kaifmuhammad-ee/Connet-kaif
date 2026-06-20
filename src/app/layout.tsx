import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "600", "700"],
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
        className={`${outfit.variable} ${playfair.variable} font-sans antialiased bg-[#F5F0E6] text-black`}
      >
        {children}
      </body>
    </html>
  );
}
