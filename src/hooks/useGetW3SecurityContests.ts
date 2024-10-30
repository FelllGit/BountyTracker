import { useQuery } from "@tanstack/react-query";
import { AuditStatus, CrowdsourcedAudit } from "@/interfaces/CrowdsourcedAudit";

const fetchW3SecurityContests = async (
  search?: string,
  languages?: string[],
  platforms?: string[],
  startDate?: string,
  endDate?: string,
  status?: AuditStatus,
  maxReward?: number
): Promise<CrowdsourcedAudit[]> => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const url = new URL(`${backendUrl}/w3-security-contests`);

  if (search) url.searchParams.set("search", search);

  if (platforms) {
    for (const platform of platforms) {
      url.searchParams.append("platforms", platform);
    }
  }

  if (languages) {
    for (const language of languages) {
      url.searchParams.append("languages", language);
    }
  }

  if (startDate) url.searchParams.set("startDate", startDate);
  if (endDate) url.searchParams.set("endDate", endDate);
  if (status) url.searchParams.set("status", status.toUpperCase());
  if (maxReward) url.searchParams.set("maxReward", maxReward.toString());

  url.searchParams.set("order", "DESC");

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorMessage = await response.json();
    throw new Error(
      errorMessage.message || "Unknown error while fetching data"
    );
  }

  return response.json();
};

export const useGetW3SecurityContests = (
  search?: string,
  languages?: string[],
  platforms?: string[],
  startDate?: string,
  endDate?: string,
  status?: AuditStatus,
  maxReward?: number
) => {
  return useQuery({
    // eslint-disable-next-line no-restricted-syntax
    queryKey: [
      "w3-security-contests",
      search,
      languages,
      platforms,
      startDate,
      endDate,
      status,
      maxReward,
    ],
    queryFn: () =>
      fetchW3SecurityContests(
        search,
        languages,
        platforms,
        startDate,
        endDate,
        status,
        maxReward
      ),
  });
};
