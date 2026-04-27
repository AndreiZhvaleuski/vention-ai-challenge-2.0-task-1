import { useState, useEffect, useMemo } from 'react';
import { generateData } from '../data/generateData';
import type { Activity, Category } from '../types';
import type { Employee } from '../types';

export interface FilteredEmployee {
  employee: Employee;
  filteredActivities: Activity[];
  totalPoints: number;
}

export interface Filters {
  year: string;
  quarter: string;
  category: string;
  search: string;
}

export interface FilterSetters {
  setYear: (v: string) => void;
  setQuarter: (v: string) => void;
  setCategory: (v: string) => void;
  setSearch: (v: string) => void;
}

const DEFAULT_SEED = 'vention2025';

export function useLeaderboard() {
  const [seed, setSeed] = useState(DEFAULT_SEED);
  const [debouncedSeed, setDebouncedSeed] = useState(DEFAULT_SEED);
  const [year, setYear] = useState('');
  const [quarter, setQuarter] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSeed(seed), 400);
    return () => clearTimeout(timer);
  }, [seed]);

  const employees = useMemo(() => generateData(debouncedSeed), [debouncedSeed]);

  const filteredEmployees = useMemo((): FilteredEmployee[] => {
    const result: FilteredEmployee[] = [];

    for (const emp of employees) {
      const nameMatch =
        search === '' ||
        `${emp.firstName} ${emp.lastName}`
          .toLowerCase()
          .includes(search.toLowerCase());

      if (!nameMatch) continue;

      const activities = emp.activities.filter((a) => {
        if (year && String(a.date.getFullYear()) !== year) return false;
        if (quarter && String(a.quarter) !== quarter.replace('Q', '')) return false;
        if (category && a.category !== category) return false;
        return true;
      });

      if (activities.length === 0) continue;

      const totalPoints = activities.reduce((sum, a) => sum + a.points, 0);
      result.push({ employee: emp, filteredActivities: activities, totalPoints });
    }

    result.sort((a, b) => b.totalPoints - a.totalPoints);
    return result;
  }, [employees, year, quarter, category, search]);

  return {
    seed,
    setSeed,
    filters: { year, quarter, category, search },
    setters: { setYear, setQuarter, setCategory, setSearch } as FilterSetters,
    filteredEmployees,
  };
}
