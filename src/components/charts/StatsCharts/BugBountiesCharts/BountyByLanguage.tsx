"use client";
import { CircleX, LoaderCircle, TrendingDown, TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState, useMemo } from "react";
import { StatsChart } from "@/components/charts/StatsCharts/StatsChart";
import { ELanguagesNames } from "@/interfaces/LanguagesNames";
import { useGetW3SecurityContestsRewardByLanguageBB } from "@/hooks/useGetRewardByLanguageBB";
import numeral from "numeral";
import { processTimeSeriesData } from "@/utils/processTimeSeriesData";
import { ChartFilters } from "@/components/charts/StatsCharts/FilteredChartCard";

export function BountyByLanguageBB() {
  const [activeFilters, setActiveFilters] = useState<
    (ELanguagesNames | "All")[]
  >(["All"]);
  const {
    data: rawData,
    isLoading,
    isError,
  } = useGetW3SecurityContestsRewardByLanguageBB();

  const chartData = useMemo(
    () => processTimeSeriesData(rawData, activeFilters),
    [rawData, activeFilters]
  );

  const chartContainerStyle = {
    height: "300px",
    width: "100%",
  };

  const getQuarter = (date: Date): number => {
    return Math.floor(date.getMonth() / 3) + 1;
  };

  const currentDate: Date = new Date();
  const currentYear: number = currentDate.getFullYear();
  const currentQuarter: number = getQuarter(currentDate);

  const previousQuarterDate =
    currentQuarter === 1
      ? new Date(currentYear - 1, 9, 1) // Q4 минулого року
      : new Date(currentYear, (currentQuarter - 2) * 3, 1);

  const beforePreviousQuarterDate =
    currentQuarter === 1
      ? new Date(currentYear - 1, 6, 1) // Q3 минулого року
      : new Date(currentYear, (currentQuarter - 3) * 3, 1);

  const previousQuarterLabel = `${Math.floor(previousQuarterDate.getMonth() / 3) + 1} quarter ${previousQuarterDate.getFullYear()}`;
  const beforePreviousQuarterLabel = `${Math.floor(beforePreviousQuarterDate.getMonth() / 3) + 1} quarter ${beforePreviousQuarterDate.getFullYear()}`;

  const trend: number | null = useMemo((): number | null => {
    if (!chartData || chartData.length === 0) return null;

    let previousTotal = 0;
    let beforePreviousTotal = 0;

    chartData.forEach((platformData) => {
      platformData.data.forEach(({ date, value }) => {
        const d = new Date(date);
        const quarter = getQuarter(d);
        const year = d.getFullYear();

        if (
          year === previousQuarterDate.getFullYear() &&
          quarter === getQuarter(previousQuarterDate)
        ) {
          previousTotal += value;
        } else if (
          year === beforePreviousQuarterDate.getFullYear() &&
          quarter === getQuarter(beforePreviousQuarterDate)
        ) {
          beforePreviousTotal += value;
        }
      });
    });

    if (beforePreviousTotal === 0) return null;
    return ((previousTotal - beforePreviousTotal) / beforePreviousTotal) * 100;
  }, [chartData]);

  const totalTimeValue = useMemo((): number => {
    if (!chartData || chartData.length === 0) return 0;
    let total = 0;
    chartData.forEach((platformData) => {
      if (platformData.data && platformData.data.length > 0) {
        const lastEntry = platformData.data[platformData.data.length - 1];
        total += lastEntry.value;
      }
    });
    return total;
  }, [chartData]);

  return (
    <Card className="dark:bg-[#30302E] flex flex-col">
      <CardHeader>
        <CardTitle className="mb-2">
          Bug Bounty Reward Rate By Language
        </CardTitle>
        <CardDescription>
          <ChartFilters
            filters={Object.values(ELanguagesNames)}
            activeFilters={activeFilters}
            setActiveFilters={setActiveFilters}
          />
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <LoaderCircle className="animate-spin" size={40} />
          </div>
        ) : isError ? (
          <div className="flex h-64 items-center justify-center">
            <CircleX size={40} />
          </div>
        ) : chartData.length > 0 ? (
          <div style={chartContainerStyle}>
            <StatsChart
              data={chartData}
              yAxisName="Rewards"
              aggregationMode="month"
              tickInterval={100000}
            />
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center">
            <div className="text-center text-muted-foreground">
              <p>No data available</p>
              <p className="text-xs mt-2">
                {rawData ? "Data format issue detected" : "No data from API"}
              </p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex w-full justify-between items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {trend !== null ? (
                <>
                  {trend >= 0
                    ? `Trending up by ${trend.toFixed(1)}%`
                    : `Trending down by ${(trend * -1).toFixed(1)}%`}
                  {trend >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                </>
              ) : (
                "Not enough data to calculate trend"
              )}
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {beforePreviousQuarterLabel} - {previousQuarterLabel}
            </div>
          </div>
          <div className="flex flex-col gap-2 w-fit">
            <span className="flex items-center gap-2 font-medium leading-none">
              Total Bounty Value
            </span>
            <span className="flex items-center gap-2 leading-none text-muted-foreground">
              {numeral(totalTimeValue).format("$0.00a")}
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
