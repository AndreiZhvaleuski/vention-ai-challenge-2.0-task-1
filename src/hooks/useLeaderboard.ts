import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
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

interface UrlState {
  seed: string;
  year: string;
  quarter: string;
  category: string;
  search: string;
}

function readFromUrl(): UrlState {
  const params = new URLSearchParams(window.location.search);
  return {
    seed: params.get('seed') ?? DEFAULT_SEED,
    year: params.get('year') ?? '',
    quarter: params.get('quarter') ?? '',
    category: params.get('category') ?? '',
    search: params.get('search') ?? '',
  };
}

function syncToUrl(seed: string, year: string, quarter: string, category: string, search: string): void {
  const params = new URLSearchParams();
  if (seed !== DEFAULT_SEED) params.set('seed', seed);
  if (year) params.set('year', year);
  if (quarter) params.set('quarter', quarter);
  if (category) params.set('category', category);
  if (search) params.set('search', search);
  const qs = params.toString();
  window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname);
}

const initialUrlState = readFromUrl();

export function useLeaderboard() {
  const [seed, setSeedState] = useState<string>(initialUrlState.seed);
  const [debouncedSeed, setDebouncedSeed] = useState(seed);
  const [year, setYear] = useState(initialUrlState.year);
  const [quarter, setQuarter] = useState(initialUrlState.quarter);
  const [category, setCategory] = useState<Category | ''>(initialUrlState.category as Category | '');
  const [search, setSearch] = useState(initialUrlState.search);

  const setSeed = useCallback((newSeed: string) => {
    setSeedState(newSeed);
  }, []);

  // Debounce URL sync — avoids hitting history.replaceState on every keystroke.
  const urlSyncRef = useRef<number | null>(null);
  useEffect(() => {
    if (urlSyncRef.current !== null) {
      window.clearTimeout(urlSyncRef.current);
    }
    urlSyncRef.current = window.setTimeout(() => {
      syncToUrl(seed, year, quarter, category, search);
      urlSyncRef.current = null;
    }, 400);
    return () => {
      if (urlSyncRef.current !== null) {
        window.clearTimeout(urlSyncRef.current);
        urlSyncRef.current = null;
      }
    };
  }, [seed, year, quarter, category, search]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSeed(seed), 400);
    return () => clearTimeout(timer);
  }, [seed]);

  const employees = useMemo(() => getEmployeesForSeed(debouncedSeed), [debouncedSeed]);

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
    seed,
    setSeed,
    filters,
    setters,
    rankedEmployees,
    filteredEmployees,
  };
}
