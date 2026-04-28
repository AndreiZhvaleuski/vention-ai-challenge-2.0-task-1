import { useCallback, useMemo, useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CasinoIcon from '@mui/icons-material/Casino';
import theme from './theme';
import { useLeaderboard } from './hooks/useLeaderboard';
import FilterCard from './components/FilterCard';
import PodiumSection from './components/PodiumSection';
import EmployeeList from './components/EmployeeList';
import SeedDialog from './components/SeedDialog';
import { spinOnce } from './styles/animations';

const headerRowSx = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 };
const titleSx = { fontWeight: 800, color: '#0f1c2e' };
const subtitleSx = { color: '#6b7db3', mb: 3 };
const containerSx = { py: 4, overflowX: 'hidden' };
const seedButtonSx = {
  color: '#6b7db3',
  transition: 'color 0.2s',
  '&:hover': {
    color: '#3d52a0',
    '& svg': {
      animation: `${spinOnce} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)`,
    },
  },
};

function App() {
  const { seed, setSeed, filters, setters, rankedEmployees, filteredEmployees } = useLeaderboard();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpen = useCallback(() => setDialogOpen(true), []);
  const handleClose = useCallback(() => setDialogOpen(false), []);

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
          <Tooltip title="Configure dataset seed" placement="left">
            <IconButton
              onClick={handleOpen}
              size="small"
              aria-label="Configure seed"
              sx={seedButtonSx}
            >
              <CasinoIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Typography variant="body2" sx={subtitleSx}>
          Top performers based on contributions and activity
        </Typography>

        <FilterCard filters={filters} setters={setters} />

        <PodiumSection top3={top3} filteredIds={filteredIds} />

        <EmployeeList entries={filteredEmployees} />

        <SeedDialog
          open={dialogOpen}
          onClose={handleClose}
          seed={seed}
          setSeed={setSeed}
        />
      </Container>
    </ThemeProvider>
  );
}

export default App;
