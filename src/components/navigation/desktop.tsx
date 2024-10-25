import { Button } from "@/components/ui/button";
import { ImTelegram } from "react-icons/im";
import { BsTwitterX } from "react-icons/bs";
import { useRouter } from "next/navigation";

const DesktopNavigation = () => {
  const router = useRouter();
  const tgUrl = process.env.NEXT_PUBLIC_TG_URL;
  const xUrl = process.env.NEXT_PUBLIC_X_URL;
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
      </div>

      <div className="flex gap-4">
        {/*<Button variant="secondary" className="font-bold">*/}
        {/*  Email Subscription*/}
        {/*</Button>*/}
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
  );
};

export default DesktopNavigation;
