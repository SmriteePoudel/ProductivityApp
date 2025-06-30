import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Productivity Hub - Task Management App",
  description:
    "A modern task management and productivity app to help you stay organized and focused.",
  keywords: [
    "productivity",
    "task management",
    "todo",
    "organization",
    "time management",
  ],
  authors: [{ name: "Productivity Hub Team" }],
};

export const viewport = "width=device-width, initial-scale=1";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
