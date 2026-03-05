import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardHeader, Text, Badge, makeStyles, tokens } from '@fluentui/react-components';
import { PriorityBadge } from '../issues/PriorityBadge';
import type { Issue } from '../../types';

const useStyles = makeStyles({
  card: {
    cursor: 'grab',
    marginBottom: '8px',
    padding: '10px 12px',
    userSelect: 'none',
    ':hover': {
      boxShadow: tokens.shadow8,
    },
  },
  dragging: {
    opacity: 0.4,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '8px',
    marginBottom: '8px',
  },
  title: {
    fontSize: '13px',
    lineHeight: '1.4',
    flex: 1,
    cursor: 'pointer',
    ':hover': {
      color: tokens.colorBrandForeground1,
    },
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '8px',
  },
  key: {
    fontSize: '11px',
    color: tokens.colorNeutralForeground3,
  },
  assignee: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground1,
    fontSize: '11px',
    fontWeight: '700',
  },
  points: {
    fontSize: '11px',
    color: tokens.colorNeutralForeground3,
    backgroundColor: tokens.colorNeutralBackground3,
    padding: '2px 6px',
    borderRadius: '10px',
  },
});

interface IssueCardProps {
  issue: Issue;
  onClick: (issue: Issue) => void;
}

export function IssueCard({ issue, onClick }: IssueCardProps) {
  const styles = useStyles();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: issue.id,
    data: { issue },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <Card
        className={`${styles.card} ${isDragging ? styles.dragging : ''}`}
        onClick={() => onClick(issue)}
      >
        <div className={styles.header}>
          <Text className={styles.title}>{issue.title}</Text>
          <PriorityBadge priority={issue.priority} />
        </div>
        <div className={styles.footer}>
          <Text className={styles.key}>{issue.key}</Text>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {issue.storyPoints !== null && (
              <span className={styles.points}>{issue.storyPoints}</span>
            )}
            {issue.assignee && (
              <div className={styles.assignee} title={issue.assignee}>
                {issue.assignee.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
