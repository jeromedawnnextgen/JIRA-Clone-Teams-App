import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FluentProvider, teamsDarkTheme, teamsLightTheme } from '@fluentui/react-components';
import { AppShell } from './components/layout/AppShell';
import { BoardView } from './components/board/BoardView';
import { BacklogView } from './components/backlog/BacklogView';
import { SprintView } from './components/sprints/SprintView';
import { useTeamsContext } from './hooks/useTeamsContext';

export default function App() {
  const { isDark } = useTeamsContext();

  return (
    <FluentProvider theme={isDark ? teamsDarkTheme : teamsLightTheme}>
      <BrowserRouter basename="/tabs/home">
        <AppShell>
          <Routes>
            <Route path="/" element={<Navigate to="/board" replace />} />
            <Route path="/board" element={<BoardView />} />
            <Route path="/backlog" element={<BacklogView />} />
            <Route path="/sprints" element={<SprintView />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </FluentProvider>
  );
}
