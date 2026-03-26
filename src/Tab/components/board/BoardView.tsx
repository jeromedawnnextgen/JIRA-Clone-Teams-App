import React, { useState } from 'react';
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core';
import { Text, Button, Spinner, MessageBar, MessageBarBody, makeStyles, tokens } from '@fluentui/react-components';
import { AddRegular } from '@fluentui/react-icons';
import { useIssues } from '../../hooks/useIssues';
import { useSprints } from '../../hooks/useSprints';
import { KanbanColumn } from './KanbanColumn';
import { IssueDetailPanel } from '../issues/IssueDetailPanel';
import { IssueDialog } from '../issues/IssueDialog';
import type { Issue, IssueStatus, CreateIssuePayload, UpdateIssuePayload } from '../../types';

const STATUSES: IssueStatus[] = ['todo', 'in_progress', 'done'];

const useStyles = makeStyles({
  page: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px 12px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  sprintLabel: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground3,
    marginTop: '2px',
  },
  board: {
    display: 'flex',
    gap: '12px',
    flex: 1,
    padding: '16px 20px',
    overflowX: 'auto',
    overflowY: 'hidden',
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
  },
  banner: {
    margin: '16px 20px',
  },
});

export function BoardView() {
  const styles = useStyles();
  const { sprints, activeSprint } = useSprints();
  const { issues, loading, updateIssue, createIssue } = useIssues(
    activeSprint ? { sprintId: activeSprint.id } : undefined
  );
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: { distance: 5 },
  }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const issue = issues.find(i => i.id === active.id);
    if (!issue) return;

    // The droppable id is the status string
    const newStatus = over.id as IssueStatus;
    if (STATUSES.includes(newStatus) && issue.status !== newStatus) {
      updateIssue(issue.id, { status: newStatus });
    }
  };

  const handleSave = async (payload: CreateIssuePayload | UpdateIssuePayload) => {
    if (editingIssue) {
      await updateIssue(editingIssue.id, payload as UpdateIssuePayload);
    } else {
      await createIssue({
        ...(payload as CreateIssuePayload),
        sprintId: activeSprint?.id ?? null,
      });
    }
  };

  const columnIssues = (status: IssueStatus) =>
    issues.filter(i => i.status === status).sort((a, b) => a.order - b.order);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <Text size={600} weight="semibold">Board</Text>
          {activeSprint && (
            <div className={styles.sprintLabel}>{activeSprint.name}</div>
          )}
        </div>
        <Button appearance="primary" icon={<AddRegular />} onClick={() => { setEditingIssue(null); setDialogOpen(true); }}>
          Create Issue
        </Button>
      </div>

      {!activeSprint && !loading && (
        <div className={styles.banner}>
          <MessageBar intent="warning">
            <MessageBarBody>
              No active sprint. Go to Sprints to start a sprint and see issues on the board.
            </MessageBarBody>
          </MessageBar>
        </div>
      )}

      {loading ? (
        <div className={styles.center}><Spinner label="Loading board..." /></div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className={styles.board}>
            {STATUSES.map(status => (
              <KanbanColumn
                key={status}
                status={status}
                issues={columnIssues(status)}
                onCardClick={setSelectedIssue}
              />
            ))}
          </div>
        </DndContext>
      )}

      <IssueDetailPanel
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
        onEdit={(issue) => { setSelectedIssue(null); setEditingIssue(issue); setDialogOpen(true); }}
      />
      <IssueDialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditingIssue(null); }}
        onSave={handleSave}
        issue={editingIssue}
        sprints={sprints}
      />
    </div>
  );
}
