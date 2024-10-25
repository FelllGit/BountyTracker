import "./app.css";

import CrowdsourcedAudits from "@/components/home/CrowdSourcedAudits/CrowdsourcedAudits";
import CrowdsourcedAuditsTable from "@/components/home/CrowdSourcedAudits/CrowdsourcedAuditsTable";
import Head from "next/head";

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
      <div className="flex flex-col gap-8">
        <CrowdsourcedAudits />
        <CrowdsourcedAuditsTable />
      </div>
    </>
  );
}
