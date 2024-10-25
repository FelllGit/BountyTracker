import "./app.css";

import CrowdsourcedAudits from "@/components/home/CrowdSourcedAudits/CrowdsourcedAudits";
import CrowdsourcedAuditsTable from "@/components/home/CrowdSourcedAudits/CrowdsourcedAuditsTable";

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <CrowdsourcedAudits />
      <CrowdsourcedAuditsTable />
    </div>
  );
}
