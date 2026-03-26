import { useState, useEffect, useCallback } from 'react';
import { issuesApi, IssueFilters } from '../api/issues';
import type { Issue, CreateIssuePayload, UpdateIssuePayload } from '../types';

export function useIssues(filters?: IssueFilters) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filtersKey = JSON.stringify(filters);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await issuesApi.list(filters);
      setIssues(data);
      setError(null);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createIssue = async (payload: CreateIssuePayload): Promise<Issue> => {
    const created = await issuesApi.create(payload);
    setIssues(prev => [...prev, created]);
    return created;
  };

  const updateIssue = async (id: string, payload: UpdateIssuePayload): Promise<void> => {
    setIssues(prev => prev.map(i => i.id === id ? { ...i, ...payload } : i));
    await issuesApi.update(id, payload);
  };

  const deleteIssue = async (id: string): Promise<void> => {
    setIssues(prev => prev.filter(i => i.id !== id));
    await issuesApi.delete(id);
  };

  return { issues, loading, error, refresh, createIssue, updateIssue, deleteIssue };
}
