"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import Image from "next/image";
import { BugBounty } from "@/interfaces/BugBounty";
import { AuditStatus } from "@/interfaces/CrowdsourcedAudit";
import { useState } from "react";
import { usePatchSecurityContestLanguages } from "@/hooks/patchW3SecurityContestsLanguages";
import { usePatchSecurityContestPaids } from "@/hooks/patchW3SecurityContestsPaids";

export const adminCrowdsourcedAuditsTableColumns: ColumnDef<BugBounty>[] = [
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
      const [isEditing, setIsEditing] = useState(false);
      const [editedLanguages, setEditedLanguages] = useState<string[]>(
        row.original.languages || []
      );
      const updateLanguages = usePatchSecurityContestLanguages();

      const handleSave = async () => {
        try {
          await updateLanguages.mutateAsync({
            id: row.original.id,
            languages: editedLanguages,
          });
          setIsEditing(false);
        } catch (error) {
          console.error("Failed to update languages:", error);
        }
      };

      if (isEditing) {
        return (
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={editedLanguages.join(", ")}
              onChange={(e) =>
                setEditedLanguages(
                  e.target.value.split(",").map((lang) => lang.trim())
                )
              }
              className="w-full p-1 border rounded"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleSave}
                disabled={updateLanguages.isPending}
              >
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditedLanguages(row.original.languages || []);
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        );
      }

      return (
        <div
          className="flex flex-wrap gap-1 cursor-pointer min-w-4 min-h-6"
          onClick={() => setIsEditing(true)}
        >
          {Array.isArray(row.original.languages) &&
            row.original.languages.length > 0 &&
            row.original.languages.map((lang, index) => (
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
          {/* Відображаємо "N/A", якщо значення відсутнє */}
        </div>
      );
    },
  },
  {
    accessorKey: "paid",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Paid
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const [isEditing, setIsEditing] = useState(false);
      const [editedPaid, setEditedPaid] = useState<number | "">(
        row.getValue("paid") ?? ""
      );
      const updatePaid = usePatchSecurityContestPaids();

      const handleSave = async () => {
        try {
          await updatePaid.mutateAsync({
            id: row.original.id,
            paid: typeof editedPaid === "number" ? editedPaid : 0,
          });
          setIsEditing(false);
        } catch (error) {
          console.error("Failed to update paid:", error);
        }
      };

      if (isEditing) {
        return (
          <div className="flex flex-col gap-2">
            <input
              type="number"
              value={editedPaid}
              onChange={(e) =>
                setEditedPaid(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
              className="w-full p-1 border rounded"
              min={0}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleSave}
                disabled={updatePaid.isPending}
              >
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditedPaid(row.getValue("paid") ?? "");
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        );
      }

      const paid = row.getValue("paid") as number | null | undefined;
      return (
        <div
          className="font-medium cursor-pointer min-w-4 min-h-6"
          onClick={() => setIsEditing(true)}
          title="Click to edit"
        >
          $
          {paid !== null && paid !== undefined
            ? paid.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })
            : "N/A"}
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
];
