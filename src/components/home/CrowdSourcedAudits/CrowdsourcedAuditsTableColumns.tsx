"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import Image from "next/image";
import { AuditStatus, CrowdsourcedAudit } from "@/interfaces/CrowdsourcedAudit";
import moment from "moment/moment";

export const crowdsourcedAuditsTableColumns: ColumnDef<CrowdsourcedAudit>[] = [
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

      return (
        <div className="flex flex-wrap gap-1">
          {languages.slice(0, 2).map((lang, index) => (
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
      const date = new Date(row.getValue("endDate"));
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      });
      return <div>{formattedDate}</div>;
    },
  },
  {
    accessorKey: "duration",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-32"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <p className="-ml-4">Duration</p>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const startDate = moment(row.original.startDate);
      const endDate = moment(row.original.endDate);
      const now = moment();

      const totalDays = endDate.diff(startDate, "days");
      const daysLeft = Math.max(
        0,
        Math.min(totalDays, endDate.diff(now, "days"))
      );

      return (
        <p>
          {totalDays} Days (Left: {daysLeft})
        </p>
      );
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
          Prize Pool
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = row.getValue("maxReward") as number | null;
      const paid = row.original.paid as number | null;
      return (
        <div className="font-medium">
          <span>
            Max: $
            {amount !== null
              ? amount.toLocaleString("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })
              : "N/A"}
          </span>
          {paid !== null && paid > 0 && (
            <>
              <br />
              <span>
                (Paid: $
                {paid.toLocaleString("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
                )
              </span>
            </>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const crowdsourcedAudit = row.original;
      return (
        <Button
          onClick={() => window.open(crowdsourcedAudit.originalUrl, "_blank")}
          variant="outline"
        >
          View Program
        </Button>
      );
    },
  },
];
