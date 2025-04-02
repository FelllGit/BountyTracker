import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BountyByPlatform } from "@/components/charts/StatsCharts/CrowdsourcedAuditsCharts/BountyByPlatform";
import { BountyByLanguage } from "@/components/charts/StatsCharts/CrowdsourcedAuditsCharts/BountyByLanguage";
import { AmountByLanguage } from "@/components/charts/StatsCharts/CrowdsourcedAuditsCharts/AmountByLanguage";
import { AmountByPlatform } from "@/components/charts/StatsCharts/CrowdsourcedAuditsCharts/AmountByPlatform";
import { BountyByLanguageBB } from "@/components/charts/StatsCharts/BugBountiesCharts/BountyByLanguage";
import { BountyByPlatformBB } from "@/components/charts/StatsCharts/BugBountiesCharts/BountyByPlatform";
import { AmountByLanguageBB } from "@/components/charts/StatsCharts/BugBountiesCharts/AmountByLanguage";
import { AmountByPlatformBB } from "@/components/charts/StatsCharts/BugBountiesCharts/AmountByPlatform";

export default function Charts() {
  return (
    <Tabs defaultValue="crowdsourced_audits" className="pb-2">
      <TabsList className="flex justify-center bg-transparent p-0">
        <div className="bg-muted p-1 rounded-lg">
          <TabsTrigger value="crowdsourced_audits">
            Crowdsourced Audits
          </TabsTrigger>
          <TabsTrigger value="bug_bounties">Bug Bounties</TabsTrigger>
        </div>
      </TabsList>
      <TabsContent value="crowdsourced_audits">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
          <BountyByLanguage />
          <BountyByPlatform />
          <AmountByLanguage />
          <AmountByPlatform />
        </div>
      </TabsContent>
      <TabsContent value="bug_bounties">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
          <BountyByLanguageBB />
          <BountyByPlatformBB />
          <AmountByLanguageBB />
          <AmountByPlatformBB />
        </div>
      </TabsContent>
    </Tabs>
  );
}
