"use client";
import GanttChart from "@/components/charts/ganttChart";
import { useEffect, useRef, useState } from "react";
import { AuditStatus } from "@/interfaces/CrowdsourcedAudit";
import { format } from "date-fns";
import { useGetW3SecurityContests } from "@/hooks/useGetW3SecurityContests";
import image from "./../../../media/img/VigilSeek_logo.png";
import ExportButton from "@/components/home/CrowdSourcedAudits/ExportButton";
import { extractUniqueLanguages } from "@/utils/languageUtils";
import { extractUniquePlatforms } from "@/utils/platformUtils";
import Filters from "@/components/ui/filters";

const CrowdsourcedAudits = () => {
  const imgRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartHeight, setChartHeight] = useState<number>(0);

  const [languages, setLanguages] = useState<string[]>([]);
  // Замість Date | undefined – використовуємо Date | null
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  // Для statuses залишаємо AuditStatus[] (якщо Filters теж працює з AuditStatus)
  const [statuses, setStatuses] = useState<AuditStatus[]>([
    AuditStatus.UPCOMING,
    AuditStatus.ONGOING,
  ]);

  const [search, setSearch] = useState<string>("");
  const [platforms, setPlatforms] = useState<string[]>([]);
  // Якщо maxReward може бути undefined – вкажіть тип number | undefined
  const [maxReward, setMaxReward] = useState<number | undefined>();

  const {
    data: projectsData,
    isLoading,
    error,
  } = useGetW3SecurityContests(
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
    if (
      projectsData &&
      allPlatforms.length === 0 &&
      allLanguages.length === 0
    ) {
      setAllPlatforms(extractUniquePlatforms(projectsData));
      setAllLanguages(extractUniqueLanguages(projectsData));
    }
  }, [projectsData, allPlatforms, allLanguages]);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === chartRef.current) {
          setChartHeight(entry.contentRect.height);
        }
      }
    });

    if (chartRef.current) {
      observer.observe(chartRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleMaxRewardChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    if (+value < 0) {
      setMaxReward(undefined);
    } else {
      setMaxReward(value === "" ? undefined : Number(value));
    }
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
            <div className="absolute top-[calc(50%+31px)] right-[7rem] md:right-[14rem] pointer-events-none flex items-center justify-center scale-[0.5] md:scale-100">
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
