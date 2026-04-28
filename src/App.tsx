import { ThemeProvider, CssBaseline } from '@mui/material';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import theme from './theme';
import { useLeaderboard } from './hooks/useLeaderboard';
import FilterCard from './components/FilterCard';
import PodiumSection from './components/PodiumSection';
import EmployeeList from './components/EmployeeList';

function App() {
  const { filters, setters, rankedEmployees, filteredEmployees } = useLeaderboard();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4, overflowX: 'hidden' }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f1c2e', mb: 0.5 }}>
          Leaderboard
        </Typography>
        <Typography variant="body2" sx={{ color: '#6b7db3', mb: 3 }}>
          Top performers based on contributions and activity
        </Typography>

        <FilterCard
          filters={filters}
          setters={setters}
        />

        <PodiumSection top3={rankedEmployees.slice(0, 3)} />

        <EmployeeList entries={filteredEmployees} />
      </Container>
    </ThemeProvider>
  );
}

export default App;
