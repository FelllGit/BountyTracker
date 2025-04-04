import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";

interface ChartFiltersProps<T extends string> {
  filters: T[];
  activeFilters: Array<T | "All">;
  setActiveFilters: Dispatch<SetStateAction<Array<T | "All">>>;
}

export function ChartFilters<T extends string>({
  filters,
  activeFilters,
  setActiveFilters,
}: ChartFiltersProps<T>) {
  const toggleFilter = (filter: T | "All"): void => {
    setActiveFilters((prevFilters: Array<T | "All">): Array<T | "All"> => {
      if (filter === "All") return ["All"];

      const withoutAll = prevFilters.filter((f): f is T => f !== "All");
      if (withoutAll.includes(filter)) {
        const updatedFilters = withoutAll.filter((f) => f !== filter);
        return updatedFilters.length ? updatedFilters : ["All"];
      }

      return [...withoutAll, filter];
    });
  };

  return (
    <div className="flex gap-2 overflow-y-scroll">
      <Button
        variant={activeFilters.includes("All") ? "default" : "secondary"}
        onClick={() => toggleFilter("All")}
      >
        All
      </Button>
      {filters.map((filter) => (
        <Button
          key={filter}
          variant={activeFilters.includes(filter) ? "default" : "secondary"}
          onClick={() => toggleFilter(filter)}
        >
          {filter}
        </Button>
      ))}
    </div>
  );
}
