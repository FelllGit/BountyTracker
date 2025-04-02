"use client";

import Image404 from "@/media/svg/404.svg";

function NotFoundPage() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center gap-4">
      <Image404 className="w-1/6 h-1/6 dark:invert" />
      <span className="font-bold text-card-foreground">
        "I was standing guard... but darkness won. 404."
      </span>
    </div>
  );
}

export default NotFoundPage;
