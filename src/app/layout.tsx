import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./app.css";
import Header from "@/app/header";
import Footer from "@/app/footer";
import { Providers } from "@/app/providers";
import "./app.css";
import LandscapeMode from "@/components/home/LandscapeMode";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "VigilSeek - Crowdsourced Audits",
  description:
    "VigilSeek offers crowdsourced security audits, empowering a community to collaborate on securing digital platforms. Join us to contribute to security and transparency.",
  keywords:
    "VigilSeek, crowdsourced audits, security, community, vulnerability discovery, cybersecurity",
  openGraph: {
    title: "VigilSeek - Crowdsourced Audits",
    description:
      "Join VigilSeek to participate in crowdsourced security audits and enhance the security of digital platforms through collaboration.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VigilSeek - Crowdsourced Audits",
    description:
      "Collaborate on security audits with VigilSeek's community for a safer digital world.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen !min-w-full`}
      >
        <LandscapeMode />
        <Providers>
          <Header />
          <main className="max-w-full flex-grow flex flex-col p-10 px-20 xl:px-44 mt-16">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
