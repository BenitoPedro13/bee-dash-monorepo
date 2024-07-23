import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Plus_Jakarta_Sans } from "next/font/google";

import localFont from "@next/font/local";

const nexa = localFont({
  src: [
    {
      path: "../../public/fonts/NexaRegular.otf",
      weight: "400",
    },
    {
      path: "../../public/fonts/NexaBold.otf",
      weight: "700",
    },
  ],
  variable: "--font-nexa",
});

const nexaBold = localFont({
  src: [
    {
      path: "../../public/fonts/Nexa-Bold.otf",
      weight: "700",
    },
  ],
  variable: "--font-nexa-bold",
});

const inter = Inter({ subsets: ["latin"] });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bee Company Dash",
  description:
    "Monitore todos os seus projetos criativos em uma experiência mágica e suculenta",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
