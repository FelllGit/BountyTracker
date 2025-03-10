"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface PatchBugBountyVariables {
  id: string;
  languages: string[];
}

export const usePatchBugBountyLanguages = () => {
  const queryClient = useQueryClient();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const url = new URL(`${backendUrl}/w3-bug-bounties`);

  return useMutation<void, Error, PatchBugBountyVariables>({
    mutationFn: async ({ id, languages }: PatchBugBountyVariables) => {
      const authPassword = localStorage.getItem("admin-password");

      await axios.put(
        `${url}/${id}/languages`,
        { languages },
        {
          headers: {
            "X-Auth-Password": authPassword,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["w3-bug-bounties"] });
    },
    onError: (error: Error) => {
      console.error("Failed to update Bug Bounty languages:", error.message);
    },
  });
};
