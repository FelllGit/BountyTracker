"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import Image from "next/image";
import { BugBounty } from "@/interfaces/BugBounty";
import { AuditStatus } from "@/interfaces/CrowdsourcedAudit";

const formatCryptoAmount = (amount: number, token: string) => {
  const formatted = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(amount);
  return `${formatted} ${token}`;
};

const formatAmount = (amount: number, token: string) => {
  if (token === "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }
  return formatCryptoAmount(amount, token);
};

export const crowdsourcedAuditsTableColumns: ColumnDef<BugBounty>[] = [
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
              src={imageUrl || "/api/placeholder/32/32"}
              alt={row.getValue("project")}
              fill
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
      return (
        <div className="flex flex-wrap gap-1">
          {Array.isArray(languages) &&
            languages.length > 0 &&
            languages.map((lang, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-slate-100 rounded-full text-xs"
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
          Starts
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
    accessorKey: "endDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ends
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
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as AuditStatus;
      return <p>{status}</p>;
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
      const amount = row.getValue("maxReward") as number;
      const token = row.original.rewardsToken;
      return <div className="font-medium">{formatAmount(amount, token)}</div>;
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
];
