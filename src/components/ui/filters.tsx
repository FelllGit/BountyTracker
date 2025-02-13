"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import Icon from "@/components/icon/icon";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AuditStatus } from "@/interfaces/CrowdsourcedAudit";
import DatePicker from "@/components/ui/date-picker";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { FiltersProps } from "@/interfaces/FilterProps";

function wrapDateSetter(
  setter: React.Dispatch<React.SetStateAction<Date | null>>
): React.Dispatch<React.SetStateAction<Date | undefined>> {
  return (valueOrUpdater: React.SetStateAction<Date | undefined>) => {
    if (typeof valueOrUpdater === "function") {
      setter((prev: Date | null) => {
        const prevDate: Date | undefined = prev ?? undefined;
        const result = (
          valueOrUpdater as (prevState: Date | undefined) => Date | undefined
        )(prevDate);
        return result ?? null;
      });
    } else {
      setter(valueOrUpdater ?? null);
    }
  };
}

const FiltersContent: React.FC<FiltersProps> = ({
  search = "",
  handleSearchChange = () => {},
  languages = [],
  setLanguages = () => {},
  allLanguages = [],
  platforms = [],
  setPlatforms = () => {},
  allPlatforms = [],
  statuses = [],
  setStatuses = () => {},
  startDate = null,
  endDate = null,
  setStartDate = () => {},
  setEndDate = () => {},
  maxReward = undefined,
  handleMaxRewardChange = () => {},
  variant = "default",
}) => {
  // Updated container className to apply the same responsive layout to both variants
  const containerClassName =
    variant === "default"
      ? "flex flex-col gap-2 md:grid md:grid-cols-3 md:gap-2 xl:grid xl:grid-cols-6 xl:gap-2"
      : "flex flex-col gap-2 md:grid md:grid-cols-3 md:gap-2 xl:grid xl:grid-cols-5 xl:gap-2";

  return (
    <div className={containerClassName}>
      {/* Search */}
      <div className="relative w-full">
        <Icon
          name="Search"
          className="absolute left-3 top-[17px] h-5 w-5 -translate-y-1/2 text-card-foreground z-10"
        />
        <Input
          type="text"
          placeholder="Search company"
          className="pl-10 h-10 w-full"
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      {/* Languages */}
      <div className="w-full">
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="h-10 w-full">
            <Button variant="outline" className="flex justify-between w-full">
              <div className="flex gap-2 items-center truncate">
                <Icon name="SquareFunction" className="text-card-foreground" />
                <p
                  className={`${languages.length > 0 ? "text-accent-foreground" : "text-card-foreground"} truncate`}
                >
                  {languages.length > 0
                    ? languages.join(", ")
                    : "Select Languages"}
                </p>
              </div>
              <Icon
                name="ChevronsUpDown"
                size={13}
                className="text-card-foreground"
              />
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
                    onCheckedChange={() =>
                      setLanguages((currentLanguages) =>
                        isChecked
                          ? currentLanguages.filter((lang) => lang !== language)
                          : [...currentLanguages, language]
                      )
                    }
                  >
                    {language}
                  </DropdownMenuCheckboxItem>
                );
              })}
            </div>
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
      </div>

      {/* Platforms */}
      <div className="w-full">
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="h-10 w-full">
            <Button variant="outline" className="flex justify-between w-full">
              <div className="flex gap-2 items-center truncate">
                <Icon name="Layers" className="text-card-foreground" />
                <p
                  className={`${platforms.length > 0 ? "text-accent-foreground" : "text-card-foreground"} truncate`}
                >
                  {platforms.length > 0
                    ? platforms.join(", ")
                    : "Select Platforms"}
                </p>
              </div>
              <Icon
                name="ChevronsUpDown"
                size={13}
                className="text-card-foreground"
              />
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
                  onCheckedChange={() =>
                    setPlatforms((currentPlatforms) =>
                      isChecked
                        ? currentPlatforms.filter((plat) => plat !== platform)
                        : [...currentPlatforms, platform]
                    )
                  }
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
      </div>

      {/* DatePicker */}
      <div className="w-full">
        <DatePicker
          startDate={startDate ?? undefined}
          endDate={endDate ?? undefined}
          setStartDate={wrapDateSetter(setStartDate)}
          setEndDate={wrapDateSetter(setEndDate)}
          mode={variant === "default" ? "range" : "single"}
          className="w-full"
        />
      </div>

      {variant === "default" && (
        /* Statuses - only shown in default variant */
        <div className="w-full">
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="h-10 w-full">
              <Button variant="outline" className="flex justify-between w-full">
                <div className="flex gap-2 items-center truncate">
                  <Icon
                    name="TrendingUp"
                    className="h-fit w-fit text-card-foreground"
                  />
                  <p
                    className={`${statuses.length > 0 ? "text-accent-foreground" : "text-card-foreground"} truncate`}
                  >
                    {statuses.length > 0
                      ? statuses.join(", ")
                      : "Select Statuses"}
                  </p>
                </div>
                <Icon
                  name="ChevronsUpDown"
                  size={13}
                  className="text-card-foreground"
                />
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
                    onCheckedChange={() =>
                      setStatuses((currentStatuses) =>
                        isChecked
                          ? currentStatuses.filter((s) => s !== status)
                          : [...currentStatuses, status]
                      )
                    }
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
        </div>
      )}

      {/* Max Reward */}
      <div className="relative w-full">
        <Icon
          name="HandCoins"
          className="absolute left-3 top-[17px] h-5 w-5 -translate-y-1/2 text-card-foreground z-10"
        />
        <Input
          type="number"
          placeholder="Max reward"
          className="pl-10 h-10 w-full"
          min={0}
          value={maxReward ?? ""}
          onChange={handleMaxRewardChange}
        />
      </div>
    </div>
  );
};

const Filters: React.FC<FiltersProps> = (props) => {
  return (
    <div>
      <Accordion
        type="single"
        collapsible
        defaultValue="filters"
        className="w-full block md:hidden"
      >
        <AccordionItem value="filters">
          <AccordionTrigger className="w-full text-left border rounded-md !no-underline p-2 mb-2">
            Filters
          </AccordionTrigger>
          <AccordionContent className="border-none">
            <FiltersContent {...props} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="hidden md:block">
        <FiltersContent {...props} />
      </div>
    </div>
  );
};

export default Filters;
