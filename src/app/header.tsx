"use client";
import { Button } from "@/components/ui/button";
import * as motion from "framer-motion/client";
import Image from "next/image";
import image from "@/media/img/VigilSeek_logo.png";
import { useMediaQuery } from "react-responsive";
import DesktopNavigation from "@/components/navigation/desktop";
import MobileNavigation from "@/components/navigation/mobile";
import { useRouter } from "next/navigation";

const Header = () => {
  const isMobile = useMediaQuery({ maxWidth: 1023 });
  const router = useRouter();

  return (
    <nav
      className={`flex items-center px-4 md:px-10 py-6 border-b-2 !fixed w-screen bg-white z-[100] justify-between`}
    >
      <motion.div
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        className="mx-[-2rem] md:mx-0"
      >
        <Button
          variant="logo"
          className="text-xl font-bold flex items-center"
          onClick={() => router.push("/")}
        >
          <Image
            src={image}
            alt="Logo"
            width={64}
            height={64}
            priority={false}
          />
          VigilSeek
        </Button>
      </motion.div>

      {/*{isMobile ? <MobileNavigation /> : <DesktopNavigation />}*/}
      <div>
        <div className="hidden lg:block">
          <DesktopNavigation />
        </div>
        <div className="block pr-6 md:pr-0 lg:hidden">
          <MobileNavigation />
        </div>
      </div>
    </nav>
  );
};

export default Header;
