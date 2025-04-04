"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ImTelegram } from "react-icons/im";
import { BsTwitterX } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/utils/useTheme";
import Image from "next/image";
import { jwtDecode } from "jwt-decode";
import { CustomJwtPayload } from "@/interfaces/CustomJwtPayload";

const DesktopNavigation = () => {
  const router = useRouter();
  const tgUrl = process.env.NEXT_PUBLIC_TG_URL;
  const xUrl = process.env.NEXT_PUBLIC_X_URL;

  const { theme, toggleTheme } = useTheme();

  const [jwt, setJwt] = useState<string | null>(null);
  const [decoded, setDecoded] = useState<CustomJwtPayload | null>(null);

  useEffect(() => {
    const storedJwt = localStorage.getItem("jwt");
    if (storedJwt) {
      setJwt(storedJwt);
      setDecoded(jwtDecode(storedJwt) as CustomJwtPayload);
    }

    const handleJwtUpdate = () => {
      const newJwt = localStorage.getItem("jwt");
      setJwt(newJwt);
      setDecoded(newJwt ? (jwtDecode(newJwt) as CustomJwtPayload) : null);
    };

    window.addEventListener("jwt-updated", handleJwtUpdate);
    return () => {
      window.removeEventListener("jwt-updated", handleJwtUpdate);
    };
  }, []);

  const loginWithGoogle = () => {
    window.location.href = "https://api.vigilseek.com/auth/google/login";
  };

  const logout = () => {
    localStorage.removeItem("jwt");
    setJwt(null);
    setDecoded(null);
    router.refresh();
  };

  return (
    <div className="flex flex-1 justify-between">
      <div className="flex gap-4">
        <Button
          variant="secondary"
          className="font-bold"
          onClick={() => router.push("/")}
        >
          Crowdsourced Audits
        </Button>
        <Button
          variant="secondary"
          className="font-bold"
          onClick={() => router.push("/bug-bounty")}
        >
          Bug Bounty Programs
        </Button>
        <Button
          variant="secondary"
          className="font-bold"
          onClick={() => router.push("/charts")}
        >
          Charts
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="font-bold text-3xl flex gap-2 items-center">
          <p className="text-sm text-primary">Light</p>
          <Switch
            checked={theme === "dark"}
            onCheckedChange={toggleTheme}
            disabled={theme === null}
          />
          <p className="text-sm text-muted-foreground">Dark</p>
        </div>
        <Separator orientation="vertical" />
        <Button
          variant="ghost"
          className="font-bold text-3xl"
          onClick={() => {
            const newWindow = window.open(tgUrl);
            if (newWindow) {
              newWindow.focus();
            }
          }}
        >
          <ImTelegram />
        </Button>
        <Button
          variant="ghost"
          className="font-bold text-3xl"
          onClick={() => {
            const newWindow = window.open(xUrl);
            if (newWindow) {
              newWindow.focus();
            }
          }}
        >
          <BsTwitterX />
        </Button>
        <Separator orientation="vertical" />
        {jwt ? (
          <Button
            variant="secondary"
            className="font-bold uppercase rounded-xl flex gap-2 px-2"
            onClick={logout}
          >
            <Image
              src={decoded?.picture || ""}
              alt="User logo"
              width={24}
              height={24}
              className="rounded-[0.375rem]"
              referrerPolicy="no-referrer"
            />
            <p>Logout</p>
          </Button>
        ) : (
          <Button
            variant="secondary"
            className="font-bold uppercase rounded-xl"
            onClick={loginWithGoogle}
          >
            Login
          </Button>
        )}
      </div>
    </div>
  );
};

export default DesktopNavigation;
