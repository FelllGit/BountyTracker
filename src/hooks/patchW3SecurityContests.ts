import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface PatchSecurityContestVariables {
  id: string;
  languages: string[];
}

export const usePatchSecurityContestLanguages = () => {
  const queryClient = useQueryClient();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const url = new URL(`${backendUrl}/w3-security-contests`);

  return useMutation<void, Error, PatchSecurityContestVariables>({
    mutationFn: async ({
      id,
      languages,
    }: PatchSecurityContestVariables): Promise<void> => {
      await axios.patch(`${url}/${id}/languages`, { languages });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["w3-security-contests"] });
    },
    onError: (error: Error) => {
      console.error("Failed to update languages:", error.message);
    },
  });
};
