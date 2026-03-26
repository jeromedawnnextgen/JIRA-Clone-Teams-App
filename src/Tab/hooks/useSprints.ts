import { useState, useEffect, useCallback } from 'react';
import { sprintsApi } from '../api/sprints';
import type { Sprint, CreateSprintPayload, UpdateSprintPayload } from '../types';

export function useSprints() {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await sprintsApi.list();
      setSprints(data);
      setError(null);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const activeSprint = sprints.find(s => s.status === 'active') ?? null;

  const createSprint = async (payload: CreateSprintPayload): Promise<Sprint> => {
    const created = await sprintsApi.create(payload);
    setSprints(prev => [...prev, created]);
    return created;
  };

  const updateSprint = async (id: string, payload: UpdateSprintPayload): Promise<void> => {
    const updated = await sprintsApi.update(id, payload);
    setSprints(prev => prev.map(s => s.id === id ? updated : s));
  };

  const deleteSprint = async (id: string): Promise<void> => {
    await sprintsApi.delete(id);
    setSprints(prev => prev.filter(s => s.id !== id));
  };

  const startSprint = async (id: string): Promise<void> => {
    const updated = await sprintsApi.start(id);
    setSprints(prev => prev.map(s => s.id === id ? updated : s));
  };

  const completeSprint = async (id: string): Promise<void> => {
    const updated = await sprintsApi.complete(id);
    setSprints(prev => prev.map(s => s.id === id ? updated : s));
  };

  const addIssueToSprint = async (sprintId: string, issueId: string): Promise<void> => {
    await sprintsApi.addIssue(sprintId, issueId);
  };

  const removeIssueFromSprint = async (sprintId: string, issueId: string): Promise<void> => {
    await sprintsApi.removeIssue(sprintId, issueId);
  };

  return {
    sprints, activeSprint, loading, error, refresh,
    createSprint, updateSprint, deleteSprint,
    startSprint, completeSprint,
    addIssueToSprint, removeIssueFromSprint,
  };
}
