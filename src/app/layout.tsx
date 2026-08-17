import type { Metadata } from "next";
import { Cairo, Tajawal } from "next/font/google";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  variable: "--font-tajawal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "شاء فولدنا بكلمة الحق",
  description: "منصة لاهوتية تعتني بنشر كلمة الحق من خلال دراسات كتابية، وتأملات روحية، وترجمات لكتب لاهوتية",
};

import Script from 'next/script';
import HashScroll from "@/components/HashScroll";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${tajawal.variable}`}>
      <body>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-M5W2WHH2VY" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-M5W2WHH2VY');
          `}
        </Script>
        <HashScroll />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
