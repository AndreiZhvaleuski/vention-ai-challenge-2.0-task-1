import { useState, useEffect, useMemo } from 'react';
import { generateData } from '../data/generateData';
import type { Activity, Category } from '../types';
import type { Employee } from '../types';

export interface FilteredEmployee {
  employee: Employee;
  filteredActivities: Activity[];
  totalPoints: number;
  rank: number;
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

export const DEFAULT_SEED = 'vention-ai-challenge-2.0';

function getSeedFromUrl(): string {
  const params = new URLSearchParams(window.location.search);
  return params.get('seed') ?? DEFAULT_SEED;
}

function setSeedInUrl(seed: string): void {
  const params = new URLSearchParams(window.location.search);
  params.set('seed', seed);
  window.history.replaceState(null, '', `?${params.toString()}`);
}

export function useLeaderboard() {
  const [seed, setSeedState] = useState<string>(() => {
    const urlSeed = getSeedFromUrl();
    if (!new URLSearchParams(window.location.search).has('seed')) {
      setSeedInUrl(DEFAULT_SEED);
    }
    return urlSeed;
  });
  const [debouncedSeed, setDebouncedSeed] = useState(seed);
  const [year, setYear] = useState('');
  const [quarter, setQuarter] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [search, setSearch] = useState('');

  const setSeed = (newSeed: string) => {
    setSeedInUrl(newSeed);
    setSeedState(newSeed);
  };

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSeed(seed), 400);
    return () => clearTimeout(timer);
  }, [seed]);

  const employees = useMemo(() => generateData(debouncedSeed), [debouncedSeed]);

  const rankedEmployees = useMemo((): FilteredEmployee[] => {
    const result: Omit<FilteredEmployee, 'rank'>[] = [];

    for (const emp of employees) {
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
    return result.map((e, i) => ({ ...e, rank: i + 1 }));
  }, [employees, year, quarter, category]);

  const filteredEmployees = useMemo((): FilteredEmployee[] => {
    if (search === '') return rankedEmployees;
    return rankedEmployees.filter((e) =>
      `${e.employee.firstName} ${e.employee.lastName}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [rankedEmployees, search]);

  return {
    seed,
    setSeed,
    filters: { year, quarter, category, search },
    setters: { setYear, setQuarter, setCategory, setSearch } as FilterSetters,
    rankedEmployees,
    filteredEmployees,
  };
}
