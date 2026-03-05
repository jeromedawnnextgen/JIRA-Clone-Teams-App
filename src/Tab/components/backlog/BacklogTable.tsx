import React from 'react';
import {
  Table, TableHeader, TableHeaderCell, TableBody, TableRow, TableCell,
  Badge, Button, Text, makeStyles, tokens,
} from '@fluentui/react-components';
import { DeleteRegular, EditRegular } from '@fluentui/react-icons';
import type { Issue } from '../../types';
import { PriorityBadge } from '../issues/PriorityBadge';

const useStyles = makeStyles({
  table: {
    width: '100%',
  },
  keyCell: {
    color: tokens.colorBrandForeground1,
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '13px',
    whiteSpace: 'nowrap',
    ':hover': {
      textDecoration: 'underline',
    },
  },
  titleCell: {
    cursor: 'pointer',
    ':hover': {
      color: tokens.colorBrandForeground1,
    },
  },
  actions: {
    display: 'flex',
    gap: '4px',
  },
  row: {
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground2,
    },
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

const typeLabels: Record<Issue['type'], string> = {
  story: 'Story',
  bug: 'Bug',
  task: 'Task',
  epic: 'Epic',
};

interface BacklogTableProps {
  issues: Issue[];
  onRowClick: (issue: Issue) => void;
  onEdit: (issue: Issue) => void;
  onDelete: (issue: Issue) => void;
}

export function BacklogTable({ issues, onRowClick, onEdit, onDelete }: BacklogTableProps) {
  const styles = useStyles();

  return (
    <Table className={styles.table} size="small">
      <TableHeader>
        <TableRow>
          <TableHeaderCell>Key</TableHeaderCell>
          <TableHeaderCell>Title</TableHeaderCell>
          <TableHeaderCell>Type</TableHeaderCell>
          <TableHeaderCell>Priority</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
          <TableHeaderCell>Assignee</TableHeaderCell>
          <TableHeaderCell>Points</TableHeaderCell>
          <TableHeaderCell></TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {issues.map(issue => (
          <TableRow key={issue.id} className={styles.row}>
            <TableCell>
              <Text
                className={styles.keyCell}
                onClick={() => onRowClick(issue)}
              >
                {issue.key}
              </Text>
            </TableCell>
            <TableCell>
              <Text
                className={styles.titleCell}
                size={300}
                onClick={() => onRowClick(issue)}
              >
                {issue.title}
              </Text>
            </TableCell>
            <TableCell><Text size={300}>{typeLabels[issue.type]}</Text></TableCell>
            <TableCell><PriorityBadge priority={issue.priority} /></TableCell>
            <TableCell>
              <Badge color={statusColors[issue.status]} appearance="tint" size="small">
                {statusLabels[issue.status]}
              </Badge>
            </TableCell>
            <TableCell><Text size={300}>{issue.assignee ?? '—'}</Text></TableCell>
            <TableCell><Text size={300}>{issue.storyPoints ?? '—'}</Text></TableCell>
            <TableCell>
              <div className={styles.actions}>
                <Button
                  size="small"
                  appearance="subtle"
                  icon={<EditRegular />}
                  onClick={() => onEdit(issue)}
                />
                <Button
                  size="small"
                  appearance="subtle"
                  icon={<DeleteRegular />}
                  onClick={() => onDelete(issue)}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
        {issues.length === 0 && (
          <TableRow>
            <TableCell colSpan={8}>
              <Text style={{ padding: '16px', display: 'block', textAlign: 'center', color: tokens.colorNeutralForeground3 }}>
                No issues found
              </Text>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
