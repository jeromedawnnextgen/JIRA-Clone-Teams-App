import type { Request, Response, Application } from 'express';
import {
  listSprints, getSprint, createSprint, updateSprint, deleteSprint,
  startSprint, completeSprint, addIssueToSprint, removeIssueFromSprint,
} from '../store';

export function createSprintRoutes(http: Application) {
  http.get('/api/sprints', (_req: Request, res: Response) => {
    res.json(listSprints());
  });

  http.get('/api/sprints/:id', (req: Request, res: Response) => {
    const sprint = getSprint(req.params.id);
    if (!sprint) return res.status(404).json({ error: 'Not found' });
    res.json(sprint);
  });

  http.post('/api/sprints', (req: Request, res: Response) => {
    const sprint = createSprint(req.body);
    res.status(201).json(sprint);
  });

  http.patch('/api/sprints/:id', (req: Request, res: Response) => {
    const sprint = updateSprint(req.params.id, req.body);
    if (!sprint) return res.status(404).json({ error: 'Not found' });
    res.json(sprint);
  });

  http.delete('/api/sprints/:id', (req: Request, res: Response) => {
    const ok = deleteSprint(req.params.id);
    res.status(ok ? 204 : 404).end();
  });

  http.post('/api/sprints/:id/start', (req: Request, res: Response) => {
    const sprint = startSprint(req.params.id);
    if (!sprint) return res.status(400).json({ error: 'Cannot start sprint' });
    res.json(sprint);
  });

  http.post('/api/sprints/:id/complete', (req: Request, res: Response) => {
    const sprint = completeSprint(req.params.id);
    if (!sprint) return res.status(400).json({ error: 'Cannot complete sprint' });
    res.json(sprint);
  });

  http.post('/api/sprints/:id/issues', (req: Request, res: Response) => {
    const { issueId } = req.body as { issueId: string };
    const issue = addIssueToSprint(req.params.id, issueId);
    if (!issue) return res.status(404).json({ error: 'Sprint or issue not found' });
    res.json(issue);
  });

  http.delete('/api/sprints/:id/issues/:iid', (req: Request, res: Response) => {
    const issue = removeIssueFromSprint(req.params.iid);
    if (!issue) return res.status(404).json({ error: 'Issue not found' });
    res.json(issue);
  });
}
