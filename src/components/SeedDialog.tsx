import { forwardRef, memo, useCallback, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Slide from '@mui/material/Slide';
import type { TransitionProps } from '@mui/material/transitions';
import CasinoIcon from '@mui/icons-material/Casino';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { DEFAULT_SEED } from '../hooks/useLeaderboard';

const SlideUp = forwardRef(function SlideUp(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const titleRowSx = { display: 'flex', alignItems: 'center', gap: 1 };
const iconSx = { color: '#6b7db3' };
const subtitleSx = { color: '#6b7db3', mb: 2 };
const activeSeedRowSx = { display: 'flex', alignItems: 'center', gap: 1, mb: 2 };
const activeSeedLabelSx = { color: '#6b7db3' };
const activeSeedChipSx = { fontFamily: 'monospace', fontWeight: 600 };
const dirtyFieldSx = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: '#3d52a0' },
  },
};
const resetButtonSx = { mt: 1 };
const actionsSx = { justifyContent: 'space-between', px: 3, pb: 2 };
const buttonRowSx = { display: 'flex', gap: 1 };

interface Props {
  open: boolean;
  onClose: () => void;
  seed: string;
  setSeed: (s: string) => void;
}

function SeedDialog({ open, onClose, seed, setSeed }: Props) {
  const [inputSeed, setInputSeed] = useState(seed);
  const [copied, setCopied] = useState(false);

  // Reset the input every time the dialog transitions from closed -> open, or
  // when the active `seed` changes while open. This is the "adjust state when
  // a prop changes" pattern (https://react.dev/learn/you-might-not-need-an-effect).
  const [prevOpen, setPrevOpen] = useState(open);
  const [prevSeed, setPrevSeed] = useState(seed);
  if (open !== prevOpen || seed !== prevSeed) {
    setPrevOpen(open);
    setPrevSeed(seed);
    if (open) setInputSeed(seed);
  }

  const isDirty = inputSeed !== seed;
  const isEmpty = inputSeed.trim() === '';

  const handleApply = useCallback(() => {
    if (isEmpty) return;
    setSeed(inputSeed.trim());
    onClose();
  }, [isEmpty, inputSeed, setSeed, onClose]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleApply();
    },
    [handleApply],
  );

  const handleCopyLink = useCallback(async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const handleReset = useCallback(() => setInputSeed(DEFAULT_SEED), []);
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setInputSeed(e.target.value),
    [],
  );

  const fieldSx = isDirty && !isEmpty ? dirtyFieldSx : undefined;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slots={{ transition: SlideUp }}
    >
      <DialogTitle>
        <Box sx={titleRowSx}>
          <CasinoIcon sx={iconSx} />
          Seed Configuration
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={subtitleSx}>
          The seed controls the generated dataset. Changing it produces a different leaderboard.
        </Typography>

        <Box sx={activeSeedRowSx}>
          <Typography variant="body2" sx={activeSeedLabelSx}>Active seed:</Typography>
          <Chip label={seed} size="small" sx={activeSeedChipSx} />
        </Box>

        <TextField
          label="New seed"
          value={inputSeed}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          fullWidth
          size="small"
          autoFocus
          autoComplete="off"
          error={isEmpty}
          helperText={isEmpty ? 'Seed cannot be empty' : `Default: ${DEFAULT_SEED}`}
          sx={fieldSx}
        />
        <Button
          size="small"
          sx={resetButtonSx}
          onClick={handleReset}
          disabled={inputSeed === DEFAULT_SEED}
        >
          Reset to default
        </Button>
      </DialogContent>
      <DialogActions sx={actionsSx}>
        <Tooltip title={copied ? 'Copied!' : 'Copy shareable link'}>
          <span>
            <IconButton size="small" onClick={handleCopyLink} aria-label="Copy shareable link">
              {copied ? <CheckIcon fontSize="small" color="success" /> : <ContentCopyIcon fontSize="small" />}
            </IconButton>
          </span>
        </Tooltip>
        <Box sx={buttonRowSx}>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={handleApply} disabled={!isDirty || isEmpty}>Apply</Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

export default memo(SeedDialog);
