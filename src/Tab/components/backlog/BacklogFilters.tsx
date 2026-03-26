import React from 'react';
import { Input, Select, makeStyles } from '@fluentui/react-components';
import { SearchRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  filters: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  search: {
    minWidth: '200px',
  },
});

export interface BacklogFiltersState {
  search: string;
  status: string;
  priority: string;
  type: string;
}

interface BacklogFiltersProps {
  filters: BacklogFiltersState;
  onChange: (filters: BacklogFiltersState) => void;
}

export function BacklogFilters({ filters, onChange }: BacklogFiltersProps) {
  const styles = useStyles();

  return (
    <div className={styles.filters}>
      <Input
        className={styles.search}
        placeholder="Search issues..."
        value={filters.search}
        onChange={(_, d) => onChange({ ...filters, search: d.value })}
        contentBefore={<SearchRegular />}
      />
      <Select
        value={filters.status}
        onChange={(_, d) => onChange({ ...filters, status: d.value })}
      >
        <option value="">All Statuses</option>
        <option value="todo">To Do</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </Select>
      <Select
        value={filters.priority}
        onChange={(_, d) => onChange({ ...filters, priority: d.value })}
      >
        <option value="">All Priorities</option>
        <option value="highest">Highest</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
        <option value="lowest">Lowest</option>
      </Select>
      <Select
        value={filters.type}
        onChange={(_, d) => onChange({ ...filters, type: d.value })}
      >
        <option value="">All Types</option>
        <option value="story">Story</option>
        <option value="bug">Bug</option>
        <option value="task">Task</option>
        <option value="epic">Epic</option>
      </Select>
    </div>
  );
}
