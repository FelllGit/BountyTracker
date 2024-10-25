export interface BugBounty {
  id: string;
  project: string;
  slug: string;
  platform: string;
  imageUrl: string;
  originalUrl: string;
  languages: string[];
  maxReward: number;
  rewardsPool: number;
  rewardsToken: string;
  startDate: string;
}
