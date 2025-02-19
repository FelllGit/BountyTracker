"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import Image from "next/image";
import { BugBounty } from "@/interfaces/BugBounty";
import { jwtDecode } from "jwt-decode";
import { CustomJwtPayload } from "@/interfaces/CustomJwtPayload";
import { LikeStatus } from "@/interfaces/LikeStatus";
import ArrowUp from "@/media/svg/ArrowUp.svg";
import ArrowDown from "@/media/svg/ArrowDown.svg";
import { useLikeBugBounty } from "@/hooks/likeW3BugBounties";

export const bugBountyTableColumns: ColumnDef<BugBounty>[] = [
  {
    accessorKey: "project",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Company
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const imageUrl = row.original.imageUrl;
      return (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 relative rounded-full overflow-hidden">
            <Image
              priority
              src={imageUrl}
              alt="Logo"
              width="32"
              height="32"
              className="object-cover"
            />
          </div>
          <span className="font-medium">{row.getValue("project")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "languages",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Languages
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const languages = row.original.languages;
      if (!Array.isArray(languages) || languages.length === 0) return null;

      const displayedLanguages = languages.slice(0, 2);

      return (
        <div className="flex flex-wrap gap-1">
          {displayedLanguages.map((lang, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-secondary rounded-full text-xs"
            >
              {lang}
            </span>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "platform",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Platform
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const platform = row.original.platform;
      return <p>{platform}</p>;
    },
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Update Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("startDate"));
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      });
      return <div>{formattedDate}</div>;
    },
  },
  {
    accessorKey: "maxReward",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Max Reward
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = row.getValue("maxReward") as number | null; // враховуємо можливість null
      return (
        <div className="font-medium">
          $
          {amount !== null
            ? amount.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })
            : "N/A"}{" "}
        </div>
      );
    },
  },
  {
    id: "actions",

    cell: ({ row }) => {
      const bugBounty = row.original;
      return (
        <Button
          onClick={() => window.open(bugBounty.originalUrl, "_blank")}
          variant="outline"
        >
          View Program
        </Button>
      );
    },
  },
  {
    id: "rating",
    accessorFn: (row) => (row.likes?.length || 0) - (row.dislikes?.length || 0), // Використовуємо рейтинг
    header: ({ column }) => {
      return (
        <div className="flex justify-center w-full">
          <Button
            variant="ghost"
            className="pl-8" // Аналог padding-left: 2rem;
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Rating
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    sortingFn: "basic",
    cell: ({ row }) => {
      const bugBounty = row.original;
      const jwt = localStorage.getItem("jwt");
      const decoded = jwt ? (jwtDecode(jwt) as CustomJwtPayload) : null;

      const likeContest = useLikeBugBounty();
      const rating =
        (bugBounty?.likes?.length || 0) - (bugBounty?.dislikes?.length || 0);

      return (
        <div className="flex gap-2 items-center pr-4">
          <Button
            variant="ghost"
            disabled={!jwt}
            onClick={() => {
              likeContest.mutate({
                id: bugBounty.id,
                likeStatus: bugBounty?.likes?.includes(decoded?.sub as string)
                  ? LikeStatus.REMOVE
                  : LikeStatus.LIKE,
              });
            }}
          >
            <ArrowUp
              className={
                bugBounty?.likes?.includes(decoded?.sub as string)
                  ? "dark:fill-yellow-600 !fill-yellow-400"
                  : ""
              }
            />
          </Button>
          <p>{rating}</p>
          <Button
            variant="ghost"
            disabled={!jwt}
            onClick={() => {
              likeContest.mutate({
                id: bugBounty.id,
                likeStatus: bugBounty?.dislikes?.includes(
                  decoded?.sub as string
                )
                  ? LikeStatus.REMOVE
                  : LikeStatus.DISLIKE,
              });
            }}
          >
            <ArrowDown
              className={
                bugBounty?.dislikes?.includes(decoded?.sub as string)
                  ? "dark:fill-yellow-600 !fill-yellow-400"
                  : ""
              }
            />
          </Button>
        </div>
      );
    },
  },
];
