import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "شاء فولدنا بكلمة الحق",
  description: "منصة لاهوتية تعتني بنشر كلمة الحق من خلال دراسات كتابية، وتأملات روحية، وترجمات لكتب لاهوتية",
};

import HashScroll from "@/components/HashScroll";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body>
        <HashScroll />
        <Navbar />
        <div className="layout-container">
          <aside className="layout-sidebar">
            <Sidebar />
          </aside>
          <main className="layout-main">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
