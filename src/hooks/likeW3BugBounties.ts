"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { LikeStatus } from "@/interfaces/LikeStatus";

interface PatchBugBountyVariables {
  id: string;
  likeStatus: LikeStatus;
}

export const useLikeBugBounty = () => {
  const queryClient = useQueryClient();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const url = new URL(`${backendUrl}/w3-bug-bounties`);

  const [jwt, setJwt] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedJwt = localStorage.getItem("jwt");
      setJwt(storedJwt);
    }
  }, []);

  return useMutation<void, Error, PatchBugBountyVariables>({
    mutationFn: async ({ id, likeStatus }: PatchBugBountyVariables) => {
      if (!jwt) throw new Error("JWT is missing");

      await axios.put(
        `${url}/${id}/likes`,
        { likeStatus },
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
      console.error("Failed to update Bug Bounty likes:", error.message);
    },
  });
};
