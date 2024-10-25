"use client";
import Icon from "@/components/icon/icon";
import { Input } from "@/components/ui/input";
import { InputTags } from "@/components/ui/input-tags";
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

const PAGE_SIZE = 20;

const CrowdsourcedAuditsTable = () => {
  const [displayedData, setDisplayedData] = useState<CrowdsourcedAudit[]>([]);
  const loader = useRef(null); // Ref для елемента завантаження
  const [page, setPage] = useState(0); // State для сторінки

  const [languages, setLanguages] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [status, setStatus] = useState<AuditStatus | null>(null);

  const [search, setSearch] = useState<string>("");
  const [platform, setPlatform] = useState<string>("");
  const [maxReward, setMaxReward] = useState<number | undefined>();

  const { data: projectsData, isLoading } = useGetW3SecurityContests(
    search,
    languages,
    platform,
    startDate ? format(startDate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'") : undefined,
    endDate ? format(endDate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'") : undefined,
    status ?? undefined,
    maxReward
  );

  // Оновлення даних при зміні фільтрів або пошуку
  useEffect(() => {
    setPage(0);
    if (projectsData) {
      setDisplayedData(projectsData.slice(0, PAGE_SIZE));
    }
  }, [
    projectsData,
    search,
    platform,
    maxReward,
    languages,
    startDate,
    endDate,
    status,
  ]);

  // IntersectionObserver для підвантаження наступних сторінок
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && projectsData) {
          const nextPage = page + 1;
          const nextData = projectsData.slice(0, nextPage * PAGE_SIZE);
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
  }, [isLoading, projectsData, page]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handlePlatformChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPlatform(event.target.value);
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
        <InputTags
          icon="Code"
          placeholder="Languages"
          value={languages}
          onChange={setLanguages}
          className="md:flex-1 w-full"
        />
        <div className="relative w-1/2 md:w-56">
          <Icon
            name="SquareFunction"
            className="absolute left-3 top-[17px] h-5 w-5 -translate-y-1/2 text-gray-400 z-10"
          />
          <Input
            type="text"
            placeholder="Search program"
            className="pl-10 h-10"
            value={platform}
            onChange={handlePlatformChange}
          />
        </div>
        <DatePicker
          startDate={startDate}
          endDate={endDate}
          setEndDate={setEndDate}
          setStartDate={setStartDate}
          mode="range"
          className="flex-1 md:w-56"
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
            <div className="flex items-center gap-2">
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
