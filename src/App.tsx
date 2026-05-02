import { useMemo } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import theme from './theme';
import { useLeaderboard } from './hooks/useLeaderboard';
import FilterCard from './components/FilterCard';
import PodiumSection from './components/PodiumSection';
import EmployeeList from './components/EmployeeList';

const headerRowSx = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 };
const titleSx = { fontWeight: 800, color: '#0f1c2e' };
const subtitleSx = { color: '#6b7db3', mb: 3 };
const containerSx = { py: 4, overflowX: 'hidden' };

function App() {
  const { filters, setters, availableYears, rankedEmployees, filteredEmployees } = useLeaderboard();

  const top3 = useMemo(
    () => rankedEmployees.filter((e) => e.rank <= 3),
    [rankedEmployees],
  );
  const filteredIds = useMemo(
    () => new Set(filteredEmployees.map((e) => e.employee.id)),
    [filteredEmployees],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={containerSx}>
        <Box sx={headerRowSx}>
          <Typography variant="h4" sx={titleSx}>
            Leaderboard
          </Typography>
        </Box>
        <Typography variant="body2" sx={subtitleSx}>
          Top performers based on contributions and activity
        </Typography>

        <FilterCard filters={filters} setters={setters} availableYears={availableYears} />

        <PodiumSection top3={top3} filteredIds={filteredIds} />

        <EmployeeList entries={filteredEmployees} />
      </Container>
    </ThemeProvider>
  );
}

export default App;
