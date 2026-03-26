import React from 'react';
import {
  Drawer, DrawerHeader, DrawerHeaderTitle, DrawerBody,
  Button, Text, Badge, Divider, makeStyles, tokens,
} from '@fluentui/react-components';
import { DismissRegular, EditRegular } from '@fluentui/react-icons';
import type { Issue } from '../../types';
import { PriorityBadge } from './PriorityBadge';

const useStyles = makeStyles({
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '16px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  label: {
    fontSize: '11px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground3,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  meta: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  statusBadge: {
    width: 'fit-content',
  },
  description: {
    whiteSpace: 'pre-wrap',
    color: tokens.colorNeutralForeground2,
    fontSize: '14px',
    lineHeight: '1.5',
  },
});

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

interface IssueDetailPanelProps {
  issue: Issue | null;
  onClose: () => void;
  onEdit: (issue: Issue) => void;
}

export function IssueDetailPanel({ issue, onClose, onEdit }: IssueDetailPanelProps) {
  const styles = useStyles();

  return (
    <Drawer
      type="overlay"
      position="end"
      open={!!issue}
      onOpenChange={(_, d) => { if (!d.open) onClose(); }}
      size="medium"
    >
      <DrawerHeader>
        <DrawerHeaderTitle
          action={
            <div style={{ display: 'flex', gap: '8px' }}>
              {issue && (
                <Button
                  appearance="subtle"
                  icon={<EditRegular />}
                  onClick={() => onEdit(issue)}
                >
                  Edit
                </Button>
              )}
              <Button appearance="subtle" icon={<DismissRegular />} onClick={onClose} />
            </div>
          }
        >
          {issue?.key}
        </DrawerHeaderTitle>
      </DrawerHeader>
      <DrawerBody>
        {issue && (
          <div className={styles.body}>
            <Text size={500} weight="semibold">{issue.title}</Text>
            <Divider />
            <div className={styles.meta}>
              <div className={styles.field}>
                <span className={styles.label}>Status</span>
                <Badge
                  className={styles.statusBadge}
                  color={issue.status === 'done' ? 'success' : issue.status === 'in_progress' ? 'warning' : 'informative'}
                  appearance="tint"
                >
                  {statusLabels[issue.status]}
                </Badge>
              </div>
              <div className={styles.field}>
                <span className={styles.label}>Priority</span>
                <PriorityBadge priority={issue.priority} />
              </div>
              <div className={styles.field}>
                <span className={styles.label}>Type</span>
                <Text size={300}>{typeLabels[issue.type]}</Text>
              </div>
              <div className={styles.field}>
                <span className={styles.label}>Story Points</span>
                <Text size={300}>{issue.storyPoints ?? '—'}</Text>
              </div>
              <div className={styles.field}>
                <span className={styles.label}>Assignee</span>
                <Text size={300}>{issue.assignee ?? 'Unassigned'}</Text>
              </div>
              <div className={styles.field}>
                <span className={styles.label}>Reporter</span>
                <Text size={300}>{issue.reporter}</Text>
              </div>
            </div>
            <Divider />
            <div className={styles.field}>
              <span className={styles.label}>Description</span>
              <Text className={styles.description}>
                {issue.description || 'No description provided.'}
              </Text>
            </div>
          </div>
        )}
      </DrawerBody>
    </Drawer>
  );
}
