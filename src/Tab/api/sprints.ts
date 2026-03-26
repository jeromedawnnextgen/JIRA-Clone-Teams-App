import { apiFetch } from './client';
import type { Sprint, CreateSprintPayload, UpdateSprintPayload } from '../types';

export const sprintsApi = {
  list: () =>
    apiFetch<Sprint[]>('/api/sprints'),

  get: (id: string) =>
    apiFetch<Sprint>(`/api/sprints/${id}`),

  create: (payload: CreateSprintPayload) =>
    apiFetch<Sprint>('/api/sprints', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  update: (id: string, payload: UpdateSprintPayload) =>
    apiFetch<Sprint>(`/api/sprints/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  delete: (id: string) =>
    apiFetch<void>(`/api/sprints/${id}`, { method: 'DELETE' }),

  start: (id: string) =>
    apiFetch<Sprint>(`/api/sprints/${id}/start`, { method: 'POST' }),

  complete: (id: string) =>
    apiFetch<Sprint>(`/api/sprints/${id}/complete`, { method: 'POST' }),

  addIssue: (sprintId: string, issueId: string) =>
    apiFetch<void>(`/api/sprints/${sprintId}/issues`, {
      method: 'POST',
      body: JSON.stringify({ issueId }),
    }),

  removeIssue: (sprintId: string, issueId: string) =>
    apiFetch<void>(`/api/sprints/${sprintId}/issues/${issueId}`, { method: 'DELETE' }),
};
