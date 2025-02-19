"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { CustomJwtPayload } from "@/interfaces/CustomJwtPayload";
import { LikeStatus } from "@/interfaces/LikeStatus";

interface PatchSecurityContestVariables {
  id: string;
  likeStatus: LikeStatus;
}

export const useLikeSecurityContest = () => {
  const queryClient = useQueryClient();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const url = new URL(`${backendUrl}/w3-security-contests`);

  const [jwt, setJwt] = useState<string | null>(null);
  const [decoded, setDecoded] = useState<CustomJwtPayload | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedJwt = localStorage.getItem("jwt");
      setJwt(storedJwt);
      setDecoded(storedJwt ? (jwtDecode(storedJwt) as CustomJwtPayload) : null);
    }
  }, []);

  return useMutation<void, Error, PatchSecurityContestVariables>({
    mutationFn: async ({ id, likeStatus }: PatchSecurityContestVariables) => {
      if (!jwt) throw new Error("JWT is missing");

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
      queryClient.invalidateQueries({ queryKey: ["w3-security-contests"] });
    },
    onError: (error: Error) => {
      console.error("Failed to update Security Contest likes:", error.message);
    },
  });
};
