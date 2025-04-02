"use client";

import { Area, AreaChart, Brush, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from "@/components/ui/chart";
import { getEnumColors } from "@/utils/getColor";
import { useEffect, useMemo, useState } from "react";
import { formatValue } from "@/utils/formatValue";
import image from "./../../../media/img/VigilSeek_logo.png";

type ChartDataPoint = {
  [key: string]: string | number;
};

type ChartConfig = {
  [key: string]: {
    label: string;
    color: string;
  };
};

export type TimeSeriesData<T extends string> = {
  name: T;
  data: {
    date: string;
    value: number;
  }[];
};

type AggregatedDataPoint = {
  date: string;
  value: number;
};

type AggregatedSeries<T extends string> = {
  name: T;
  data: AggregatedDataPoint[];
};

export interface StatsChartProps<T extends string> {
  data: TimeSeriesData<T>[];
  xAxisKey?: string;
  xValues?: string[];
  yAxisName?: string;
  tickInterval?: number;
  aggregationMode?: "month" | "quarter" | "year";
  useLogScale?: boolean;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    dataKey: string;
    // Add other properties that might be in your payload
  }>;
  label?: string;
  chartConfig: ChartConfig;
}

// Custom tooltip component that shows all platforms with zeros for missing data
const CustomTooltipContent = ({
  active,
  payload,
  label,
  chartConfig,
}: CustomTooltipProps): JSX.Element | null => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const allPlatforms: string[] = Object.keys(chartConfig || {});
  const valueMap: Record<string, number> = {};
  payload.forEach((entry) => {
    valueMap[entry.name] = entry.value || 0;
  });

  const completeList = allPlatforms.map((platform) => ({
    name: platform,
    value: valueMap[platform] || 0,
    color: chartConfig[platform]?.color || "#888888",
  }));

  completeList.sort((a, b) => b.value - a.value);
  const total: number = completeList.reduce(
    (sum, entry) => sum + entry.value,
    0
  );

  return (
    <div className="rounded-md border bg-background p-2 shadow-md">
      <div className="font-medium">{label}</div>
      <div className="pt-1">
        {completeList.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center py-1">
            <div
              className="mr-2 h-2 w-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="truncate text-sm">
              {entry.name} - {entry.value.toLocaleString()}
            </span>
          </div>
        ))}
        <div className="flex items-center py-1">
          <div className="mr-2 h-2 w-2 rounded-full" />
          <span className="truncate text-sm">
            Total - {total.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export function StatsChart<T extends string>({
  data,
  xAxisKey = "month",
  yAxisName = "Value",
  aggregationMode = "month",
}: StatsChartProps<T>): JSX.Element {
  // Format date based on aggregation mode
  const formatDate = (dateStr: string): string => {
    try {
      const d = new Date(dateStr);

      if (aggregationMode === "month") {
        return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}`;
      } else if (aggregationMode === "quarter") {
        const quarter = Math.floor(d.getMonth() / 3) + 1;
        return `${d.getFullYear()}.Q${quarter}`;
      } else {
        // year
        return `${d.getFullYear()}`;
      }
    } catch (error) {
      console.error("Error formatting date:", dateStr, error);
      return dateStr;
    }
  };

  // Use useMemo for dataKeys stability
  const dataKeys = useMemo(() => data.map((item) => item.name), [data]);

  const [colors, setColors] = useState<Record<string, string>>({});
  const [chartConfig, setChartConfig] = useState<ChartConfig>({});
  const [debugMessage, setDebugMessage] = useState<string>("");

  // Set up colors and chart config
  useEffect(() => {
    try {
      // Get colors for each platform/language
      const newColors: Record<string, string> = getEnumColors(dataKeys);

      // Create chart config with labels and colors
      const newChartConfig: ChartConfig = Object.fromEntries(
        dataKeys.map((key) => [
          key,
          {
            label: key,
            color: newColors[key],
          },
        ])
      ) as ChartConfig;

      setColors(newColors);
      setChartConfig(newChartConfig);

      console.log("Chart colors:", newColors);
      console.log("Chart config:", newChartConfig);
      console.log("Data keys:", dataKeys);
    } catch (error) {
      console.error("Error setting up colors:", error);
      setDebugMessage(`Error setting colors: ${error}`);
    }
  }, [dataKeys]);

  // Find the earliest date across all series
  const earliestDate = useMemo(() => {
    if (!data || data.length === 0) {
      return "";
    }

    let earliest = new Date().toISOString(); // Start with current date

    data.forEach((series) => {
      if (series.data && series.data.length > 0) {
        series.data.forEach((point) => {
          if (point.date < earliest) {
            earliest = point.date;
          }
        });
      }
    });

    console.log(`Earliest date across all series: ${earliest}`);
    return formatDate(earliest);
  }, [data, formatDate]);

  // Aggregate data based on selected time period (month/quarter/year)
  const aggregatedData = useMemo(() => {
    if (!data || data.length === 0) {
      setDebugMessage("No data available");
      return [];
    }

    try {
      const result: AggregatedSeries<T>[] = [];

      data.forEach((series) => {
        // Skip series with no data
        if (!series.data || series.data.length === 0) {
          console.log(`Series ${series.name} has no data`);
          return;
        }

        console.log(
          `Processing series ${series.name} with ${series.data.length} data points`
        );

        // Group data points by formatted date
        const groupedData: Record<string, number> = {};

        series.data.forEach((point) => {
          const formattedDate = formatDate(point.date);
          groupedData[formattedDate] =
            (groupedData[formattedDate] || 0) + point.value;
        });

        // Convert grouped data back to array format
        const aggregatedPoints: AggregatedDataPoint[] = Object.entries(
          groupedData
        ).map(([date, value]) => ({
          date,
          value,
        }));

        // Only add series if it has data points
        if (aggregatedPoints.length > 0) {
          result.push({
            name: series.name,
            data: aggregatedPoints,
          });
        }
      });

      console.log(`Aggregated ${result.length} series with data`);

      // Debug each series
      result.forEach((series) => {
        console.log(`${series.name}: ${series.data.length} aggregated points`);
        if (series.data.length > 0) {
          console.log(
            `  Sample point: ${series.data[0].date} = ${series.data[0].value}`
          );
          console.log(
            `  Max value: ${Math.max(...series.data.map((p) => p.value))}`
          );
        }
      });

      return result;
    } catch (error) {
      console.error("Error aggregating data:", error);
      setDebugMessage(`Error aggregating data: ${error}`);
      return [] as AggregatedSeries<T>[];
    }
  }, [data, aggregationMode, formatDate]);

  // Convert aggregated data to chart format, ensuring all series start from the earliest date
  const chartData = useMemo(() => {
    if (!aggregatedData || aggregatedData.length === 0 || !earliestDate) {
      console.log("No aggregated data to convert to chart format");
      return [] as ChartDataPoint[];
    }

    try {
      // First, collect all unique time periods
      const timePointsSet = new Set<string>();

      // Ensure we have complete continuous date range from earliest date
      // We need to expand our earliest date detection to include raw date strings
      let rawEarliestDate = "";
      data.forEach((series) => {
        if (series.data && series.data.length > 0) {
          series.data.forEach((point) => {
            if (!rawEarliestDate || point.date < rawEarliestDate) {
              rawEarliestDate = point.date;
            }
          });
        }
      });

      console.log(`Raw earliest date found: ${rawEarliestDate}`);

      if (rawEarliestDate) {
        // Generate a continuous range of dates from the earliest to the latest
        const earliestMoment = new Date(rawEarliestDate);
        let latestMoment = new Date();

        // Find the latest date in the data
        data.forEach((series) => {
          if (series.data && series.data.length > 0) {
            series.data.forEach((point) => {
              const pointDate = new Date(point.date);
              if (pointDate > latestMoment) {
                latestMoment = pointDate;
              }
            });
          }
        });

        // Generate all months/quarters/years between earliest and latest
        const current = new Date(earliestMoment);
        while (current <= latestMoment) {
          const formattedDate = formatDate(current.toISOString());
          timePointsSet.add(formattedDate);

          // Increment based on aggregation mode
          if (aggregationMode === "month") {
            current.setMonth(current.getMonth() + 1);
          } else if (aggregationMode === "quarter") {
            current.setMonth(current.getMonth() + 3);
          } else {
            // year
            current.setFullYear(current.getFullYear() + 1);
          }
        }
      }

      // Also add any existing dates from the aggregated data to ensure we don't miss any
      aggregatedData.forEach((series) => {
        series.data.forEach((point: AggregatedDataPoint) => {
          timePointsSet.add(point.date);
        });
      });

      // Sort time points
      const timePoints = Array.from(timePointsSet).sort();
      console.log(
        `Found ${timePoints.length} unique time points from ${timePoints[0]} to ${timePoints[timePoints.length - 1]}`
      );

      // Create chart data points
      const result: ChartDataPoint[] = timePoints.map((timePoint) => {
        const dataPoint: ChartDataPoint = { [xAxisKey]: timePoint };

        aggregatedData.forEach((series) => {
          const matchingPoint = series.data.find(
            (point: AggregatedDataPoint) => point.date === timePoint
          );
          dataPoint[series.name] = matchingPoint ? matchingPoint.value : 0;
        });

        return dataPoint;
      });

      console.log(`Generated ${result.length} chart data points`);

      // Debug first data point to ensure all series are represented
      if (result.length > 0) {
        const firstPoint = result[0];
        console.log("First chart data point:", firstPoint);
        aggregatedData.forEach((series) => {
          console.log(`  ${series.name} value: ${firstPoint[series.name]}`);
        });
      }

      return result;
    } catch (error) {
      console.error("Error converting to chart format:", error);
      setDebugMessage(`Error creating chart data: ${error}`);
      return [] as ChartDataPoint[];
    }
  }, [aggregatedData, xAxisKey, earliestDate]);

  // Find min and max values for proper scaling
  const valueRange = useMemo(() => {
    if (!aggregatedData || aggregatedData.length === 0)
      return { min: 0, max: 1000000 };

    try {
      let min = Infinity;
      let max = -Infinity;

      aggregatedData.forEach((series) => {
        series.data.forEach((point: AggregatedDataPoint) => {
          // Consider all values, including zeros
          if (point.value < min) min = point.value;
          if (point.value > max) max = point.value;
        });
      });

      // Set absolute minimum to 0 for linear scale
      min = 0;

      // Add some buffer for the max value (10% extra space)
      max = max === -Infinity ? 1000000 : max * 1.1;

      console.log(`Value range across all series: ${min} to ${max}`);
      return { min, max };
    } catch (error) {
      console.error("Error calculating value range:", error);
      return { min: 0, max: 1000000 };
    }
  }, [aggregatedData]);

  // Generate appropriate ticks for Y axis
  const yAxisTicks = useMemo(() => {
    const { max } = valueRange;

    // Create custom ticks based on data range
    // We'll create around 5-6 ticks evenly distributed
    const ticks = [];
    const tickCount = 5;

    for (let i = 0; i <= tickCount; i++) {
      ticks.push(Math.round((max * i) / tickCount));
    }

    return ticks;
  }, [valueRange]);

  // Early return if not ready
  if (Object.keys(colors).length === 0 || chartData.length === 0) {
    return (
      <div className="flex h-64 w-full items-center justify-center text-muted-foreground p-4">
        <div className="text-center">
          <p>No chart data available</p>
          {debugMessage && <p className="text-xs mt-2">{debugMessage}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <div className="absolute top-1/3 right-1/2 pointer-events-none flex items-center justify-center scale-[0.5] md:scale-100 dark:invert">
        <div className="absolute pointer-events-none flex items-center justify-center z-10">
          <div className="flex items-center max-w-[800px] w-full">
            <div className="relative w-[60px] h-[60px]">
              <img
                src={image.src}
                alt="VigilSeek Logo"
                className="object-cover"
                style={{ width: "60px", height: "60px", opacity: 0.3 }}
                sizes="60px"
              />
            </div>
            <span
              className="text-4xl font-bold -ml-2 text-gray-600"
              style={{ opacity: 0.3 }}
            >
              VigilSeek
            </span>
          </div>
        </div>
      </div>
      <ChartContainer config={chartConfig} className="h-full w-full">
        <AreaChart
          data={chartData}
          margin={{ left: 10, right: 10, top: 12, bottom: 12 }}
          height={300}
        >
          <CartesianGrid vertical={false} strokeOpacity={0.2} />
          <XAxis
            dataKey={xAxisKey}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            interval="preserveStartEnd"
          />
          <YAxis
            name={yAxisName}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            scale="linear"
            domain={[0, valueRange.max]}
            ticks={yAxisTicks}
            allowDataOverflow={false}
            tickFormatter={(tick) => formatValue(tick)}
          />
          <ChartTooltip
            cursor
            content={<CustomTooltipContent chartConfig={chartConfig} />}
          />
          <ChartLegend content={<ChartLegendContent />} />
          {dataKeys.map((key) => (
            <Area
              key={key}
              type="linear"
              dataKey={key}
              name={key}
              stroke={colors[key]}
              fill={colors[key]}
              fillOpacity={0.1}
              strokeWidth={2}
              isAnimationActive
              connectNulls={true}
            />
          ))}
          <Brush
            className="w-full"
            dataKey={xAxisKey}
            height={40}
            stroke={"#8884d8"}
            fill="hsl(var(--background))"
            travellerWidth={10}
            startIndex={0}
            endIndex={chartData.length - 1}
          >
            <AreaChart>
              {dataKeys.map((key) => (
                <Area
                  key={key}
                  type="linear"
                  dataKey={key}
                  name={key}
                  stroke={colors[key]}
                  fill={colors[key]}
                  fillOpacity={0.1}
                  strokeWidth={1}
                  isAnimationActive={false}
                />
              ))}
            </AreaChart>
          </Brush>
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
