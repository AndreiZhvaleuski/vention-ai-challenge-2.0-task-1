import { useState, forwardRef } from 'react';
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
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Slide from '@mui/material/Slide';
import type { TransitionProps } from '@mui/material/transitions';
import CasinoIcon from '@mui/icons-material/Casino';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import theme from './theme';
import { useLeaderboard, DEFAULT_SEED } from './hooks/useLeaderboard';
import FilterCard from './components/FilterCard';
import PodiumSection from './components/PodiumSection';
import EmployeeList from './components/EmployeeList';

const SlideUp = forwardRef(function SlideUp(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function App() {
  const { seed, setSeed, filters, setters, rankedEmployees, filteredEmployees } = useLeaderboard();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inputSeed, setInputSeed] = useState(seed);
  const [copied, setCopied] = useState(false);

  const isDirty = inputSeed !== seed;
  const isEmpty = inputSeed.trim() === '';

  const handleOpen = () => {
    setInputSeed(seed);
    setDialogOpen(true);
  };

  const handleApply = () => {
    if (isEmpty) return;
    setSeed(inputSeed.trim());
    setDialogOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleApply();
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4, overflowX: 'hidden' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f1c2e' }}>
            Leaderboard
          </Typography>
          <Tooltip title="Configure dataset seed" placement="left">
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
          </Tooltip>
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

        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="xs"
          fullWidth
          TransitionComponent={SlideUp}
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CasinoIcon sx={{ color: '#6b7db3' }} />
              Seed Configuration
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ color: '#6b7db3', mb: 2 }}>
              The seed controls the generated dataset. Changing it produces a different leaderboard.
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Typography variant="body2" sx={{ color: '#6b7db3' }}>Active seed:</Typography>
              <Chip label={seed} size="small" sx={{ fontFamily: 'monospace', fontWeight: 600 }} />
            </Box>

            <TextField
              label="New seed"
              value={inputSeed}
              onChange={(e) => setInputSeed(e.target.value)}
              onKeyDown={handleKeyDown}
              fullWidth
              size="small"
              autoFocus
              autoComplete="off"
              error={isEmpty}
              helperText={isEmpty ? 'Seed cannot be empty' : `Default: ${DEFAULT_SEED}`}
              sx={{
                '& .MuiOutlinedInput-root': isDirty && !isEmpty ? {
                  '& fieldset': { borderColor: '#3d52a0' },
                } : {},
              }}
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
          <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
            <Tooltip title={copied ? 'Copied!' : 'Copy shareable link'}>
              <span>
                <IconButton size="small" onClick={handleCopyLink} aria-label="Copy shareable link">
                  {copied ? <CheckIcon fontSize="small" color="success" /> : <ContentCopyIcon fontSize="small" />}
                </IconButton>
              </span>
            </Tooltip>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button variant="contained" onClick={handleApply} disabled={!isDirty || isEmpty}>Apply</Button>
            </Box>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
}

export default App;
