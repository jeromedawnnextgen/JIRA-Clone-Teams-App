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

export type CreateIssuePayload = {
  title: string;
  description?: string;
  type?: IssueType;
  priority?: Priority;
  assignee?: string | null;
  storyPoints?: number | null;
  sprintId?: string | null;
};

export type UpdateIssuePayload = Partial<Omit<Issue, 'id' | 'key' | 'createdAt'>>;

export type CreateSprintPayload = {
  name: string;
  goal?: string;
};

export type UpdateSprintPayload = Partial<Omit<Sprint, 'id' | 'createdAt' | 'status'>>;
