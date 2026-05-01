import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import Footer from "../components/Footer";
import "./globals.css";

const kanit = Kanit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-kanit",
});

export const metadata: Metadata = {
  title: "Manage Task App",
  description: "Task Management Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${kanit.className} bg-gray-100 min-h-screen text-black`}>
        <div className="min-h-screen flex flex-col">
          <main className="flex-1 p-5">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}