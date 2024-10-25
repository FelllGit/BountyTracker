import { useQuery } from "@tanstack/react-query";
import { BugBounty } from "@/interfaces/BugBounty";

const fetchW3BugBounties = async (
  search?: string,
  platform?: string,
  maxReward?: number,
  languages?: string[],
  startDate?: string
): Promise<BugBounty[]> => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const url = new URL(`${backendUrl}/w3-bug-bounties`);

  url.searchParams.set("order", "DESC");
  url.searchParams.set("sort", "startDate");
  if (search) url.searchParams.set("search", search);
  if (platform) url.searchParams.set("platform", platform);
  if (maxReward) url.searchParams.set("maxReward", maxReward.toString());
  if (startDate) url.searchParams.set("startDate", startDate);

  if (languages) {
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

  return response.json();
};

export const useGetW3BugBounties = (
  search?: string,
  platform?: string,
  maxReward?: number,
  languages?: string[],
  startDate?: string
) => {
  return useQuery({
    // eslint-disable-next-line no-restricted-syntax
    queryKey: [
      "w3-bug-bounties",
      search,
      platform,
      maxReward,
      languages,
      startDate,
    ],
    queryFn: () =>
      fetchW3BugBounties(search, platform, maxReward, languages, startDate),
  });
};
