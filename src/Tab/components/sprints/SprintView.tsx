import React, { useState } from 'react';
import {
  Button, Text, Spinner, Input, Field, Dialog, DialogSurface, DialogTitle,
  DialogBody, DialogContent, DialogActions, DialogTrigger,
  Select, Divider, makeStyles, tokens,
} from '@fluentui/react-components';
import { AddRegular } from '@fluentui/react-icons';
import { useSprints } from '../../hooks/useSprints';
import { useIssues } from '../../hooks/useIssues';
import { SprintCard } from './SprintCard';
import { SprintIssueList } from './SprintIssueList';
import type { Issue } from '../../types';

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
  content: {
    flex: 1,
    overflow: 'auto',
    padding: '16px 20px',
  },
  sprintSection: {
    marginBottom: '24px',
  },
  issueListSection: {
    paddingTop: '8px',
    paddingLeft: '16px',
  },
  backlogSection: {
    marginTop: '32px',
  },
  backlogHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  backlogItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 12px',
    borderRadius: '4px',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground2,
    },
  },
  addForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
  },
});

export function SprintView() {
  const styles = useStyles();
  const {
    sprints, loading: sprintsLoading, createSprint, deleteSprint,
    startSprint, completeSprint, addIssueToSprint, removeIssueFromSprint, refresh: refreshSprints,
  } = useSprints();
  const { issues, loading: issuesLoading, refresh: refreshIssues } = useIssues();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newSprintName, setNewSprintName] = useState('');
  const [newSprintGoal, setNewSprintGoal] = useState('');
  const [saving, setSaving] = useState(false);

  const backlogIssues = issues.filter(i => !i.sprintId);
  const issuesForSprint = (sprintId: string) => issues.filter(i => i.sprintId === sprintId);

  const handleCreateSprint = async () => {
    if (!newSprintName.trim()) return;
    setSaving(true);
    try {
      await createSprint({ name: newSprintName.trim(), goal: newSprintGoal.trim() });
      setNewSprintName('');
      setNewSprintGoal('');
      setCreateDialogOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleStartSprint = async (id: string) => {
    await startSprint(id);
  };

  const handleCompleteSprint = async (id: string) => {
    if (confirm('Complete this sprint? Unfinished issues will be moved to the backlog.')) {
      await completeSprint(id);
      await refreshIssues();
    }
  };

  const handleDeleteSprint = async (id: string) => {
    if (confirm('Delete this sprint? All issues will be moved to the backlog.')) {
      await deleteSprint(id);
      await refreshIssues();
    }
  };

  const handleAddToSprint = async (sprintId: string, issueId: string) => {
    await addIssueToSprint(sprintId, issueId);
    await refreshIssues();
  };

  const handleRemoveFromSprint = async (sprintId: string, issueId: string) => {
    await removeIssueFromSprint(sprintId, issueId);
    await refreshIssues();
  };

  const [selectedSprintForAdd, setSelectedSprintForAdd] = useState<string>('');

  const activeSprints = sprints.filter(s => s.status !== 'completed');

  if (sprintsLoading || issuesLoading) {
    return <div className={styles.center}><Spinner label="Loading sprints..." /></div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Text size={600} weight="semibold">Sprints</Text>
        <Button appearance="primary" icon={<AddRegular />} onClick={() => setCreateDialogOpen(true)}>
          Create Sprint
        </Button>
      </div>

      <div className={styles.content}>
        {sprints.length === 0 && (
          <Text style={{ color: tokens.colorNeutralForeground3 }}>
            No sprints yet. Create your first sprint to get started.
          </Text>
        )}

        {activeSprints.map(sprint => (
          <div key={sprint.id} className={styles.sprintSection}>
            <SprintCard
              sprint={sprint}
              issueCount={issuesForSprint(sprint.id).length}
              onStart={() => handleStartSprint(sprint.id)}
              onComplete={() => handleCompleteSprint(sprint.id)}
              onDelete={() => handleDeleteSprint(sprint.id)}
            />
            <div className={styles.issueListSection}>
              <SprintIssueList
                sprintId={sprint.id}
                issues={issuesForSprint(sprint.id)}
                onRemove={(issueId) => handleRemoveFromSprint(sprint.id, issueId)}
              />
            </div>
          </div>
        ))}

        {/* Backlog section */}
        <div className={styles.backlogSection}>
          <Divider />
          <div className={styles.backlogHeader} style={{ marginTop: '16px' }}>
            <Text size={500} weight="semibold">Backlog ({backlogIssues.length} issues)</Text>
          </div>
          {backlogIssues.length === 0 ? (
            <Text style={{ color: tokens.colorNeutralForeground3 }}>All issues are in sprints.</Text>
          ) : (
            <>
              {activeSprints.length > 0 && (
                <div style={{ marginBottom: '12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Text size={300}>Add backlog issues to sprint:</Text>
                  <Select
                    value={selectedSprintForAdd}
                    onChange={(_, d) => setSelectedSprintForAdd(d.value)}
                  >
                    <option value="">Select sprint...</option>
                    {activeSprints.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </Select>
                </div>
              )}
              {backlogIssues.map(issue => (
                <div key={issue.id} className={styles.backlogItem}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <Text size={200} style={{ color: tokens.colorBrandForeground1, fontWeight: '600', minWidth: '80px' }}>
                      {issue.key}
                    </Text>
                    <Text size={300}>{issue.title}</Text>
                  </div>
                  {selectedSprintForAdd && (
                    <Button
                      size="small"
                      appearance="outline"
                      onClick={() => handleAddToSprint(selectedSprintForAdd, issue.id)}
                    >
                      Add to Sprint
                    </Button>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Create Sprint Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={(_, d) => { if (!d.open) setCreateDialogOpen(false); }}>
        <DialogSurface>
          <DialogTitle>Create Sprint</DialogTitle>
          <DialogBody>
            <DialogContent>
              <div className={styles.addForm}>
                <Field label="Sprint Name" required>
                  <Input
                    value={newSprintName}
                    onChange={(_, d) => setNewSprintName(d.value)}
                    placeholder="Sprint 2"
                  />
                </Field>
                <Field label="Sprint Goal">
                  <Input
                    value={newSprintGoal}
                    onChange={(_, d) => setNewSprintGoal(d.value)}
                    placeholder="What does this sprint aim to achieve?"
                  />
                </Field>
              </div>
            </DialogContent>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
              </DialogTrigger>
              <Button
                appearance="primary"
                onClick={handleCreateSprint}
                disabled={!newSprintName.trim() || saving}
              >
                {saving ? 'Creating...' : 'Create Sprint'}
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  );
}
