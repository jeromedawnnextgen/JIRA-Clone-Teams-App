import React from 'react';
import {
  Card, CardHeader, Button, Text, Badge, makeStyles, tokens,
} from '@fluentui/react-components';
import { PlayRegular, CheckmarkRegular, DeleteRegular } from '@fluentui/react-icons';
import type { Sprint } from '../../types';

const useStyles = makeStyles({
  card: {
    marginBottom: '12px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  actions: {
    display: 'flex',
    gap: '6px',
  },
  meta: {
    display: 'flex',
    gap: '16px',
    marginTop: '8px',
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
  },
  goal: {
    marginTop: '6px',
    fontSize: '13px',
    color: tokens.colorNeutralForeground2,
    fontStyle: 'italic',
  },
});

const statusConfig: Record<Sprint['status'], { label: string; color: 'informative' | 'warning' | 'success' | 'subtle' }> = {
  planning:  { label: 'Planning',   color: 'informative' },
  active:    { label: 'Active',     color: 'warning' },
  completed: { label: 'Completed',  color: 'success' },
};

interface SprintCardProps {
  sprint: Sprint;
  issueCount: number;
  onStart: () => void;
  onComplete: () => void;
  onDelete: () => void;
}

export function SprintCard({ sprint, issueCount, onStart, onComplete, onDelete }: SprintCardProps) {
  const styles = useStyles();
  const { label, color } = statusConfig[sprint.status];

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <Text weight="semibold" size={400}>{sprint.name}</Text>
          <Badge color={color} appearance="tint" size="small">{label}</Badge>
        </div>
        <div className={styles.actions}>
          {sprint.status === 'planning' && (
            <Button size="small" appearance="outline" icon={<PlayRegular />} onClick={onStart}>
              Start Sprint
            </Button>
          )}
          {sprint.status === 'active' && (
            <Button size="small" appearance="outline" icon={<CheckmarkRegular />} onClick={onComplete}>
              Complete Sprint
            </Button>
          )}
          {sprint.status !== 'active' && (
            <Button size="small" appearance="subtle" icon={<DeleteRegular />} onClick={onDelete} />
          )}
        </div>
      </div>
      {sprint.goal && (
        <Text className={styles.goal}>Goal: {sprint.goal}</Text>
      )}
      <div className={styles.meta}>
        <span>{issueCount} issues</span>
        {sprint.startDate && <span>Start: {new Date(sprint.startDate).toLocaleDateString()}</span>}
        {sprint.endDate && <span>End: {new Date(sprint.endDate).toLocaleDateString()}</span>}
      </div>
    </Card>
  );
}
