export interface CrowdsourcedAudit {
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
  endDate: string;
  evaluationEndDate: string;
  status: string;
  likes: string[];
  dislikes: string[];
}

export enum AuditStatus {
  UNKNOWN = "Unknown",
  UPCOMING = "Upcoming",
  ONGOING = "Ongoing",
  EVALUATING = "Evaluating",
  FINISHED = "Finished",
}
