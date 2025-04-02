import { useQuery } from "@tanstack/react-query";
import { PlatformData } from "@/interfaces/PlatformData";
import { EPlatformName } from "@/interfaces/PlatformNames";

const fetchW3SecurityContestsRewardByPlatformBB = async (): Promise<
  PlatformData<Record<string, EPlatformName>>[]
> => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const url = new URL(
    `${backendUrl}/charts/w3-bug-bounties/reward-by-platform`
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
  const data: PlatformData<Record<string, EPlatformName>>[] =
    await response.json();
  return data;
};

export const useGetW3SecurityContestsRewardByPlatformBB = () => {
  return useQuery({
    // eslint-disable-next-line no-restricted-syntax
    queryKey: ["w3-security-contests-reward-by-platform-bb"],
    queryFn: fetchW3SecurityContestsRewardByPlatformBB,
  });
};
