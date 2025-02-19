"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AuthCallbackContent() {
  const router = useRouter();
  const params = useSearchParams();
  const jwt = params.get("jwt");

  useEffect(() => {
    if (jwt) {
      localStorage.setItem("jwt", jwt);
      window.dispatchEvent(new Event("jwt-updated"));
      router.push("/");
    } else {
      console.error("JWT is missing");
      router.push("/");
    }
  }, [jwt, router]);

  return (
    <div className="flex flex-col items-center justify-center flex-1">
      <p className="mb-4 text-lg font-semibold">
        Please wait, authorization is in progress...
      </p>
      <div className="w-12 h-12 rounded-full border-4 border-t-transparent border-[var(--card-foreground)] animate-spin"></div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center flex-1">
          <div className="w-12 h-12 rounded-full border-4 border-t-transparent border-[var(--card-foreground)] animate-spin"></div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
