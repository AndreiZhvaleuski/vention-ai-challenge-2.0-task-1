import Alert from '@mui/material/Alert';
import type { FilteredEmployee } from '../hooks/useLeaderboard';
import EmployeeCard from './EmployeeCard';

interface Props {
  entries: FilteredEmployee[];
}

export default function EmployeeList({ entries }: Props) {
  if (entries.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 1 }}>
        No activities found matching the current filters.
      </Alert>
    );
  }

  // Ranks 1-3 go to the podium; this list starts at rank 4
  const rest = entries.slice(3);

  return (
    <>
      {rest.map((entry, i) => (
        <EmployeeCard key={entry.employee.id} rank={i + 4} entry={entry} />
      ))}
    </>
  );
}
