import { useRef, useLayoutEffect, useState } from 'react';
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

  const rest = entries;

  return <VirtualizedList rest={rest} />;
}

function VirtualizedList({ rest }: { rest: FilteredEmployee[] }) {
  const listRef = useRef<HTMLDivElement | null>(null);
  const listOffsetRef = useRef(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useLayoutEffect(() => {
    listOffsetRef.current = listRef.current?.offsetTop ?? 0;
  }, []);

  const virtualizer = useWindowVirtualizer({
    count: rest.length,
    estimateSize: () => 80,
    overscan: 5,
    scrollMargin: listOffsetRef.current,
  });

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div ref={listRef}>
      <div style={{ height: virtualizer.getTotalSize(), width: '100%', position: 'relative' }}>
        {virtualizer.getVirtualItems().map((vItem) => {
          const entry = rest[vItem.index];
          return (
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
              <EmployeeCard
                rank={entry.rank}
                entry={entry}
                isExpanded={expandedId === entry.employee.id}
                onToggle={() => handleToggle(entry.employee.id)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
