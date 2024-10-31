import BugBountyTable from "@/components/home/bugBunty/BugBounty";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VigilSeek - Bug Bounty Programs",
  description:
    "Explore and participate in various bug bounty programs through VigilSeek. Find vulnerabilities, earn rewards, and contribute to a safer digital space.",
  keywords:
    "vigilseek, bug bounty, cyber security, vulnerability, ethical hacking, rewards, security audits, penetration testing",
  openGraph: {
    title: "VigilSeek - Bug Bounty Programs",
    description:
      "Join VigilSeek's bug bounty community to find and fix vulnerabilities across platforms.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VigilSeek - Bug Bounty Programs",
    description:
      "Participate in VigilSeek's bug bounty programs, earn rewards, and contribute to security.",
  },
};

export default function Page() {
  return (
    <div className="flex flex-col gap-8">
      <BugBountyTable />
    </div>
  );
}
