import { useState } from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import type { Filters, FilterSetters } from '../hooks/useLeaderboard';

const YEARS = ['2024', '2025'];
const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'];
const CATEGORIES = ['Education', 'Public Speaking', 'University Partnerships'];

interface Props {
  filters: Filters;
  setters: FilterSetters;
}

export default function FilterCard({ filters, setters }: Props) {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 1.5,
          alignItems: { xs: 'stretch', md: 'center' },
        }}
      >
        <FormControl size="small" sx={{ flex: { md: 1 } }}>
          <Select
            displayEmpty
            value={filters.year}
            sx={{ backgroundColor: 'grey.100' }}
            onChange={(e) => setters.setYear(e.target.value)}
            renderValue={(value) => value || 'All Years'}
            inputProps={{ 'aria-label': 'All Years' }}
          >
            <MenuItem value="">All Years</MenuItem>
            {YEARS.map((y) => (
              <MenuItem key={y} value={y}>{y}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ flex: { md: 1 } }}>
          <Select
            displayEmpty
            value={filters.quarter}
            sx={{ backgroundColor: 'grey.100' }}
            onChange={(e) => setters.setQuarter(e.target.value)}
            renderValue={(value) => value || 'All Quarters'}
            inputProps={{ 'aria-label': 'All Quarters' }}
          >
            <MenuItem value="">All Quarters</MenuItem>
            {QUARTERS.map((q) => (
              <MenuItem key={q} value={q}>{q}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ flex: { md: 1 } }}>
          <Select
            displayEmpty
            value={filters.category}
            sx={{ backgroundColor: 'grey.100' }}
            onChange={(e) => setters.setCategory(e.target.value)}
            renderValue={(value) => value || 'All Categories'}
            inputProps={{ 'aria-label': 'All Categories' }}
          >
            <MenuItem value="">All Categories</MenuItem>
            {CATEGORIES.map((c) => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          placeholder="Search employee..."
          value={filters.search}
          onChange={(e) => setters.setSearch(e.target.value)}
          size="small"
          sx={{ flex: { md: 2 }, '& .MuiOutlinedInput-root': { backgroundColor: 'grey.100' } }}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          slotProps={{
            input: {
              startAdornment: !searchFocused ? (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ) : null,
              endAdornment: filters.search ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setters.setSearch('')}>
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
