import { ThemeProvider, CssBaseline } from '@mui/material';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import theme from './theme';
import { useLeaderboard } from './hooks/useLeaderboard';
import FilterCard from './components/FilterCard';
import PodiumSection from './components/PodiumSection';
import EmployeeList from './components/EmployeeList';

function App() {
  const { seed, setSeed, filters, setters, filteredEmployees } = useLeaderboard();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
          Leaderboard
        </Typography>
        <Typography variant="subtitle1" sx={{ color: 'text.secondary', mb: 3 }}>
          Top performers based on contributions and activity.
        </Typography>

        <FilterCard
          seed={seed}
          onSeedChange={setSeed}
          filters={filters}
          setters={setters}
        />

        <PodiumSection top3={filteredEmployees.slice(0, 3)} />

        <EmployeeList entries={filteredEmployees} />
      </Container>
    </ThemeProvider>
  );
}

export default App;
