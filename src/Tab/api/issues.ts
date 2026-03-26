import { apiFetch } from './client';
import type { Issue, CreateIssuePayload, UpdateIssuePayload } from '../types';

export interface IssueFilters {
  sprintId?: string;
  status?: string;
  search?: string;
}

function buildQuery(filters?: IssueFilters): string {
  if (!filters) return '';
  const params = new URLSearchParams();
  if (filters.sprintId !== undefined) params.set('sprintId', filters.sprintId);
  if (filters.status) params.set('status', filters.status);
  if (filters.search) params.set('search', filters.search);
  const q = params.toString();
  return q ? `?${q}` : '';
}

export const issuesApi = {
  list: (filters?: IssueFilters) =>
    apiFetch<Issue[]>(`/api/issues${buildQuery(filters)}`),

  get: (id: string) =>
    apiFetch<Issue>(`/api/issues/${id}`),

  create: (payload: CreateIssuePayload) =>
    apiFetch<Issue>('/api/issues', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  update: (id: string, payload: UpdateIssuePayload) =>
    apiFetch<Issue>(`/api/issues/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  delete: (id: string) =>
    apiFetch<void>(`/api/issues/${id}`, { method: 'DELETE' }),
};
