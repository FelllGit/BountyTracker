"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { LikeStatus } from "@/interfaces/LikeStatus";
import { jwtDecode } from "jwt-decode";
import { CustomJwtPayload } from "@/interfaces/CustomJwtPayload";

interface PatchBugBountyVariables {
  id: string;
  likeStatus: LikeStatus;
}

export const useLikeBugBounty = () => {
  const queryClient = useQueryClient();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const url = new URL(`${backendUrl}/w3-bug-bounties`);

  const jwt = localStorage.getItem("jwt");
  const decoded = jwt ? (jwtDecode(jwt) as CustomJwtPayload) : null;

  return useMutation<void, Error, PatchBugBountyVariables>({
    mutationFn: async ({ id, likeStatus }: PatchBugBountyVariables) => {
      await axios.put(
        `${url}/${id}/likes`,
        { userID: decoded?.sub, likeStatus },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["w3-bug-bounties"] });
    },
    onError: (error: Error) => {
      console.error("Failed to update Bug Bounty languages:", error.message);
      queryClient.invalidateQueries({ queryKey: ["w3-bug-bounties"] });
    },
  });
};
