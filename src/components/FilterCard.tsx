import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import type { Filters, FilterSetters } from '../hooks/useLeaderboard';

const YEARS = ['2024', '2025'];
const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'];
const CATEGORIES = ['Education', 'Public Speaking', 'University Partnerships'];

interface Props {
  seed: string;
  onSeedChange: (v: string) => void;
  filters: Filters;
  setters: FilterSetters;
}

export default function FilterCard({ seed, onSeedChange, filters, setters }: Props) {
  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          label="Data Seed"
          value={seed}
          onChange={(e) => onSeedChange(e.target.value)}
          size="small"
          sx={{ minWidth: 160 }}
        />

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>All Years</InputLabel>
          <Select
            value={filters.year}
            label="All Years"
            onChange={(e) => setters.setYear(e.target.value)}
          >
            <MenuItem value="">All Years</MenuItem>
            {YEARS.map((y) => (
              <MenuItem key={y} value={y}>{y}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>All Quarters</InputLabel>
          <Select
            value={filters.quarter}
            label="All Quarters"
            onChange={(e) => setters.setQuarter(e.target.value)}
          >
            <MenuItem value="">All Quarters</MenuItem>
            {QUARTERS.map((q) => (
              <MenuItem key={q} value={q}>{q}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 210 }}>
          <InputLabel>All Categories</InputLabel>
          <Select
            value={filters.category}
            label="All Categories"
            onChange={(e) => setters.setCategory(e.target.value)}
          >
            <MenuItem value="">All Categories</MenuItem>
            {CATEGORIES.map((c) => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          placeholder="Search employees"
          value={filters.search}
          onChange={(e) => setters.setSearch(e.target.value)}
          size="small"
          sx={{ flexGrow: 1, minWidth: 180 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
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
