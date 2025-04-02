import { useQuery } from "@tanstack/react-query";
import { PlatformData } from "@/interfaces/PlatformData";
import { ELanguagesNames } from "@/interfaces/LanguagesNames";

const fetchW3SecurityContestsAmountByLanguageBB = async (): Promise<
  PlatformData<Record<string, ELanguagesNames>>[]
> => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const url = new URL(
    `${backendUrl}/charts/w3-bug-bounties/amount-by-language`
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
  const data: PlatformData<Record<string, ELanguagesNames>>[] =
    await response.json();
  return data;
};

export const useGetW3SecurityContestsAmountByLanguageBB = () => {
  return useQuery({
    // eslint-disable-next-line no-restricted-syntax
    queryKey: ["w3-security-contests-amount-by-language-bb"],
    queryFn: fetchW3SecurityContestsAmountByLanguageBB,
  });
};
