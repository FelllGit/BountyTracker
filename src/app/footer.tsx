"use client";

// eslint-disable-next-line no-restricted-imports
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ImTelegram } from "react-icons/im";
import { BsTwitterX } from "react-icons/bs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const tgUrl = process.env.NEXT_PUBLIC_TG_URL;
const xUrl = process.env.NEXT_PUBLIC_X_URL;

const Footer = () => {
  const toast = useToast();
  function copyEthErc20() {
    navigator.clipboard
      .writeText("0x6eC21015971b824805EC6797855fd40f7AF58b0C")
      .then(() => {
        toast.toast({
          title: "Copied to clipboard",
        });
      });
  }

  return (
    <footer className="px-10 py-6 border-t-2 flex flex-col lg:flex-row lg:justify-between gap-8 text-lg">
      <div
        id="support"
        className="flex flex-col gap-2 items-center lg:items-start"
      >
        <span>
          If you'd like to support the development, donations are welcome at:
        </span>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            ETH / ERC-20 (Polygon, Arbitrum, etc.):
            <Button
              variant="ghost"
              onClick={copyEthErc20}
              className="break-all md:text-lg inline px-[4px] py-0 bg-accent bg-blend-color-burn rounded-lg text-accent-text"
            >
              0x6eC21015971b824805EC6797855fd40f7AF58b0C
            </Button>
          </div>
        </div>
      </div>
      <Separator orientation="horizontal" className="visible lg:hidden" />
      <div className="flex flex-col gap-4 items-center lg:items-end">
        <div className="flex gap-2 *:pr-0">
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
        <div className="flex flex-col md:flex-row lg:flex-col justify-between items-center lg:items-end w-full gap-4">
          <Link href="/privacy-policy" className="text-lg">
            Private Policy
          </Link>
          <Link href="/terms-conditions" className="text-lg">
            Terms of Service
          </Link>
          <Link
            href="https://x.com/lmanualm"
            target="_blank"
            className="text-lg"
          >
            Contact us
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
