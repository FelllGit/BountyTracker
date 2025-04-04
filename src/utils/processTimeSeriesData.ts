import { TimeSeriesData } from "@/components/charts/StatsCharts/StatsChart";

export function processTimeSeriesData<T extends string>(
  rawData: unknown,
  activeFilters: Array<T | "All">
): TimeSeriesData<T>[] {
  if (!rawData || !Array.isArray(rawData)) return [];
  const validData = rawData.filter(
    (item): item is TimeSeriesData<T> =>
      !!item &&
      "name" in item &&
      Array.isArray(item.data) &&
      item.data.length > 0
  );
  return activeFilters.includes("All")
    ? validData
    : validData.filter((item) => activeFilters.includes(item.name));
}
