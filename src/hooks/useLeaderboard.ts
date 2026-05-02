import { useState, useMemo } from 'react';
import { generateData } from '../data/generateData';
import type { Activity, Category } from '../types';
import type { Employee } from '../types';

// Bounded LRU-ish cache so toggling between recently-used seeds is instant.
const SEED_CACHE_LIMIT = 5;
const seedCache = new Map<string, Employee[]>();
function getEmployeesForSeed(seed: string): Employee[] {
  const cached = seedCache.get(seed);
  if (cached) {
    // Refresh recency.
    seedCache.delete(seed);
    seedCache.set(seed, cached);
    return cached;
  }
  const data = generateData(seed);
  seedCache.set(seed, data);
  if (seedCache.size > SEED_CACHE_LIMIT) {
    const oldest = seedCache.keys().next().value;
    if (oldest !== undefined) seedCache.delete(oldest);
  }
  return data;
}

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

export function useLeaderboard() {
  const [year, setYear] = useState('');
  const [quarter, setQuarter] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [search, setSearch] = useState('');

  const employees = useMemo(() => getEmployeesForSeed(DEFAULT_SEED), []);

  const availableYears = useMemo((): string[] => {
    const yearSet = new Set<string>();
    for (const emp of employees) {
      for (const a of emp.activities) {
        yearSet.add(String(a.date.getFullYear()));
      }
    }
    return Array.from(yearSet).sort();
  }, [employees]);

  const rankedEmployees = useMemo((): FilteredEmployee[] => {
    const result: Omit<FilteredEmployee, 'rank'>[] = [];

    for (const emp of employees) {
      const activities = emp.activities.filter((a) => {
        if (year && String(a.date.getFullYear()) !== year) return false;
        if (quarter && String(a.quarter) !== quarter) return false;
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
    const needle = search.toLowerCase();
    return rankedEmployees.filter((e) =>
      `${e.employee.firstName} ${e.employee.lastName}`.toLowerCase().includes(needle),
    );
  }, [rankedEmployees, search]);

  const filters = useMemo(
    () => ({ year, quarter, category, search }),
    [year, quarter, category, search],
  );
  const setters = useMemo<FilterSetters>(
    () => ({
      setYear,
      setQuarter,
      setCategory: (v: string) => setCategory(v as Category | ''),
      setSearch,
    }),
    [],
  );

  return {
    filters,
    setters,
    availableYears,
    rankedEmployees,
    filteredEmployees,
  };
}
