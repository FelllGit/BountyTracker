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
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    accessorFn: (row) => (row.likes?.length || 0) - (row.dislikes?.length || 0),
    header: ({ column }) => {
      return (
        <div className="flex justify-center w-full">
          <Button
            variant="ghost"
            className="p-0 lg:pr-4"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Rating
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const bugBounty = row.original;
      const jwt = localStorage.getItem("jwt");
      const decoded = jwt ? (jwtDecode(jwt) as CustomJwtPayload) : null;

      const likeContest = useLikeBugBounty();
      const { toast } = useToast();

      const handleVote = (likeStatus: LikeStatus) => {
        if (!jwt) {
          toast({
            title: "Authorization needed",
            description: "You need to be logged in to vote.",
            variant: "destructive",
          });
          return;
        }

        likeContest.mutate({
          id: bugBounty.id,
          likeStatus,
        });
      };

      const userId = decoded?.sub as string;
      const userLikes = new Set(bugBounty?.likes);
      const userDislikes = new Set(bugBounty?.dislikes);

      const rating =
        (bugBounty?.likes?.length || 0) - (bugBounty?.dislikes?.length || 0);

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="relative">
                <div className="flex gap-2 items-center pr-4">
                  <Button
                    variant="ghost"
                    onClick={() =>
                      handleVote(
                        userLikes.has(userId)
                          ? LikeStatus.REMOVE
                          : LikeStatus.LIKE
                      )
                    }
                  >
                    <ArrowUp
                      className={
                        userLikes.has(userId)
                          ? "dark:fill-yellow-600 !fill-yellow-400"
                          : ""
                      }
                    />
                  </Button>
                  <p>{rating}</p>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      handleVote(
                        userDislikes.has(userId)
                          ? LikeStatus.REMOVE
                          : LikeStatus.DISLIKE
                      )
                    }
                  >
                    <ArrowDown
                      className={
                        userDislikes.has(userId)
                          ? "dark:fill-yellow-600 !fill-yellow-400"
                          : ""
                      }
                    />
                  </Button>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-secondary-foreground">
                {bugBounty.likes.length} likes | {bugBounty.dislikes.length}{" "}
                dislikes
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
];
