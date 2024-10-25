"use client";

import { useMediaQuery } from "react-responsive";
import Icon from "@/components/icon/icon";
import { useEffect } from "react";

const LandscapeMode = () => {
  const isPortrait = useMediaQuery({
    query: "(orientation: portrait)",
    maxWidth: 1023,
  });

  useEffect(() => {
    if (isPortrait) {
      // Забороняємо скролінг і задаємо розміри для html та body
      document.body.style.overflow = "hidden";
      document.body.style.height = "100vh";
      document.body.style.width = "100vw";
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.height = "100vh";
      document.documentElement.style.width = "100vw";
    } else {
      // Відновлюємо стилі для html та body
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.body.style.width = "";
      document.documentElement.style.overflow = "";
      document.documentElement.style.height = "";
      document.documentElement.style.width = "";
    }

    return () => {
      // Відновлюємо стилі при демонтажі компонента
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.body.style.width = "";
      document.documentElement.style.overflow = "";
      document.documentElement.style.height = "";
      document.documentElement.style.width = "";
    };
  }, [isPortrait]);

  if (!isPortrait) {
    return null;
  }

  return (
    <div className="w-screen h-screen fixed top-0 left-0 bg-white z-[999] flex items-center justify-center">
      <div className="text-gray-500 flex items-center justify-center space-x-2">
        <Icon name="RotateCcwSquare" />
        <p>Please rotate your device to landscape mode</p>
      </div>
    </div>
  );
};

export default LandscapeMode;
