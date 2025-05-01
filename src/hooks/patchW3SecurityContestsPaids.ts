"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface PatchSecurityContestVariables {
  id: string;
  paid: number;
}

export const usePatchSecurityContestPaids = () => {
  const queryClient = useQueryClient();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const url = new URL(`${backendUrl}/w3-security-contests`);

  return useMutation<void, Error, PatchSecurityContestVariables>({
    mutationFn: async ({ id, paid }: PatchSecurityContestVariables) => {
      const authPassword = localStorage.getItem("admin-password");

      await axios.put(
        `${url}/${id}/paid`,
        { paid },
        {
          headers: {
            "X-Auth-Password": authPassword,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["w3-security-contests"] });
    },
    onError: (error: Error) => {
      console.error("Failed to update languages:", error.message);
    },
  });
};
