"use client";
import Icon from "@/components/icon/icon";
import { Input } from "@/components/ui/input";
import DatePicker from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { AuditStatus, CrowdsourcedAudit } from "@/interfaces/CrowdsourcedAudit";
import { useGetW3SecurityContests } from "@/hooks/useGetW3SecurityContests";
import { format } from "date-fns";
import { DataTable } from "@/components/home/data-table";
import { crowdsourcedAuditsTableColumns } from "@/components/home/CrowdSourcedAudits/CrowdsourcedAuditsTableColumns";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { extractUniquePlatforms } from "@/utils/platformUtils";
import { extractUniqueLanguages } from "@/utils/languageUtils";
import { SortingState } from "@tanstack/react-table";

const PAGE_SIZE = 20;

const CrowdsourcedAuditsTable = () => {
  const [displayedData, setDisplayedData] = useState<CrowdsourcedAudit[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const loader = useRef(null); // Ref для елемента завантаження
  const [page, setPage] = useState(0); // State для сторінки

  const [languages, setLanguages] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [status, setStatus] = useState<AuditStatus | null>(null);

  const [search, setSearch] = useState<string>("");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [maxReward, setMaxReward] = useState<number | undefined>();

  const { data: projectsData, isLoading } = useGetW3SecurityContests(
    search,
    languages,
    platforms,
    startDate ? format(startDate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'") : undefined,
    endDate ? format(endDate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'") : undefined,
    status ?? undefined,
    maxReward
  );

  const [allPlatforms, setAllPlatforms] = useState<string[]>([]);
  const [allLanguages, setAllLanguages] = useState<string[]>([]);

  function sortData(data: CrowdsourcedAudit[], sorting: SortingState) {
    if (sorting.length === 0) return data;

    return [...data].sort((a, b) => {
      for (const sort of sorting) {
        const { id, desc } = sort;
        const key = id as keyof CrowdsourcedAudit; // Cast 'id' to keyof CrowdsourcedAudit
        let aValue = a[key];
        let bValue = b[key];

        // Handle specific data types
        if (key === "startDate" || key === "endDate") {
          const aValueDate = new Date(aValue as string);
          const bValueDate = new Date(bValue as string);
          if (aValueDate > bValueDate) return desc ? -1 : 1;
          if (aValueDate < bValueDate) return desc ? 1 : -1;
        } else if (key === "languages") {
          aValue = (aValue as string[]).join(", ");
          bValue = (bValue as string[]).join(", ");
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
    status,
    sorting,
  ]);

  // IntersectionObserver для підвантаження наступних сторінок
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
      <div className="flex flex-wrap xl:flex-nowrap gap-2">
        <div className="relative md:w-56 w-full">
          <Icon
            name="Search"
            className="absolute left-3 top-[17px] h-5 w-5 -translate-y-1/2 text-gray-400 z-10"
          />
          <Input
            type="text"
            placeholder="Search company"
            className="pl-10 h-10"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="h-10 flex-1">
            <Button variant="outline" className="flex justify-between">
              <div className="flex gap-2 items-center">
                <Icon name="SquareFunction" color="grey" />
                <p
                  className={`${languages.length > 0 ? "text-black" : "text-gray-500"}`}
                >
                  {languages.length > 0
                    ? languages.join(", ")
                    : "Select Languages"}{" "}
                </p>
              </div>
              <Icon name="ChevronsUpDown" size={13} color="grey" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Languages</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {allLanguages.map((language) => {
              const isChecked = languages.includes(language);

              return (
                <DropdownMenuCheckboxItem
                  key={language}
                  checked={isChecked}
                  onCheckedChange={() => {
                    setLanguages((currentLanguages) =>
                      isChecked
                        ? currentLanguages.filter((lang) => lang !== language)
                        : [...currentLanguages, language]
                    );
                  }}
                >
                  {language}
                </DropdownMenuCheckboxItem>
              );
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="p-0">
              <Button
                variant="ghost"
                className="w-full text-left"
                onClick={() => setLanguages([])}
              >
                Clear
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="h-10 flex-1">
            <Button variant="outline" className="flex justify-between">
              <div className="flex gap-2 items-center">
                <Icon name="Layers" color="grey" />
                <p
                  className={`${platforms.length > 0 ? "text-black" : "text-gray-500"}`}
                >
                  {platforms.length > 0
                    ? platforms.join(", ")
                    : "Select Platforms"}{" "}
                </p>
              </div>
              <Icon name="ChevronsUpDown" size={13} color="grey" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Platforms</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {allPlatforms.map((platform) => {
              const isChecked = platforms.includes(platform);
              return (
                <DropdownMenuCheckboxItem
                  key={platform}
                  checked={isChecked}
                  onCheckedChange={() => {
                    setPlatforms((currentPlatforms) =>
                      isChecked
                        ? currentPlatforms.filter((plat) => plat !== platform)
                        : [...currentPlatforms, platform]
                    );
                  }}
                >
                  {platform}
                </DropdownMenuCheckboxItem>
              );
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="p-0">
              <Button
                variant="ghost"
                className="w-full text-left"
                onClick={() => setPlatforms([])}
              >
                Clear
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DatePicker
          startDate={startDate}
          endDate={endDate}
          setEndDate={setEndDate}
          setStartDate={setStartDate}
          mode="range"
          className="md:w-56 flex-1"
        />
        <Select
          value={status?.valueOf() || ""}
          onValueChange={(value) => {
            const projectStatus = Object.values(AuditStatus).find(
              (status) => status === value
            ) as AuditStatus | null;
            setStatus(projectStatus);
          }}
        >
          <SelectTrigger className="flex gap-4 !text-grey-500 h-10 w-1/2 md:w-40">
            <div
              className={`flex items-center gap-2 ${!status && "text-gray-500"}`}
            >
              <Icon name="TrendingUp" className="h-fit w-fit" color="grey" />
              <SelectValue placeholder="Status" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {Object.values(AuditStatus).map((status) => (
              <SelectItem key={status} value={status.valueOf()}>
                {status}
              </SelectItem>
            ))}
            <SelectSeparator />
            <Button
              className="w-full px-2"
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setStatus(null);
              }}
            >
              Clear
            </Button>
          </SelectContent>
        </Select>
        <div className="relative flex-1 md:w-36">
          <Icon
            name="HandCoins"
            className="absolute left-3 top-[17px] h-5 w-5 -translate-y-1/2 text-gray-400 z-10"
          />
          <Input
            type="number"
            placeholder="Max reward"
            className="pl-10 h-10"
            min={0}
            value={maxReward}
            onChange={handleMaxRewardChange}
          />
        </div>
      </div>
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
            className="h-10 w-full flex items-center justify-center"
          >
            <p>Loading more...</p>
          </div>
        )}
    </div>
  );
};

export default CrowdsourcedAuditsTable;
