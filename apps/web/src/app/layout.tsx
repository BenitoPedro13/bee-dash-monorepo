import "./globals.css";
import type { Metadata } from "next";

import localFont from "next/font/local";
import Wrapper from "./wrapper";
import { Suspense } from "react";

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
      <body className={`${nexa.variable} ${nexaBold.variable}`}>
        <Wrapper>{children}</Wrapper>
      </body>
    </html>
  );
}
