import React, { useState, useMemo } from 'react';
import {
  Button, Text, Spinner, makeStyles, tokens,
} from '@fluentui/react-components';
import { AddRegular } from '@fluentui/react-icons';
import { useIssues } from '../../hooks/useIssues';
import { useSprints } from '../../hooks/useSprints';
import { BacklogFilters, BacklogFiltersState } from './BacklogFilters';
import { BacklogTable } from './BacklogTable';
import { IssueDialog } from '../issues/IssueDialog';
import { IssueDetailPanel } from '../issues/IssueDetailPanel';
import type { Issue, CreateIssuePayload, UpdateIssuePayload } from '../../types';

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
  toolbar: {
    padding: '12px 20px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  content: {
    flex: 1,
    overflow: 'auto',
    padding: '0 20px',
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
  },
});

const defaultFilters: BacklogFiltersState = { search: '', status: '', priority: '', type: '' };

export function BacklogView() {
  const styles = useStyles();
  const { issues, loading, createIssue, updateIssue, deleteIssue } = useIssues();
  const { sprints } = useSprints();
  const [filters, setFilters] = useState<BacklogFiltersState>(defaultFilters);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  const filtered = useMemo(() => {
    return issues.filter(i => {
      if (filters.search && !i.title.toLowerCase().includes(filters.search.toLowerCase()) && !i.key.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.status && i.status !== filters.status) return false;
      if (filters.priority && i.priority !== filters.priority) return false;
      if (filters.type && i.type !== filters.type) return false;
      return true;
    });
  }, [issues, filters]);

  const handleSave = async (payload: CreateIssuePayload | UpdateIssuePayload) => {
    if (editingIssue) {
      await updateIssue(editingIssue.id, payload as UpdateIssuePayload);
    } else {
      await createIssue(payload as CreateIssuePayload);
    }
  };

  const handleEdit = (issue: Issue) => {
    setEditingIssue(issue);
    setDialogOpen(true);
  };

  const handleDelete = async (issue: Issue) => {
    if (confirm(`Delete "${issue.title}"?`)) {
      await deleteIssue(issue.id);
    }
  };

  const handleCreate = () => {
    setEditingIssue(null);
    setDialogOpen(true);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Text size={600} weight="semibold">Backlog</Text>
        <Button appearance="primary" icon={<AddRegular />} onClick={handleCreate}>
          Create Issue
        </Button>
      </div>
      <div className={styles.toolbar}>
        <BacklogFilters filters={filters} onChange={setFilters} />
      </div>
      <div className={styles.content}>
        {loading ? (
          <div className={styles.center}><Spinner label="Loading issues..." /></div>
        ) : (
          <BacklogTable
            issues={filtered}
            onRowClick={setSelectedIssue}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      <IssueDialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditingIssue(null); }}
        onSave={handleSave}
        issue={editingIssue}
        sprints={sprints}
      />
      <IssueDetailPanel
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
        onEdit={(issue) => { setSelectedIssue(null); handleEdit(issue); }}
      />
    </div>
  );
}
