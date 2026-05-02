import { useMemo } from 'react';
import Box from '@mui/material/Box';
import { colors } from '../theme';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
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
      <Box sx={{ overflowX: 'auto', maxWidth: '100%' }}>
        <Table size="small" sx={{ tableLayout: 'fixed', width: '100%', minWidth: 460, '& .MuiTableCell-root': { fontSize: { xs: '0.75rem', sm: '0.8rem' }, py: 1.25 } }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>ACTIVITY</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#64748b', width: { xs: 130, sm: 170 } }}>CATEGORY</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#64748b', width: { xs: 95, sm: 110 } }}>DATE</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: '#64748b', width: { xs: 75, sm: 80 } }}>POINTS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sorted.map((activity) => (
              <TableRow key={activity.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                <TableCell sx={{ color: 'black', fontWeight: 700 }}>{activity.title}</TableCell>
                <TableCell sx={{ width: { xs: 130, sm: 170 } }}>
                  <Typography
                    data-testid={TEST_IDS.ACTIVITY_CATEGORY}
                    sx={{
                      display: 'inline-block',
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      color: '#64748b',
                      bgcolor: 'grey.200',
                      borderRadius: 1,
                      px: 0.75,
                      py: 0.25,
                      maxWidth: '100%',
                      whiteSpace: { xs: 'normal', sm: 'nowrap' },
                    }}
                  >
                    {activity.category}
                  </Typography>
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap', width: { xs: 95, sm: 110 }, color: '#64748b' }}>
                  {format(activity.date, 'dd-MMM-yyyy')}
                </TableCell>
                <TableCell align="right" sx={{ color: colors.accent, fontWeight: 700, fontSize: '0.8rem', width: { xs: 75, sm: 80 } }}>
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
