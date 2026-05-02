import { useMemo } from 'react';
import Box from '@mui/material/Box';
import { colors } from '../theme';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import { format } from 'date-fns';
import type { Activity } from '../types';
import { TEST_IDS } from '../testIds';

interface Props {
  activities: Activity[];
}

export default function ActivityTable({ activities }: Props) {
  const sorted = useMemo(
    () => [...activities].sort((a, b) => b.date.getTime() - a.date.getTime()),
    [activities],
  );

  return (
    <Box sx={{ px: 2, pb: 2 }}>
      <Typography
        variant="overline"
        sx={{ fontWeight: 700, letterSpacing: 1.5, display: 'block', mb: 0.5, color: '#64748b' }}
      >
        Recent Activity
      </Typography>
      <Box sx={{ overflowX: 'hidden', maxWidth: '100%' }}>
        <Table size="small" sx={{ tableLayout: 'fixed', width: '100%', '& .MuiTableCell-root': { fontSize: { xs: '0.75rem', sm: '0.8rem' }, py: 1.25 } }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>ACTIVITY</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#64748b', width: { xs: 120, sm: 200 } }}>CATEGORY</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#64748b', width: { xs: 80, sm: 100 } }}>DATE</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: '#64748b', width: { xs: 60, sm: 60 } }}>POINTS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sorted.map((activity) => (
              <TableRow key={activity.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                <TableCell sx={{ color: 'black', fontWeight: 700 }}>{activity.title}</TableCell>
                <TableCell sx={{ width: { xs: 120, sm: 200 } }}>
                  <Chip
                    data-testid={TEST_IDS.ACTIVITY_CATEGORY}
                    label={activity.category}
                    size="small"
                    sx={{
                      bgcolor: 'grey.200',
                      color: '#64748b',
                      fontSize: { xs: '0.7rem', sm: '0.8rem' },
                      maxWidth: '100%',
                      height: 'auto',
                      '& .MuiChip-label': { whiteSpace: 'normal', py: 0.5 },
                    }}
                  />
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap', width: { xs: 85, sm: 100 }, color: '#64748b' }}>
                  {format(activity.date, 'dd-MMM-yyyy')}
                </TableCell>
                <TableCell align="right" sx={{ color: colors.accent, fontWeight: 700, fontSize: '0.8rem', width: { xs: 48, sm: 60 } }}>
                  {`+${activity.points}`}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}
