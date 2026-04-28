import { useRef, useLayoutEffect } from 'react';
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
  const rest = entries.filter((e) => e.rank > 3);

  return <VirtualizedList rest={rest} />;
}

function VirtualizedList({ rest }: { rest: FilteredEmployee[] }) {
  const listRef = useRef<HTMLDivElement | null>(null);
  const listOffsetRef = useRef(0);

  useLayoutEffect(() => {
    listOffsetRef.current = listRef.current?.offsetTop ?? 0;
  }, []);

  const virtualizer = useWindowVirtualizer({
    count: rest.length,
    estimateSize: () => 80,
    overscan: 5,
    scrollMargin: listOffsetRef.current,
  });

  return (
    <div ref={listRef}>
      <div style={{ height: virtualizer.getTotalSize(), width: '100%', position: 'relative' }}>
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
            <EmployeeCard rank={rest[vItem.index].rank} entry={rest[vItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
