import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTrigger, DialogSurface, DialogTitle, DialogBody,
  DialogActions, DialogContent,
  Button, Input, Textarea, Select, SpinButton, Field, makeStyles, tokens,
} from '@fluentui/react-components';
import type { Issue, CreateIssuePayload, UpdateIssuePayload, Sprint } from '../../types';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
});

interface IssueDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (payload: CreateIssuePayload | UpdateIssuePayload) => Promise<void>;
  issue?: Issue | null;
  sprints?: Sprint[];
}

export function IssueDialog({ open, onClose, onSave, issue, sprints = [] }: IssueDialogProps) {
  const styles = useStyles();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<Issue['type']>('task');
  const [priority, setPriority] = useState<Issue['priority']>('medium');
  const [assignee, setAssignee] = useState('');
  const [storyPoints, setStoryPoints] = useState<number | null>(null);
  const [sprintId, setSprintId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (issue) {
      setTitle(issue.title);
      setDescription(issue.description);
      setType(issue.type);
      setPriority(issue.priority);
      setAssignee(issue.assignee ?? '');
      setStoryPoints(issue.storyPoints);
      setSprintId(issue.sprintId);
    } else {
      setTitle('');
      setDescription('');
      setType('task');
      setPriority('medium');
      setAssignee('');
      setStoryPoints(null);
      setSprintId(null);
    }
  }, [issue, open]);

  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);
    try {
      await onSave({
        title: title.trim(),
        description,
        type,
        priority,
        assignee: assignee.trim() || null,
        storyPoints,
        sprintId,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(_, d) => { if (!d.open) onClose(); }}>
      <DialogSurface style={{ maxWidth: '560px', width: '100%' }}>
        <DialogTitle>{issue ? `Edit ${issue.key}` : 'Create Issue'}</DialogTitle>
        <DialogBody>
          <DialogContent>
            <div className={styles.form}>
              <Field label="Title" required>
                <Input
                  value={title}
                  onChange={(_, d) => setTitle(d.value)}
                  placeholder="Issue summary"
                />
              </Field>
              <Field label="Description">
                <Textarea
                  value={description}
                  onChange={(_, d) => setDescription(d.value)}
                  rows={3}
                  placeholder="Add a description..."
                />
              </Field>
              <div className={styles.row}>
                <Field label="Type">
                  <Select value={type} onChange={(_, d) => setType(d.value as Issue['type'])}>
                    <option value="story">Story</option>
                    <option value="bug">Bug</option>
                    <option value="task">Task</option>
                    <option value="epic">Epic</option>
                  </Select>
                </Field>
                <Field label="Priority">
                  <Select value={priority} onChange={(_, d) => setPriority(d.value as Issue['priority'])}>
                    <option value="highest">Highest</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                    <option value="lowest">Lowest</option>
                  </Select>
                </Field>
              </div>
              <div className={styles.row}>
                <Field label="Assignee">
                  <Input
                    value={assignee}
                    onChange={(_, d) => setAssignee(d.value)}
                    placeholder="Name"
                  />
                </Field>
                <Field label="Story Points">
                  <SpinButton
                    value={storyPoints ?? 0}
                    min={0}
                    max={100}
                    onChange={(_, d) => setStoryPoints(d.value ?? null)}
                  />
                </Field>
              </div>
              {sprints.length > 0 && (
                <Field label="Sprint">
                  <Select
                    value={sprintId ?? ''}
                    onChange={(_, d) => setSprintId(d.value || null)}
                  >
                    <option value="">Backlog (no sprint)</option>
                    {sprints.filter(s => s.status !== 'completed').map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </Select>
                </Field>
              )}
            </div>
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary" onClick={onClose}>Cancel</Button>
            </DialogTrigger>
            <Button appearance="primary" onClick={handleSave} disabled={!title.trim() || saving}>
              {saving ? 'Saving...' : issue ? 'Save Changes' : 'Create Issue'}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
