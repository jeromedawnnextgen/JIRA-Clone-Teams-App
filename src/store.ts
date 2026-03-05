import { randomUUID } from 'crypto';

export type Priority = 'lowest' | 'low' | 'medium' | 'high' | 'highest';
export type IssueStatus = 'todo' | 'in_progress' | 'done';
export type SprintStatus = 'planning' | 'active' | 'completed';
export type IssueType = 'story' | 'bug' | 'task' | 'epic';

export interface Issue {
  id: string;
  key: string;
  title: string;
  description: string;
  type: IssueType;
  priority: Priority;
  status: IssueStatus;
  assignee: string | null;
  reporter: string;
  sprintId: string | null;
  storyPoints: number | null;
  createdAt: string;
  updatedAt: string;
  order: number;
}

export interface Sprint {
  id: string;
  name: string;
  goal: string;
  status: SprintStatus;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
}

const issues = new Map<string, Issue>();
const sprints = new Map<string, Sprint>();
let issueCounter = 1;
let sprintCounter = 1;

function now() {
  return new Date().toISOString();
}

function nextIssueKey() {
  return `TEST-${issueCounter++}`;
}

function nextSprintId() {
  return `spr-${sprintCounter++}`;
}

// ─── Issues ────────────────────────────────────────────────────────────────

export function listIssues(filters?: {
  sprintId?: string;
  status?: string;
  search?: string;
}): Issue[] {
  let result = Array.from(issues.values());

  if (filters?.sprintId !== undefined) {
    result = result.filter(i => i.sprintId === (filters.sprintId === 'null' ? null : filters.sprintId));
  }
  if (filters?.status) {
    result = result.filter(i => i.status === filters.status);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      i => i.title.toLowerCase().includes(q) || i.key.toLowerCase().includes(q)
    );
  }

  return result.sort((a, b) => a.order - b.order);
}

export function getIssue(id: string): Issue | undefined {
  return issues.get(id);
}

export function createIssue(payload: Partial<Issue>): Issue {
  const id = randomUUID();
  const issue: Issue = {
    id,
    key: nextIssueKey(),
    title: payload.title ?? 'Untitled issue',
    description: payload.description ?? '',
    type: payload.type ?? 'task',
    priority: payload.priority ?? 'medium',
    status: payload.status ?? 'todo',
    assignee: payload.assignee ?? null,
    reporter: payload.reporter ?? 'Unknown',
    sprintId: payload.sprintId ?? null,
    storyPoints: payload.storyPoints ?? null,
    createdAt: now(),
    updatedAt: now(),
    order: issues.size,
  };
  issues.set(id, issue);
  return issue;
}

export function updateIssue(id: string, patch: Partial<Issue>): Issue | undefined {
  const issue = issues.get(id);
  if (!issue) return undefined;
  const updated = { ...issue, ...patch, id, key: issue.key, createdAt: issue.createdAt, updatedAt: now() };
  issues.set(id, updated);
  return updated;
}

export function deleteIssue(id: string): boolean {
  return issues.delete(id);
}

// ─── Sprints ───────────────────────────────────────────────────────────────

export function listSprints(): Sprint[] {
  return Array.from(sprints.values()).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
}

export function getSprint(id: string): Sprint | undefined {
  return sprints.get(id);
}

export function createSprint(payload: Partial<Sprint>): Sprint {
  const id = nextSprintId();
  const sprint: Sprint = {
    id,
    name: payload.name ?? `Sprint ${sprintCounter - 1}`,
    goal: payload.goal ?? '',
    status: 'planning',
    startDate: payload.startDate ?? null,
    endDate: payload.endDate ?? null,
    createdAt: now(),
  };
  sprints.set(id, sprint);
  return sprint;
}

export function updateSprint(id: string, patch: Partial<Sprint>): Sprint | undefined {
  const sprint = sprints.get(id);
  if (!sprint) return undefined;
  const updated = { ...sprint, ...patch, id, createdAt: sprint.createdAt };
  sprints.set(id, updated);
  return updated;
}

export function deleteSprint(id: string): boolean {
  // Move sprint issues back to backlog
  for (const issue of issues.values()) {
    if (issue.sprintId === id) {
      issues.set(issue.id, { ...issue, sprintId: null, updatedAt: now() });
    }
  }
  return sprints.delete(id);
}

export function startSprint(id: string): Sprint | undefined {
  const sprint = sprints.get(id);
  if (!sprint || sprint.status !== 'planning') return undefined;
  return updateSprint(id, { status: 'active', startDate: sprint.startDate ?? now() });
}

export function completeSprint(id: string): Sprint | undefined {
  const sprint = sprints.get(id);
  if (!sprint || sprint.status !== 'active') return undefined;
  // Move unfinished issues back to backlog
  for (const issue of issues.values()) {
    if (issue.sprintId === id && issue.status !== 'done') {
      issues.set(issue.id, { ...issue, sprintId: null, updatedAt: now() });
    }
  }
  return updateSprint(id, { status: 'completed', endDate: sprint.endDate ?? now() });
}

export function addIssueToSprint(sprintId: string, issueId: string): Issue | undefined {
  const sprint = sprints.get(sprintId);
  if (!sprint) return undefined;
  return updateIssue(issueId, { sprintId });
}

export function removeIssueFromSprint(issueId: string): Issue | undefined {
  return updateIssue(issueId, { sprintId: null });
}

// ─── Seed data ─────────────────────────────────────────────────────────────

const sprint1 = createSprint({ name: 'Sprint 1', goal: 'Ship the MVP features' });

createIssue({ title: 'Set up CI/CD pipeline', type: 'task', priority: 'high', status: 'done', assignee: 'Alex Chen', storyPoints: 3, sprintId: sprint1.id });
createIssue({ title: 'Design system setup with Fluent UI', type: 'task', priority: 'high', status: 'done', assignee: 'Maria Lopez', storyPoints: 5, sprintId: sprint1.id });
createIssue({ title: 'Implement user authentication', type: 'story', priority: 'highest', status: 'in_progress', assignee: 'Alex Chen', storyPoints: 8, sprintId: sprint1.id });
createIssue({ title: 'Build kanban board view', type: 'story', priority: 'high', status: 'in_progress', assignee: 'Jordan Kim', storyPoints: 5, sprintId: sprint1.id });
createIssue({ title: 'Fix login page redirect bug', type: 'bug', priority: 'high', status: 'todo', assignee: 'Maria Lopez', storyPoints: 2, sprintId: sprint1.id });
createIssue({ title: 'Add sprint reporting dashboard', type: 'story', priority: 'medium', status: 'todo', assignee: null, storyPoints: 8, sprintId: sprint1.id });
createIssue({ title: 'Write unit tests for API layer', type: 'task', priority: 'medium', status: 'todo', assignee: 'Jordan Kim', storyPoints: 5, sprintId: sprint1.id });
createIssue({ title: 'Integrate with Microsoft Graph API', type: 'epic', priority: 'medium', status: 'todo', assignee: null, storyPoints: 13, sprintId: null });
createIssue({ title: 'Add dark mode support', type: 'story', priority: 'low', status: 'todo', assignee: null, storyPoints: 3, sprintId: null });
createIssue({ title: 'Performance optimization for large boards', type: 'task', priority: 'lowest', status: 'todo', assignee: null, storyPoints: 5, sprintId: null });

// Start sprint 1 so the board has content
startSprint(sprint1.id);
