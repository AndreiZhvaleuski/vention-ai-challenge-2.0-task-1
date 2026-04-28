import { memo, useRef, useLayoutEffect, useState, useCallback } from 'react';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import Alert from '@mui/material/Alert';
import type { FilteredEmployee } from '../hooks/useLeaderboard';
import EmployeeCard from './EmployeeCard';

interface Props {
  entries: FilteredEmployee[];
}

function EmployeeList({ entries }: Props) {
  if (entries.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 1 }}>
        No activities found matching the current filters.
      </Alert>
    );
  }

  return <VirtualizedList rest={entries} />;
}

export default memo(EmployeeList);

const VirtualizedList = memo(function VirtualizedList({ rest }: { rest: FilteredEmployee[] }) {
  const listRef = useRef<HTMLDivElement | null>(null);
  const [listOffset, setListOffset] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useLayoutEffect(() => {
    const next = listRef.current?.offsetTop ?? 0;
    setListOffset((prev) => (prev === next ? prev : next));
  }, []);

  const virtualizer = useWindowVirtualizer({
    count: rest.length,
    estimateSize: () => 80,
    overscan: 5,
    scrollMargin: listOffset,
  });

  const handleToggle = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

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
                id={entry.employee.id}
                entry={entry}
                isExpanded={expandedId === entry.employee.id}
                onToggle={handleToggle}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
});
