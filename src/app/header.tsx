"use client";
import { Button } from "@/components/ui/button";
import * as motion from "framer-motion/client";
import Image from "next/image";
import image from "@/media/img/VigilSeek_logo.png";
import DesktopNavigation from "@/components/navigation/desktop";
import MobileNavigation from "@/components/navigation/mobile";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();

  return (
    <nav
      className={`flex items-center px-4 md:px-10 py-6 border-b-2 !fixed w-screen bg-background z-[100]`}
    >
      <motion.div
        initial={{ scale: 1 }}
        whileHover={{
          x: [0, -6, 6, -6, 6, 0],
          transition: {
            duration: 0.3,
            repeat: Infinity,
            repeatType: "mirror",
            repeatDelay: 0.5,
          },
          backgroundColor: "yellow",
          filter: "invert(1)",
          // scale: 1.1,
        }}
        className="mx-[-2rem] md:mx-0"
      >
        <Button
          variant="logo"
          className="text-xl font-bold flex items-center text-foreground"
          onClick={() => router.push("/")}
        >
          <Image
            src={image}
            className="dark:invert"
            alt="Logo"
            width={64}
            height={64}
            priority={false}
          />
          VigilSeek
        </Button>
      </motion.div>

      <div className="flex-1 hidden lg:block">
        <DesktopNavigation />
      </div>
      <div className="flex-1 flex justify-end md:pr-6 lg:pr-0 lg:hidden">
        <MobileNavigation />
      </div>
    </nav>
  );
};

export default Header;
