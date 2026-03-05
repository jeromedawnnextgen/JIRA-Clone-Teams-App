import type { Request, Response, Application } from 'express';
import { listIssues, getIssue, createIssue, updateIssue, deleteIssue } from '../store';

export function createIssueRoutes(http: Application) {
  http.get('/api/issues', (req: Request, res: Response) => {
    const { sprintId, status, search } = req.query as Record<string, string>;
    res.json(listIssues({ sprintId, status, search }));
  });

  http.get('/api/issues/:id', (req: Request, res: Response) => {
    const issue = getIssue(req.params.id);
    if (!issue) return res.status(404).json({ error: 'Not found' });
    res.json(issue);
  });

  http.post('/api/issues', (req: Request, res: Response) => {
    const issue = createIssue(req.body);
    res.status(201).json(issue);
  });

  http.patch('/api/issues/:id', (req: Request, res: Response) => {
    const issue = updateIssue(req.params.id, req.body);
    if (!issue) return res.status(404).json({ error: 'Not found' });
    res.json(issue);
  });

  http.delete('/api/issues/:id', (req: Request, res: Response) => {
    const ok = deleteIssue(req.params.id);
    res.status(ok ? 204 : 404).end();
  });
}
