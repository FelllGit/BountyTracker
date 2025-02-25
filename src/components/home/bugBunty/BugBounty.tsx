"use client";

import { useEffect, useState, useRef } from "react";
import { bugBountyTableColumns } from "@/components/home/bugBunty/bugBountyTableColumns";
import { useGetW3BugBounties } from "@/hooks/useGetW3BugBounties";
import { BugBounty } from "@/interfaces/BugBounty";
import { format } from "date-fns";
import { extractUniquePlatforms } from "@/utils/platformUtils";
import { extractUniqueLanguages } from "@/utils/languageUtils";
import { SortingState } from "@tanstack/react-table";
import Filters from "@/components/ui/filters";
import { DataTable } from "@/components/ui/data-table";
import { useSavedFilters } from "@/utils/savedFilters";

const PAGE_SIZE = 20;

const BugBountyTable = () => {
  const [displayedData, setDisplayedData] = useState<BugBounty[]>([]);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "startDate", desc: true },
  ]);
  const loader = useRef(null);
  const [page, setPage] = useState(0);

  const { filters, setFilters } = useSavedFilters("bug-bounty-filters");
  const [languages, setLanguages] = useState<string[]>(filters.languages || []);
  const [startDate, setStartDate] = useState<Date | null>(
    filters.startDate ? new Date(filters.startDate) : null
  );

  const [search, setSearch] = useState<string>(filters.search || "");
  const [platforms, setPlatforms] = useState<string[]>(filters.platforms || []);
  const [maxReward, setMaxReward] = useState<number | undefined>(
    filters.maxReward
  );

  const {
    data: bugBounties,
    isLoading,
    error,
  } = useGetW3BugBounties(
    search,
    platforms,
    maxReward,
    languages,
    startDate ? format(startDate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'") : undefined
  );

  const [allPlatforms, setAllPlatforms] = useState<string[]>([]);
  const [allLanguages, setAllLanguages] = useState<string[]>([]);

  useEffect(() => {
    setFilters({
      languages,
      startDate: startDate?.toISOString() ? startDate : null,
      search,
      platforms,
      maxReward,
    });
  }, [languages, startDate, search, platforms, maxReward, setFilters]);

  function sortData(data: BugBounty[], sorting: SortingState): BugBounty[] {
    if (sorting.length === 0) return data;
    return [...data].sort((a, b) => {
      for (const sort of sorting) {
        const { id, desc } = sort;
        if (id === "rating") {
          const aRating: number =
            (a.likes?.length ?? 0) - (a.dislikes?.length ?? 0);
          const bRating: number =
            (b.likes?.length ?? 0) - (b.dislikes?.length ?? 0);
          if (aRating > bRating) return desc ? -1 : 1;
          if (aRating < bRating) return desc ? 1 : -1;
          continue;
        }
        const key = id as keyof BugBounty;
        let aValue: string | number = a[key] as string | number;
        let bValue: string | number = b[key] as string | number;
        if (key === "startDate") {
          const aDate = new Date(aValue as string);
          const bDate = new Date(bValue as string);
          if (aDate > bDate) return desc ? -1 : 1;
          if (aDate < bDate) return desc ? 1 : -1;
        } else if (key === "languages") {
          aValue = Array.isArray(aValue) ? (aValue as string[]).join(", ") : "";
          bValue = Array.isArray(bValue) ? (bValue as string[]).join(", ") : "";
        } else if (key === "maxReward") {
          aValue = (aValue as number) || 0;
          bValue = (bValue as number) || 0;
        } else if (typeof aValue === "string" && typeof bValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        if (aValue > bValue) return desc ? -1 : 1;
        if (aValue < bValue) return desc ? 1 : -1;
      }
      return 0;
    });
  }

  useEffect(() => {
    if (bugBounties && allPlatforms.length === 0 && allLanguages.length === 0) {
      setAllPlatforms(extractUniquePlatforms(bugBounties));
      setAllLanguages(extractUniqueLanguages(bugBounties));
    }
  }, [bugBounties, allPlatforms, allLanguages]);

  useEffect(() => {
    setPage(0);
    if (bugBounties) {
      const sortedData = sortData(bugBounties, sorting);
      setDisplayedData(sortedData.slice(0, PAGE_SIZE));
    }
  }, [
    bugBounties,
    search,
    platforms,
    maxReward,
    languages,
    startDate,
    sorting,
  ]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && bugBounties) {
          const nextPage = page + 1;
          const sortedData = sortData(bugBounties, sorting);
          const nextData = sortedData.slice(0, nextPage * PAGE_SIZE);
          setDisplayedData(nextData);
          setPage(nextPage);
        }
      },
      { threshold: 1.0 }
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [isLoading, bugBounties, page, sorting]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleMaxRewardChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newMaxReward = Number(event.target.value);
    setMaxReward(newMaxReward || undefined); // використай undefined для уникнення помилки з пустим значенням
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Explore Bug Bounty Programs</h1>
      <Filters
        variant="alternative"
        search={search}
        handleSearchChange={handleSearchChange}
        setPlatforms={setPlatforms}
        platforms={platforms}
        allPlatforms={allPlatforms}
        setLanguages={setLanguages}
        languages={languages}
        allLanguages={allLanguages}
        startDate={startDate}
        setStartDate={setStartDate}
        maxReward={maxReward}
        handleMaxRewardChange={handleMaxRewardChange}
      />
      {error ? (
        <p>Error: {error.message}</p>
      ) : (
        <DataTable
          columns={bugBountyTableColumns}
          data={displayedData}
          isLoading={isLoading}
          sorting={sorting}
          setSorting={setSorting}
        />
      )}

      {!isLoading &&
        bugBounties &&
        displayedData.length < bugBounties.length && (
          <div
            ref={loader}
            className="h-10 w-full flex items-center justify-center"
          >
            <p>Loading more...</p>
          </div>
        )}
    </div>
  );
};

export default BugBountyTable;
