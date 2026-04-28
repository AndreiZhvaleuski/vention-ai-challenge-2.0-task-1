import { useState } from 'react';
import { keyframes } from '@emotion/react';

const spinOnce = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;
import { ThemeProvider, CssBaseline } from '@mui/material';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CasinoIcon from '@mui/icons-material/Casino';
import theme from './theme';
import { useLeaderboard, DEFAULT_SEED } from './hooks/useLeaderboard';
import FilterCard from './components/FilterCard';
import PodiumSection from './components/PodiumSection';
import EmployeeList from './components/EmployeeList';

function App() {
  const { seed, setSeed, filters, setters, rankedEmployees, filteredEmployees } = useLeaderboard();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inputSeed, setInputSeed] = useState(seed);

  const handleOpen = () => {
    setInputSeed(seed);
    setDialogOpen(true);
  };

  const handleApply = () => {
    setSeed(inputSeed);
    setDialogOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4, overflowX: 'hidden' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f1c2e' }}>
            Leaderboard
          </Typography>
          <IconButton
            onClick={handleOpen}
            size="small"
            aria-label="Configure seed"
            sx={{
              color: '#6b7db3',
              transition: 'color 0.2s',
              '&:hover': {
                color: '#3d52a0',
                '& svg': {
                  animation: `${spinOnce} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)`,
                },
              },
            }}
          >
            <CasinoIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" sx={{ color: '#6b7db3', mb: 3 }}>
          Top performers based on contributions and activity
        </Typography>

        <FilterCard
          filters={filters}
          setters={setters}
        />

        <PodiumSection top3={rankedEmployees.slice(0, 3)} />

        <EmployeeList entries={filteredEmployees} />

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle>Seed Configuration</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ color: '#6b7db3', mb: 2 }}>
              The seed controls the generated dataset. Changing it produces a different leaderboard.
            </Typography>
            <TextField
              label="Seed"
              value={inputSeed}
              onChange={(e) => setInputSeed(e.target.value)}
              fullWidth
              size="small"
              helperText={`Default: ${DEFAULT_SEED}`}
              autoComplete="off"
            />
            <Button
              size="small"
              sx={{ mt: 1 }}
              onClick={() => setInputSeed(DEFAULT_SEED)}
              disabled={inputSeed === DEFAULT_SEED}
            >
              Reset to default
            </Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleApply}>Apply</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
}

export default App;
