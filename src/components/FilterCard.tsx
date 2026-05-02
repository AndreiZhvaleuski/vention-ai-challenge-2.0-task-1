import { memo, useCallback, useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import type { Filters, FilterSetters } from '../hooks/useLeaderboard';

const QUARTERS = ['1', '2', '3', '4'];
const CATEGORIES = ['Education', 'Public Speaking', 'University Partnerships'];

const paperSx = { p: 2, mb: 3, borderRadius: 2, borderColor: 'grey.200' };
const rowSx = {
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' },
  gap: 1.5,
  alignItems: { xs: 'stretch', md: 'center' },
};
const selectFlexSx = { flex: { md: 1 } };
const neutralOutline = {
  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#000', borderWidth: '1px' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#000', borderWidth: '1px' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#000', borderWidth: '2px' },
};
const selectFieldSx = { backgroundColor: 'grey.100', ...neutralOutline };
const searchSx = {
  flex: { md: 2 },
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'grey.100',
    ...neutralOutline,
  },
};
const searchIconSx = { color: 'text.secondary' };
const yearAria = { 'aria-label': 'All Years' };
const quarterAria = { 'aria-label': 'All Quarters' };
const categoryAria = { 'aria-label': 'All Categories' };

const renderYear = (value: string) => value || 'All Years';
const renderQuarter = (value: string) => value ? `Q${value}` : 'All Quarters';
const renderCategory = (value: string) => value || 'All Categories';

interface Props {
  filters: Filters;
  setters: FilterSetters;
  availableYears: string[];
}

function FilterCard({ filters, setters, availableYears }: Props) {
  const [searchFocused, setSearchFocused] = useState(false);
  // Local controlled value so the hook's debounced search doesn't lag the input.
  const [searchInput, setSearchInput] = useState(filters.search);

  // Debounce propagation to the leaderboard filter (~250ms).
  useEffect(() => {
    if (searchInput === filters.search) return;
    const t = setTimeout(() => setters.setSearch(searchInput), 250);
    return () => clearTimeout(t);
  }, [searchInput, filters.search, setters]);

  const handleYear = useCallback(
    (e: SelectChangeEvent<string>) => setters.setYear(e.target.value),
    [setters],
  );
  const handleQuarter = useCallback(
    (e: SelectChangeEvent<string>) => setters.setQuarter(e.target.value),
    [setters],
  );
  const handleCategory = useCallback(
    (e: SelectChangeEvent<string>) => setters.setCategory(e.target.value),
    [setters],
  );
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setSearchInput(e.target.value),
    [],
  );
  const handleSearchClear = useCallback(() => {
    setSearchInput('');
    setters.setSearch('');
  }, [setters]);
  const handleFocus = useCallback(() => setSearchFocused(true), []);
  const handleBlur = useCallback(() => setSearchFocused(false), []);

  return (
    <Paper variant="outlined" sx={paperSx}>
      <Box sx={rowSx}>
        <FormControl size="small" sx={selectFlexSx}>
          <Select
            displayEmpty
            value={filters.year}
            sx={selectFieldSx}
            onChange={handleYear}
            renderValue={renderYear}
            inputProps={yearAria}
          >
            <MenuItem value="">All Years</MenuItem>
            {availableYears.map((y) => (
              <MenuItem key={y} value={y}>{y}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={selectFlexSx}>
          <Select
            displayEmpty
            value={filters.quarter}
            sx={selectFieldSx}
            onChange={handleQuarter}
            renderValue={renderQuarter}
            inputProps={quarterAria}
          >
            <MenuItem value="">All Quarters</MenuItem>
            {QUARTERS.map((q) => (
              <MenuItem key={q} value={q}>Q{q}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={selectFlexSx}>
          <Select
            displayEmpty
            value={filters.category}
            sx={selectFieldSx}
            onChange={handleCategory}
            renderValue={renderCategory}
            inputProps={categoryAria}
          >
            <MenuItem value="">All Categories</MenuItem>
            {CATEGORIES.map((c) => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          placeholder="Search employee..."
          value={searchInput}
          onChange={handleSearchChange}
          size="small"
          sx={searchSx}
          onFocus={handleFocus}
          onBlur={handleBlur}
          slotProps={{
            input: {
              startAdornment: !searchFocused ? (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={searchIconSx} />
                </InputAdornment>
              ) : null,
              endAdornment: searchInput ? (
                <InputAdornment position="end">
                  <IconButton size="small" aria-label="Clear search" onClick={handleSearchClear}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : null,
            },
          }}
        />
      </Box>
    </Paper>
  );
}

export default memo(FilterCard);
