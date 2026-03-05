import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Text, Badge, makeStyles, tokens } from '@fluentui/react-components';
import { IssueCard } from './IssueCard';
import type { Issue, IssueStatus } from '../../types';

const useStyles = makeStyles({
  column: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minWidth: '260px',
    maxWidth: '340px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: '8px',
    padding: '12px',
    height: '100%',
  },
  over: {
    backgroundColor: tokens.colorNeutralBackground3,
  },
  columnHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
    paddingBottom: '8px',
    borderBottom: `2px solid ${tokens.colorNeutralStroke2}`,
  },
  columnTitle: {
    fontWeight: '700',
    fontSize: '13px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: tokens.colorNeutralForeground2,
  },
  cards: {
    flex: 1,
    overflowY: 'auto',
    minHeight: '80px',
  },
});

const columnConfig: Record<IssueStatus, { label: string; badgeColor: 'informative' | 'warning' | 'success' }> = {
  todo:        { label: 'To Do',       badgeColor: 'informative' },
  in_progress: { label: 'In Progress', badgeColor: 'warning' },
  done:        { label: 'Done',        badgeColor: 'success' },
};

interface KanbanColumnProps {
  status: IssueStatus;
  issues: Issue[];
  onCardClick: (issue: Issue) => void;
}

export function KanbanColumn({ status, issues, onCardClick }: KanbanColumnProps) {
  const styles = useStyles();
  const { label, badgeColor } = columnConfig[status];
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className={`${styles.column} ${isOver ? styles.over : ''}`}>
      <div className={styles.columnHeader}>
        <Text className={styles.columnTitle}>{label}</Text>
        <Badge color={badgeColor} appearance="tint" shape="circular">{issues.length}</Badge>
      </div>
      <div ref={setNodeRef} className={styles.cards}>
        <SortableContext items={issues.map(i => i.id)} strategy={verticalListSortingStrategy}>
          {issues.map(issue => (
            <IssueCard key={issue.id} issue={issue} onClick={onCardClick} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
