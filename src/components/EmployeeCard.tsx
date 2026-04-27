import { useState } from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
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
import PresentToAllIcon from '@mui/icons-material/PresentToAll';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import type { FilteredEmployee } from '../hooks/useLeaderboard';
import type { Category } from '../types';
import ActivityTable from './ActivityTable';

const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  Education: <SchoolIcon fontSize="small" />,
  'Public Speaking': <PresentToAllIcon fontSize="small" />,
  'University Partnerships': <AccountBalanceIcon fontSize="small" />,
};

const CATEGORIES: Category[] = [
  'Education',
  'Public Speaking',
  'University Partnerships',
];

interface Props {
  rank: number;
  entry: FilteredEmployee;
}

export default function EmployeeCard({ rank, entry }: Props) {
  const [expanded, setExpanded] = useState(false);
  const { employee, filteredActivities, totalPoints } = entry;
  const initials = `${employee.firstName[0]}${employee.lastName[0]}`;

  return (
    <Paper sx={{ mb: 1, overflow: 'hidden', borderRadius: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1.5, gap: 2 }}>
        {/* Rank */}
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary', fontWeight: 600, minWidth: 24, textAlign: 'center' }}
        >
          {rank}
        </Typography>

        {/* Avatar */}
        <Avatar
          src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${employee.id}`}
          sx={{
            bgcolor: employee.avatarColor,
            width: 48,
            height: 48,
            fontSize: 17,
          }}
        >
          {initials}
        </Avatar>

        {/* Name & title */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }} noWrap>
            {employee.firstName} {employee.lastName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {employee.title} ({employee.department})
          </Typography>
        </Box>

        {/* Right side */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
          {/* Per-category counts — icon stacked above count */}
          {CATEGORIES.map((cat) => {
            const count = filteredActivities.filter((a) => a.category === cat).length;
            if (count === 0) return null;
            return (
              <Tooltip key={cat} title={cat}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'text.secondary' }}>
                  {CATEGORY_ICONS[cat]}
                  <Typography variant="caption" sx={{ lineHeight: 1.2 }}>{count}</Typography>
                </Box>
              </Tooltip>
            );
          })}

          <Divider orientation="vertical" flexItem />

          {/* TOTAL label + star + points */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: 0.5, lineHeight: 1.2 }}>
              TOTAL
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <StarIcon sx={{ color: '#0ea5e9', fontSize: 22 }} />
              <Typography sx={{ fontWeight: 700, fontSize: 20, color: '#0ea5e9', lineHeight: 1 }}>
                {totalPoints}
              </Typography>
            </Box>
          </Box>

          {/* Expand toggle */}
          <IconButton size="small" onClick={() => setExpanded((p) => !p)} sx={{ color: '#0ea5e9' }}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>

      <Collapse in={expanded} unmountOnExit>
        <Divider />
        <ActivityTable activities={filteredActivities} />
      </Collapse>
    </Paper>
  );
}
