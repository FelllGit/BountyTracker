import { useEffect, useState } from "react";
import { FiltersProps } from "@/interfaces/FilterProps";

export const useSavedFilters = (key: string) => {
  const [filters, setFilters] = useState<FiltersProps>(() => {
    const storedFilters = localStorage.getItem(key);
    return storedFilters ? JSON.parse(storedFilters) : {};
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(filters));
  }, [filters, key]);

  return { filters, setFilters };
};
