"use client";
import Icon from "@/components/icon/icon";
import { Input } from "@/components/ui/input";
import DatePicker from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { AuditStatus, CrowdsourcedAudit } from "@/interfaces/CrowdsourcedAudit";
import { useGetW3SecurityContests } from "@/hooks/useGetW3SecurityContests";
import { format } from "date-fns";
import { DataTable } from "@/components/ui/data-table";
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
import { adminCrowdsourcedAuditsTableColumns } from "@/components/admin/crowdsourcedAudits /CrowdsourcedAuditsTableColumns";
import { Checkbox } from "@/components/ui/checkbox";

const PAGE_SIZE = 20;

const AdminCrowdsourcedAudits = () => {
  const [displayedData, setDisplayedData] = useState<CrowdsourcedAudit[]>([]);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "startDate", desc: true },
  ]);
  const loader = useRef(null); // Ref для елемента завантаження
  const [page, setPage] = useState(0); // State для сторінки

  const [languages, setLanguages] = useState<string[]>([]);
  const [excludeLanguages, setExcludeLanguages] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [statuses, setStatuses] = useState<AuditStatus[]>([]);

  const [search, setSearch] = useState<string>("");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [maxReward, setMaxReward] = useState<number | undefined>();

  const { data: projectsData, isLoading } = useGetW3SecurityContests(
    search,
    languages,
    platforms,
    startDate ? format(startDate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'") : undefined,
    endDate ? format(endDate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'") : undefined,
    statuses,
    maxReward,
    excludeLanguages
  );

  const [allPlatforms, setAllPlatforms] = useState<string[]>([]);
  const [allLanguages, setAllLanguages] = useState<string[]>([]);

  const handleToggleLanguages = () => {
    setExcludeLanguages(!excludeLanguages);
  };

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
          <DropdownMenuTrigger asChild className="h-10 flex-1 max-w-56">
            <Button variant="outline" className="flex justify-between">
              <div className="flex gap-2 items-center truncate">
                <Icon name="SquareFunction" color="grey" />
                <p
                  className={`${languages.length > 0 ? "text-black" : "text-gray-500"} truncate`}
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
        <div
          className="px-4 py-2 flex items-center gap-2 border rounded-md !h-[40px] shadow-sm hover:bg-gray-100 cursor-pointer"
          onClick={handleToggleLanguages}
        >
          <Checkbox
            className="shadow-none"
            checked={excludeLanguages}
            onCheckedChange={handleToggleLanguages}
          ></Checkbox>
          <label className="text-gray-500 truncate cursor-pointer font-light text-sm">
            Exclude languages
          </label>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="h-10 w-full max-w-56 flex-1">
            <Button
              variant="outline"
              className="flex justify-between "
              title={languages.join(", ")}
            >
              <div className="flex w-full gap-2 items-center truncate">
                <Icon name="Layers" color="grey" />
                <p
                  className={`${platforms.length > 0 ? "text-black" : "text-gray-500"} truncate`}
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="h-10 w-full max-w-56 flex-1">
            <Button variant="outline" className="flex justify-between">
              <div className="flex gap-2 items-center truncate">
                <Icon name="TrendingUp" className="h-fit w-fit" color="grey" />
                <p
                  className={`${statuses.length > 0 ? "text-black" : "text-gray-500"} truncate`}
                >
                  {statuses.length > 0
                    ? statuses.join(", ")
                    : "Select Statuses"}
                </p>
              </div>
              <Icon name="ChevronsUpDown" size={13} color="grey" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Statuses</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {Object.values(AuditStatus).map((status) => {
              const isChecked = statuses.includes(status);
              return (
                <DropdownMenuCheckboxItem
                  key={status}
                  checked={isChecked}
                  onCheckedChange={() => {
                    setStatuses((currentStatuses) =>
                      isChecked
                        ? currentStatuses.filter((s) => s !== status)
                        : [...currentStatuses, status]
                    );
                  }}
                >
                  {status}
                </DropdownMenuCheckboxItem>
              );
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="p-0">
              <Button
                variant="ghost"
                className="w-full text-left"
                onClick={() => setStatuses([])}
              >
                Clear
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
        columns={adminCrowdsourcedAuditsTableColumns}
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

export default AdminCrowdsourcedAudits;
