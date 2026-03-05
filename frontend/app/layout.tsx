import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ClientWrapper } from "./client-wrapper";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aviation Parts - AeroGestor",
  description: "Sistema de Gerenciamento Industrial",
  icons: {
    icon: [
      {
        url: "/logo.png",
        sizes: "any",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const originalError = console.error;
                console.error = function(...args) {
                  const msg = String(args[0] || '');
                  if (msg.includes('Blocked aria-hidden on an element')) {
                    return;
                  }
                  originalError.apply(console, args);
                };
              })();
            `,
          }}
        />
      </head>
      <body className={`font-sans antialiased`}>
        <ClientWrapper>
          {children}
        </ClientWrapper>
        <Analytics />
      </body>
    </html>
  );
}
