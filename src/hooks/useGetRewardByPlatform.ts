import { useQuery } from "@tanstack/react-query";
import { SecurityContestData } from "@/interfaces/PlatformData";
import { EPlatformName } from "@/interfaces/PlatformNames";

const fetchW3SecurityContestsRewardByPlatform = async (): Promise<
  SecurityContestData<Record<string, EPlatformName>>
> => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const url = new URL(
    `${backendUrl}/charts/w3-security-contests/reward-by-platform`
  );
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
  return await response.json();
};

export const useGetW3SecurityContestsRewardByPlatform = () => {
  return useQuery({
    // eslint-disable-next-line no-restricted-syntax
    queryKey: ["w3-security-contests-reward-by-platform"],
    queryFn: fetchW3SecurityContestsRewardByPlatform,
  });
};
