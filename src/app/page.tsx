import "./app.css";

import CrowdsourcedAudits from "@/components/home/CrowdSourcedAudits/CrowdsourcedAudits";
import CrowdsourcedAuditsTable from "@/components/home/CrowdSourcedAudits/CrowdsourcedAuditsTable";
import Head from "next/head";
import Script from "next/script";

export default function Home() {
  return (
    <>
      <Head>
        <title>Home - Crowdsourced Audits</title>
        <meta
          name="description"
          content="Welcome to the Crowdsourced Audits platform."
        />
        <meta name="keywords" content="audits, crowdsourcing, home" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-2ZQDPC578G"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-2ZQDPC578G');
          `,
        }}
      />
      <div className="flex flex-col gap-8">
        <CrowdsourcedAudits />
        <CrowdsourcedAuditsTable />
      </div>
    </>
  );
}
