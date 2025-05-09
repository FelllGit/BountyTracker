"use client";
import {
  CircleX,
  Info,
  LoaderCircle,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
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
import { useGetW3SecurityContestsAmountByLanguage } from "@/hooks/useGetAmountByLanguage";
import { formatValue } from "@/utils/formatValue";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useMediaQuery } from "react-responsive";
import { processTimeSeriesData } from "@/utils/processTimeSeriesData";
import { ChartFilters } from "@/components/charts/StatsCharts/FilteredChartCard";

export function AmountByLanguage() {
  const [activeFilters, setActiveFilters] = useState<
    (ELanguagesNames | "All")[]
  >(["All"]);
  const {
    data: rawData,
    isLoading,
    isError,
  } = useGetW3SecurityContestsAmountByLanguage();

  const chartData = useMemo(
    () => processTimeSeriesData(rawData?.data, activeFilters),
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

  const totalAmount = useMemo((): number => {
    if (!rawData?.total || !Array.isArray(rawData.total)) {
      return 0;
    }

    if (activeFilters.includes("All")) {
      return rawData.total.reduce((sum, item) => sum + (item.number || 0), 0);
    } else {
      return rawData.total.reduce(
        (sum, item) =>
          activeFilters.includes(item.name) ? sum + (item.number || 0) : sum,
        0
      );
    }
  }, [rawData, activeFilters]);

  const isMobile = useMediaQuery({ maxWidth: 600 });

  return (
    <Card className="dark:bg-[#30302E] flex flex-col">
      <CardHeader>
        <CardTitle className="mb-2 flex gap-2">
          Contest Amount Rate By Language
          <HoverCard>
            <HoverCardTrigger>
              <Info size={15} />
            </HoverCardTrigger>
            <HoverCardContent
              side={isMobile ? "bottom" : "right"}
              className={`rounded-xl text-sm bg-transparent backdrop-blur-xl ${isMobile ? "mr-4" : "mt-20"}`}
            >
              This metric shows the number of contests with at least one active
              day in the selected month. A contest is counted in every month it
              remains active.
            </HoverCardContent>
          </HoverCard>
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
              Total Contest Amount
            </span>
            <span className="flex items-center gap-2 leading-none text-muted-foreground">
              {formatValue(totalAmount)}
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
