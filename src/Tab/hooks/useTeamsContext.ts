import { useState, useEffect } from 'react';
import * as teamsJs from '@microsoft/teams-js';

export function useTeamsContext() {
  const [teamsContext, setTeamsContext] = useState<teamsJs.app.Context | null>(null);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    teamsJs.app.initialize().then(() => {
      teamsJs.app.getContext().then((ctx) => {
        setTeamsContext(ctx);
        if (ctx?.app?.theme === 'default') setIsDark(false);
      });
    }).catch(() => {
      // Running outside Teams (browser dev) — use defaults
    });
  }, []);

  return { teamsContext, isDark };
}
