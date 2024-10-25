"use client";
import { Button } from "@/components/ui/button";
import { BsTwitterX } from "react-icons/bs";
import { ImTelegram } from "react-icons/im";
import * as motion from "framer-motion/client";
import Image from "next/image";
import image from "./../media/img/VigilSeek_logo.png";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  return (
    <nav className="flex items-center justify-between px-10 py-6 border-b-2 !fixed w-full bg-white z-50">
      <div className="flex gap-4">
        <motion.div initial={{ scale: 1 }} whileHover={{ scale: 1.1 }}>
          <Button
            variant="logo"
            className="text-xl font-bold flex items-center"
            disabled
          >
            <Image src={image} alt="Logo" width={64} height={64} />
            VigilSeek
          </Button>
        </motion.div>
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
        <Button variant="secondary" className="font-bold">
          Email Subscription
        </Button>
        <Button variant="ghost" className="font-bold text-3xl">
          <ImTelegram />
        </Button>
        <Button variant="ghost" className="font-bold text-3xl">
          <BsTwitterX />
        </Button>
      </div>
    </nav>
  );
};

export default Header;
