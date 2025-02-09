import { Inter } from "next/font/google";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Workout",
  description: "Training App ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <link rel="icon" sizes="180x180" href="/favicon.png" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="blue" />
      <link rel="apple-touch-icon" sizes="180x180" href="/favicon.png" />
      <link rel="manifest" href="/manifest.json" />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      <body className={inter.className}>{children}</body>
    </html>
  );
}
