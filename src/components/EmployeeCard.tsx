import { memo } from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { colors } from '../theme';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';
import Tooltip from '@mui/material/Tooltip';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import StarIcon from '@mui/icons-material/Star';
import SchoolIcon from '@mui/icons-material/School';
import CoPresentIcon from '@mui/icons-material/CoPresent';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import type { FilteredEmployee } from '../hooks/useLeaderboard';
import type { Category } from '../types';
import { TEST_IDS } from '../testIds';
import ActivityTable from './ActivityTable';

const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  Education: <SchoolIcon fontSize="small" />,
  'Public Speaking': <CoPresentIcon fontSize="small" />,
  'University Partnerships': <EmojiEmotionsIcon fontSize="small" />,
};

const CATEGORIES: Category[] = [
  'Education',
  'Public Speaking',
  'University Partnerships',
];

const rowSx = { display: 'flex', alignItems: 'center', flexWrap: { xs: 'wrap', sm: 'nowrap' }, px: 2, py: 1.5, gap: 2 };
const rankSx = { color: 'text.secondary', fontWeight: 600, minWidth: 24, textAlign: 'center' };
const avatarSx = { width: 48, height: 48, fontSize: 17 };
const nameBoxSx = { flex: 1, minWidth: 0 };
const nameSx = { fontWeight: 700 };
const titleSx = { color: 'text.secondary' };
const xsBreakSx = { display: { xs: 'block', sm: 'none' }, width: '100%', my: 0 };
const rightSx = { display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0, width: { xs: '100%', sm: 'auto' } };
const catColSx = { display: 'flex', flexDirection: 'column', alignItems: 'center', color: colors.accent };
const catCountSx = { lineHeight: 1.2, color: 'text.secondary' };
const dividerSx = { display: { xs: 'none', sm: 'flex' } };
const totalColSx = { display: { xs: 'none', sm: 'flex' }, flexDirection: 'column', alignItems: 'flex-end' };
const totalLabelSx = { color: 'text.secondary', fontWeight: 600, letterSpacing: 0.5, lineHeight: 1.2, textAlign: 'right' };
const totalRowSx = { display: 'flex', alignItems: 'center', gap: 0.5 };
const starSx = { color: colors.accent, fontSize: 22 };
const totalNumSx = { fontWeight: 700, fontSize: 20, color: colors.accent, lineHeight: 1 };
const toggleSx = { ml: { xs: 'auto', sm: 0 }, color: colors.accent, bgcolor: `${colors.accent}22`, '&:hover': { bgcolor: `${colors.accent}44` } };

const PAPER_BASE_SX = { mb: 2, overflow: 'clip', borderRadius: 3, '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.18)' } };
const PAPER_EXPANDED_SX = { ...PAPER_BASE_SX, border: `1px solid ${colors.accent}` };
const PAPER_COLLAPSED_SX = { ...PAPER_BASE_SX, border: 'none' };

const avatarImgSlotProps = { img: { loading: 'lazy' as const } };

interface Props {
  rank: number;
  id: string;
  entry: FilteredEmployee;
  isExpanded: boolean;
  onToggle: (id: string) => void;
}

function EmployeeCard({ rank, id, entry, isExpanded, onToggle }: Props) {
  const { employee, filteredActivities, totalPoints } = entry;
  const initials = `${employee.firstName[0]}${employee.lastName[0]}`;

  return (
    <Paper sx={isExpanded ? PAPER_EXPANDED_SX : PAPER_COLLAPSED_SX}>
      <Box sx={rowSx}>
        {/* Rank */}
        <Typography
          variant="body2"
          sx={rankSx}
        >
          {rank}
        </Typography>

        {/* Avatar */}
        <Avatar
          src={employee.avatarUrl}
          slotProps={avatarImgSlotProps}
          sx={{
            ...avatarSx,
            bgcolor: employee.avatarColor,
          }}
        >
          {initials}
        </Avatar>

        {/* Name & title */}
        <Box sx={nameBoxSx}>
          <Typography variant="subtitle2" data-testid={TEST_IDS.EMPLOYEE_NAME} sx={nameSx}>
            {employee.firstName} {employee.lastName}
          </Typography>
          <Typography variant="body2" sx={titleSx}>
            {employee.title} ({employee.department})
          </Typography>
        </Box>

        {/* xs row break */}
        <Divider sx={xsBreakSx} />

        {/* Right side */}
        <Box sx={rightSx}>
          {/* Per-category counts — icon stacked above count */}
          {CATEGORIES.map((cat) => {
            const count = filteredActivities.filter((a) => a.category === cat).length;
            if (count === 0) return null;
            return (
              <Tooltip key={cat} title={cat}>
                <Box sx={catColSx}>
                  {CATEGORY_ICONS[cat]}
                  <Typography variant="caption" sx={catCountSx}>{count}</Typography>
                </Box>
              </Tooltip>
            );
          })}

          <Divider orientation="vertical" flexItem sx={dividerSx} />

          {/* TOTAL label + star + points */}
          <Box sx={totalColSx}>
            <Typography variant="caption" sx={totalLabelSx}>
              TOTAL
            </Typography>
            <Box sx={totalRowSx}>
              <StarIcon sx={starSx} />
              <Typography sx={totalNumSx}>
                {totalPoints}
              </Typography>
            </Box>
          </Box>

          {/* Expand toggle */}
          <IconButton size="small" onClick={() => onToggle(id)} sx={toggleSx}>
            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>

      <Collapse in={isExpanded} unmountOnExit>
        <Divider />
        <ActivityTable activities={filteredActivities} />
      </Collapse>
    </Paper>
  );
}

export default memo(EmployeeCard);
