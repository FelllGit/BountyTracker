"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Icon from "@/components/icon/icon";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ImTelegram } from "react-icons/im";
import { BsTwitterX } from "react-icons/bs";
import { useState } from "react";

const MobileNavigation = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const tgUrl = process.env.NEXT_PUBLIC_TG_URL;
  const xUrl = process.env.NEXT_PUBLIC_X_URL;

  const handleRouter = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger
        className="flex justify-self-end"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Icon name="Menu" />
      </SheetTrigger>
      <SheetContent className="w-2/5 flex flex-col">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <div className="flex flex-1 flex-col justify-between mt-2">
          <div className="flex flex-col gap-2">
            <Button
              variant="secondary"
              className="font-bold"
              onClick={() => handleRouter("/")}
            >
              Crowdsourced Audits
            </Button>
            <Button
              variant="secondary"
              className="font-bold"
              onClick={() => handleRouter("/bug-bounty")}
            >
              Bug Bounty Programs
            </Button>
          </div>

          <div className="flex flex-col gap-4">
            <Button variant="secondary" className="font-bold">
              Email Subscription
            </Button>
            <div className="flex justify-around">
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
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;
