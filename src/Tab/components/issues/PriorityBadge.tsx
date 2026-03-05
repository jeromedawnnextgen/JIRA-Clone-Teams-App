import React from 'react';
import { Badge } from '@fluentui/react-components';
import type { Priority } from '../../types';

const priorityConfig: Record<Priority, { label: string; color: 'danger' | 'warning' | 'informative' | 'subtle' | 'success' }> = {
  highest: { label: 'Highest', color: 'danger' },
  high:    { label: 'High',    color: 'warning' },
  medium:  { label: 'Medium',  color: 'informative' },
  low:     { label: 'Low',     color: 'subtle' },
  lowest:  { label: 'Lowest',  color: 'subtle' },
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  const { label, color } = priorityConfig[priority];
  return (
    <Badge color={color} appearance="tint" size="small">
      {label}
    </Badge>
  );
}
