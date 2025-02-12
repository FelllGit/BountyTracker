"use client";

import { AuditStatus } from "@/interfaces/CrowdsourcedAudit";

export interface FiltersProps {
  search?: string;
  handleSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  languages?: string[];
  setLanguages?: React.Dispatch<React.SetStateAction<string[]>>;
  allLanguages?: string[];
  platforms?: string[];
  setPlatforms?: React.Dispatch<React.SetStateAction<string[]>>;
  allPlatforms?: string[];
  statuses?: AuditStatus[];
  setStatuses?: React.Dispatch<React.SetStateAction<AuditStatus[]>>;
  startDate?: Date | null;
  endDate?: Date | null;
  setStartDate?: React.Dispatch<React.SetStateAction<Date | null>>;
  setEndDate?: React.Dispatch<React.SetStateAction<Date | null>>;
  maxReward?: number;
  handleMaxRewardChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  variant?: "default" | "alternative";
}
