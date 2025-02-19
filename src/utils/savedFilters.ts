"use client";

import { useEffect, useState } from "react";
import { FiltersProps } from "@/interfaces/FilterProps";

export const useSavedFilters = (key: string) => {
  const [filters, setFilters] = useState<FiltersProps>(() => {
    if (typeof window !== "undefined") {
      try {
        const storedFilters = localStorage.getItem(key);
        if (storedFilters) {
          return JSON.parse(storedFilters);
        }
      } catch (error) {
        console.error("Error reading from localStorage:", error);
      }
    }
    return {};
  });

  useEffect(() => {
    try {
      const storedFilters = localStorage.getItem(key);
      if (storedFilters && Object.keys(filters).length === 0) {
        setFilters(JSON.parse(storedFilters));
      }
    } catch (error) {
      console.error("Error reading from localStorage:", error);
    }
  }, [key]);

  // Ефект для збереження змін
  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      try {
        localStorage.setItem(key, JSON.stringify(filters));
      } catch (error) {
        console.error("Error writing to localStorage:", error);
      }
    }
  }, [filters, key]);

  return { filters, setFilters };
};
