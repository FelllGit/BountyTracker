import { useQuery } from "@tanstack/react-query";
import { SecurityContestData } from "@/interfaces/PlatformData";
import { ELanguagesNames } from "@/interfaces/LanguagesNames";

const fetchW3SecurityContestsAmountByLanguage = async (): Promise<
  SecurityContestData<Record<string, ELanguagesNames>>
> => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const url = new URL(
    `${backendUrl}/charts/w3-security-contests/amount-by-language`
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

export const useGetW3SecurityContestsAmountByLanguage = () => {
  return useQuery({
    // eslint-disable-next-line no-restricted-syntax
    queryKey: ["w3-security-contests-amount-by-language"],
    queryFn: fetchW3SecurityContestsAmountByLanguage,
  });
};
