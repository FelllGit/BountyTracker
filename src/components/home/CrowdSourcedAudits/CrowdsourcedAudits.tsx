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
import GanttChart from "@/components/charts/ganttChart";
import { useEffect, useRef, useState } from "react";
import { AuditStatus } from "@/interfaces/CrowdsourcedAudit";
import { format } from "date-fns";
import { useGetW3SecurityContests } from "@/hooks/useGetW3SecurityContests";
import image from "./../../../media/img/VigilSeek_logo.png";
import ExportButton from "@/components/home/CrowdSourcedAudits/ExportButton";

const CrowdsourcedAudits = () => {
  const imgRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartHeight, setChartHeight] = useState<number>(0);

  const [languages, setLanguages] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [status, setStatus] = useState<AuditStatus | null>(null);

  const [search, setSearch] = useState<string>("");
  const [platform, setPlatform] = useState<string>("");
  const [maxReward, setMaxReward] = useState<number | undefined>();

  const {
    data: projectsData,
    isLoading,
    error,
  } = useGetW3SecurityContests(
    search,
    languages,
    platform,
    startDate ? format(startDate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'") : undefined,
    endDate ? format(endDate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'") : undefined,
    status ?? undefined,
    maxReward
  );

  useEffect(() => {
    if (chartRef.current) {
      setChartHeight(chartRef.current.offsetHeight);
    }
  }, [projectsData, isLoading, error]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handlePlatformChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPlatform(event.target.value);
  };

  const handleMaxRewardChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (isNaN(Number(event.target.value))) setMaxReward(undefined);
    setMaxReward(Number(event.target.value));
  };

  return (
    <>
      {/* Прихований компонент з водяним знаком для експорту маленьких діаграм */}
      <div
        ref={watermarkRef}
        style={{
          position: "fixed",
          left: "-99999px",
          top: "-99999px",
          width: chartRef.current?.offsetWidth,
          // height: chartRef.current?.offsetHeight,
        }}
      >
        <div>
          <GanttChart
            projectsData={projectsData}
            isLoading={isLoading}
            error={error}
          />
        </div>
        <div className="flex justify-end w-full">
          <div className="flex items-center gap-2 pr-4">
            <div className="relative w-[120px] h-[120px]">
              <img
                src={image.src}
                alt="VigilSeek Logo"
                className="object-contain"
                style={{ width: "120px", height: "120px", opacity: 0.3 }}
                sizes="120px"
              />
            </div>
            <span
              className="text-4xl font-bold text-gray-600"
              style={{ opacity: 0.3 }}
            >
              VigilSeek
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <p className="text-3xl font-bold">
          Explore Crowdsourced Audits Timeline
        </p>
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
        {(!isLoading || !error) && projectsData && (
          <ExportButton
            imgRef={imgRef}
            watermarkRef={watermarkRef}
            chartHeight={chartHeight}
          />
        )}
        <div ref={imgRef} className="relative flex flex-col">
          <div ref={chartRef}>
            <GanttChart
              projectsData={projectsData}
              isLoading={isLoading}
              error={error}
            />
          </div>
          {!isLoading && !error && chartHeight >= 151 && (
            <div className="absolute top-[calc(50%+31px)] right-[14rem] pointer-events-none flex items-center justify-center">
              <div className="absolute pointer-events-none flex items-center justify-center z-10">
                <div className="flex items-center max-w-[800px] w-full">
                  <div className="relative w-[120px] h-[120px]">
                    <img
                      src={image.src}
                      alt="VigilSeek Logo"
                      className="object-cover"
                      style={{ width: "120px", height: "120px", opacity: 0.3 }}
                      sizes="120px"
                    />
                  </div>
                  <span
                    className="text-6xl font-bold -ml-2 text-gray-600"
                    style={{ opacity: 0.3 }}
                  >
                    VigilSeek
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CrowdsourcedAudits;
