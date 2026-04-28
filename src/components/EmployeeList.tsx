import { useRef } from 'react';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
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

  return <VirtualizedList rest={rest} />;
}

function VirtualizedList({ rest }: { rest: FilteredEmployee[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const virtualizer = useWindowVirtualizer({
    count: rest.length,
    estimateSize: () => 80,
    overscan: 5,
    scrollMargin: containerRef.current?.offsetTop ?? 0,
  });

  return (
    <div ref={containerRef} style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
      {virtualizer.getVirtualItems().map((vItem) => (
        <div
          key={vItem.key}
          data-index={vItem.index}
          ref={virtualizer.measureElement}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            transform: `translateY(${vItem.start - virtualizer.options.scrollMargin}px)`,
          }}
        >
          <EmployeeCard key={rest[vItem.index].employee.id} rank={vItem.index + 4} entry={rest[vItem.index]} />
        </div>
      ))}
    </div>
  );
}
