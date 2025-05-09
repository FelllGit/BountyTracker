import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./app.css";
import Header from "@/app/header";
import Footer from "@/app/footer";
import { Providers } from "@/app/providers";
import "./app.css";
import { Toaster } from "@/components/ui/toaster";
import Script from "next/script";

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
  title: "VigilSeek - Audit Competitions",
  description:
    "Vigilseek – The ultimate bug bounty and crowdsourced contest aggregator. Track bounties from platforms like Cantina, HackenProof, Immunefi, Sherlock, CodeHawks, and Code4rena — all in one place.",
  keywords:
    "VigilSeek, bug bounty, audit competition, security aggregator, web3 crowdsourced contest, Cantina, HackenProof, Immunefi, Sherlock, CodeHawks, Code4rena",
  openGraph: {
    title: "VigilSeek - Audit Competitions",
    description:
      "Vigilseek – The ultimate bug bounty and crowdsourced contest aggregator. Track bounties from platforms like Cantina, HackenProof, Immunefi, Sherlock, CodeHawks, and Code4rena — all in one place.",
    type: "website",
    url: "https://www.vigilseek.com",
    siteName: "VigilSeek - Audit Competitions",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="16x16" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen !min-w-full`}
      >
        <Script
          id="clarity-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "qdy38m6ssg");`,
          }}
        />
        <Providers>
          <Header />
          <main className="max-w-full flex-grow flex flex-col p-10 px-2 md:px-16 2xl:px-44 mt-16">
            {children}
          </main>
          <Toaster />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
