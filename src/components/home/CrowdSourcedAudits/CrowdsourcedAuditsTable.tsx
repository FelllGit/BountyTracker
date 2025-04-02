"use client";
import { useEffect, useRef, useState } from "react";
import { AuditStatus, CrowdsourcedAudit } from "@/interfaces/CrowdsourcedAudit";
import { useGetW3SecurityContests } from "@/hooks/useGetW3SecurityContests";
import { format } from "date-fns";
import { DataTable } from "@/components/ui/data-table";
import { crowdsourcedAuditsTableColumns } from "@/components/home/CrowdSourcedAudits/CrowdsourcedAuditsTableColumns";
import { extractUniquePlatforms } from "@/utils/platformUtils";
import { extractUniqueLanguages } from "@/utils/languageUtils";
import { SortingState } from "@tanstack/react-table";
import Filters from "@/components/ui/filters";
import { useSavedFilters } from "@/utils/savedFilters";

const PAGE_SIZE = 20;

const CrowdsourcedAuditsTable = () => {
  const [displayedData, setDisplayedData] = useState<CrowdsourcedAudit[]>([]);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "startDate", desc: true },
  ]);

  const { filters, setFilters } = useSavedFilters(
    "crowdsourced-audits-filters"
  );

  const loader = useRef(null); // Ref для елемента завантаження
  const [page, setPage] = useState(0); // State для сторінки

  const [languages, setLanguages] = useState<string[]>(filters.languages || []);
  const [startDate, setStartDate] = useState<Date | null>(
    filters.startDate ? new Date(filters.startDate) : null
  );
  const [endDate, setEndDate] = useState<Date | null>(
    filters.endDate ? new Date(filters.endDate) : null
  );
  const [statuses, setStatuses] = useState<AuditStatus[]>(
    filters.statuses || [AuditStatus.UPCOMING, AuditStatus.ONGOING]
  );

  const [search, setSearch] = useState<string>(filters.search || "");
  const [platforms, setPlatforms] = useState<string[]>(filters.platforms || []);
  const [maxReward, setMaxReward] = useState<number | undefined>(
    filters.maxReward
  );

  const { data: projectsData, isLoading } = useGetW3SecurityContests(
    search,
    languages,
    platforms,
    startDate ? format(startDate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'") : undefined,
    endDate ? format(endDate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'") : undefined,
    statuses,
    maxReward
  );

  const [allPlatforms, setAllPlatforms] = useState<string[]>([]);
  const [allLanguages, setAllLanguages] = useState<string[]>([]);

  useEffect(() => {
    setFilters({
      languages,
      startDate: startDate?.toISOString() ? startDate : null,
      endDate: endDate?.toISOString() ? endDate : null,
      statuses,
      search,
      platforms,
      maxReward,
    });
  }, [
    languages,
    startDate,
    endDate,
    statuses,
    search,
    platforms,
    maxReward,
    setFilters,
  ]);

  function sortData(
    data: CrowdsourcedAudit[],
    sorting: SortingState
  ): CrowdsourcedAudit[] {
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
        const key = id as keyof CrowdsourcedAudit;
        let aValue = a[key];
        let bValue = b[key];
        if (key === "startDate" || key === "endDate") {
          const aValueDate = new Date(aValue as string);
          const bValueDate = new Date(bValue as string);
          if (aValueDate > bValueDate) return desc ? -1 : 1;
          if (aValueDate < bValueDate) return desc ? 1 : -1;
        } else if (key === "languages") {
          aValue = Array.isArray(aValue) ? (aValue as string[]).join(", ") : "";
          bValue = Array.isArray(bValue) ? (bValue as string[]).join(", ") : "";
        } else if (key === "maxReward") {
          aValue = aValue || 0;
          bValue = bValue || 0;
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
    if (
      projectsData &&
      allPlatforms.length === 0 &&
      allLanguages.length === 0
    ) {
      setAllPlatforms(extractUniquePlatforms(projectsData));
      setAllLanguages(extractUniqueLanguages(projectsData));
    }
  }, [projectsData, allPlatforms, allLanguages]);

  // Оновлення даних при зміні фільтрів або пошуку
  useEffect(() => {
    setPage(0);
    if (projectsData) {
      const sortedData = sortData(projectsData, sorting);
      setDisplayedData(sortedData.slice(0, PAGE_SIZE));
    }
  }, [
    projectsData,
    search,
    platforms,
    maxReward,
    languages,
    startDate,
    endDate,
    statuses,
    sorting,
  ]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && projectsData) {
          const nextPage = page + 1;
          const sortedData = sortData(projectsData, sorting);
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
  }, [isLoading, projectsData, page, sorting]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleMaxRewardChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newMaxReward = Number(event.target.value);
    setMaxReward(newMaxReward || undefined);
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-3xl font-bold">Explore Crowdsourced Audits Table</p>
      <Filters
        search={search}
        handleSearchChange={handleSearchChange}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        languages={languages}
        setLanguages={setLanguages}
        allLanguages={allLanguages}
        platforms={platforms}
        setPlatforms={setPlatforms}
        allPlatforms={allPlatforms}
        statuses={statuses}
        setStatuses={setStatuses}
        maxReward={maxReward}
        handleMaxRewardChange={handleMaxRewardChange}
      />
      <DataTable
        columns={crowdsourcedAuditsTableColumns}
        data={displayedData}
        isLoading={isLoading}
        sorting={sorting}
        setSorting={setSorting}
      />
      {!isLoading &&
        projectsData &&
        displayedData.length < projectsData.length && (
          <div
            ref={loader}
            className="h-10 w-full flex items-center justify-center text-card-foreground"
          >
            <p>Loading more...</p>
          </div>
        )}
    </div>
  );
};

export default CrowdsourcedAuditsTable;
