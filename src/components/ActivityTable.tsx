import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import { format } from 'date-fns';
import type { Activity } from '../types';

interface Props {
  activities: Activity[];
}

export default function ActivityTable({ activities }: Props) {
  const sorted = [...activities].sort(
    (a, b) => b.date.getTime() - a.date.getTime(),
  );

  return (
    <Box sx={{ px: 2, pb: 2 }}>
      <Typography
        variant="overline"
        sx={{ fontWeight: 700, letterSpacing: 1.5, display: 'block', mb: 0.5 }}
      >
        Recent Activity
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>ACTIVITY</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>
              CATEGORY
            </TableCell>
            <TableCell sx={{ fontWeight: 700 }}>
              DATE
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: 700 }}>
              POINTS
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sorted.map((activity) => (
            <TableRow key={activity.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
              <TableCell sx={{ width: '50%' }}>{activity.title}</TableCell>
              <TableCell>
                <Chip
                  label={activity.category}
                  size="small"
                  sx={{
                    bgcolor: 'grey.200',
                    color: 'text.secondary',
                    fontSize: '0.7rem',
                  }}
                />
              </TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>
                {format(activity.date, 'dd-MMM-yyyy')}
              </TableCell>
              <TableCell align="right">
                <Chip
                  label={`+${activity.points}`}
                  size="small"
                  sx={{
                    bgcolor: '#e3f2fd',
                    color: '#1565c0',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
