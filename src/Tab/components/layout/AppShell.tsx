import React from 'react';
import { makeStyles, tokens } from '@fluentui/react-components';
import { NavSidebar } from './NavSidebar';
import '../../App.css';

const useStyles = makeStyles({
  shell: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
    backgroundColor: tokens.colorNeutralBackground1,
  },
  content: {
    flex: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
});

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const styles = useStyles();
  return (
    <div className={styles.shell}>
      <NavSidebar />
      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
}
