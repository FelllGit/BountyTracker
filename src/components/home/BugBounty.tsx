"use client";
import { useEffect, useState, useRef } from "react";
import { bugBountyTableColumns } from "@/components/home/bugBunty/bugBountyTableColumns";
import { DataTable } from "./data-table";
import Icon from "@/components/icon/icon";
import { Input } from "@/components/ui/input";
import DatePicker from "@/components/ui/date-picker";
import { useGetW3BugBounties } from "@/hooks/useGetW3BugBounties";
import { BugBounty } from "@/interfaces/BugBounty";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { extractUniquePlatforms } from "@/utils/platformUtils";
import { extractUniqueLanguages } from "@/utils/languageUtils";

const PAGE_SIZE = 20;

const BugBountyTable = () => {
  const [displayedData, setDisplayedData] = useState<BugBounty[]>([]);
  const loader = useRef(null);
  const [page, setPage] = useState(0);

  const [languages, setLanguages] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>();

  const [search, setSearch] = useState<string>("");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [maxReward, setMaxReward] = useState<number | undefined>();

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
    if (bugBounties && allPlatforms.length === 0 && allLanguages.length === 0) {
      setAllPlatforms(extractUniquePlatforms(bugBounties));
      setAllLanguages(extractUniqueLanguages(bugBounties));
    }
  }, [bugBounties, allPlatforms, allLanguages]);

  useEffect(() => {
    setPage(0);
    if (bugBounties) {
      setDisplayedData(bugBounties.slice(0, PAGE_SIZE));
    }
  }, [bugBounties, search, platforms, maxReward, languages, startDate]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && bugBounties) {
          const nextPage = page + 1;
          const nextData = bugBounties.slice(0, nextPage * PAGE_SIZE);
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
  }, [isLoading, bugBounties, page]);

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
            <div className="max-h-80 overflow-y-scroll">
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
            </div>
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
          </DropdownMenuContent>
        </DropdownMenu>
        <DatePicker
          startDate={startDate}
          setStartDate={setStartDate}
          mode="single"
        />
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
      {error ? (
        <p>Error: {error.message}</p>
      ) : (
        <DataTable
          columns={bugBountyTableColumns}
          data={displayedData}
          isLoading={isLoading}
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
