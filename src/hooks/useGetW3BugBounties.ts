import { useQuery } from "@tanstack/react-query";
import { BugBounty } from "@/interfaces/BugBounty";

const fetchW3BugBounties = async (
  search?: string,
  platforms?: string[],
  maxReward?: number,
  languages?: string[],
  startDate?: string,
  excludeLanguages?: boolean
): Promise<BugBounty[]> => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const url = new URL(`${backendUrl}/w3-bug-bounties`);

  url.searchParams.set("order", "DESC");
  url.searchParams.set("sort", "startDate");
  if (search) url.searchParams.set("search", search);
  if (maxReward) url.searchParams.set("maxReward", maxReward.toString());
  if (startDate) url.searchParams.set("startDate", startDate);
  if (excludeLanguages) url.searchParams.set("excludeLanguages", "true");

  if (platforms) {
    for (const platform of platforms) {
      url.searchParams.append("platforms", platform);
    }
  }

  if (!excludeLanguages && languages) {
    for (const language of languages) {
      url.searchParams.append("languages", language);
    }
  }

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

  const data: BugBounty[] = await response.json();
  const today: Date = new Date();
  return data.filter(
    (bug: BugBounty): boolean => new Date(bug.startDate) <= today
  );
};

export const useGetW3BugBounties = (
  search?: string,
  platforms?: string[],
  maxReward?: number,
  languages?: string[],
  startDate?: string,
  excludeLanguages?: boolean
) => {
  return useQuery({
    // eslint-disable-next-line no-restricted-syntax
    queryKey: [
      "w3-bug-bounties",
      search,
      platforms,
      maxReward,
      languages,
      startDate,
      excludeLanguages,
    ],
    queryFn: () =>
      fetchW3BugBounties(
        search,
        platforms,
        maxReward,
        languages,
        startDate,
        excludeLanguages
      ),
  });
};
