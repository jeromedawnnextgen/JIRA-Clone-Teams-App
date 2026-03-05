import React from 'react';
import {
  Table, TableHeader, TableHeaderCell, TableBody, TableRow, TableCell,
  Button, Text, Badge, makeStyles, tokens,
} from '@fluentui/react-components';
import { ArrowExportRegular } from '@fluentui/react-icons';
import type { Issue } from '../../types';
import { PriorityBadge } from '../issues/PriorityBadge';

const useStyles = makeStyles({
  empty: {
    padding: '12px 0',
    color: tokens.colorNeutralForeground3,
    fontSize: '13px',
  },
});

const statusColors: Record<Issue['status'], 'informative' | 'warning' | 'success'> = {
  todo: 'informative',
  in_progress: 'warning',
  done: 'success',
};

const statusLabels: Record<Issue['status'], string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
};

interface SprintIssueListProps {
  issues: Issue[];
  onRemove: (issueId: string) => void;
  sprintId: string;
}

export function SprintIssueList({ issues, onRemove }: SprintIssueListProps) {
  const styles = useStyles();

  if (issues.length === 0) {
    return <Text className={styles.empty}>No issues in this sprint. Add some from the backlog below.</Text>;
  }

  return (
    <Table size="small">
      <TableHeader>
        <TableRow>
          <TableHeaderCell>Key</TableHeaderCell>
          <TableHeaderCell>Title</TableHeaderCell>
          <TableHeaderCell>Priority</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
          <TableHeaderCell>Assignee</TableHeaderCell>
          <TableHeaderCell>Points</TableHeaderCell>
          <TableHeaderCell></TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {issues.map(issue => (
          <TableRow key={issue.id}>
            <TableCell><Text size={200} style={{ color: tokens.colorBrandForeground1, fontWeight: '600' }}>{issue.key}</Text></TableCell>
            <TableCell><Text size={300}>{issue.title}</Text></TableCell>
            <TableCell><PriorityBadge priority={issue.priority} /></TableCell>
            <TableCell>
              <Badge color={statusColors[issue.status]} appearance="tint" size="small">
                {statusLabels[issue.status]}
              </Badge>
            </TableCell>
            <TableCell><Text size={300}>{issue.assignee ?? '—'}</Text></TableCell>
            <TableCell><Text size={300}>{issue.storyPoints ?? '—'}</Text></TableCell>
            <TableCell>
              <Button
                size="small"
                appearance="subtle"
                icon={<ArrowExportRegular />}
                title="Remove from sprint"
                onClick={() => onRemove(issue.id)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
