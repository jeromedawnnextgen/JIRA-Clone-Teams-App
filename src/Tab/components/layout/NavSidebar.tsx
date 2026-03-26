import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { makeStyles, tokens, Text } from '@fluentui/react-components';
import { TableRegular, GridRegular, ArrowSprintRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  sidebar: {
    width: '200px',
    minWidth: '200px',
    height: '100%',
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground2,
    display: 'flex',
    flexDirection: 'column',
    padding: '8px 0',
  },
  projectHeader: {
    padding: '12px 16px 8px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    marginBottom: '8px',
  },
  projectName: {
    fontWeight: '700',
    fontSize: '14px',
    color: tokens.colorNeutralForeground1,
    display: 'block',
  },
  projectType: {
    fontSize: '11px',
    color: tokens.colorNeutralForeground3,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    textDecoration: 'none',
    color: tokens.colorNeutralForeground2,
    fontSize: '13px',
    borderRadius: '0',
    transition: 'background 0.1s',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground3,
      color: tokens.colorNeutralForeground1,
    },
  },
  activeNavItem: {
    backgroundColor: tokens.colorNeutralBackground3Hover,
    color: tokens.colorBrandForeground1,
    fontWeight: '600',
  },
});

const navItems = [
  { to: '/board', label: 'Board', Icon: GridRegular },
  { to: '/backlog', label: 'Backlog', Icon: TableRegular },
  { to: '/sprints', label: 'Sprints', Icon: ArrowSprintRegular },
];

export function NavSidebar() {
  const styles = useStyles();
  const location = useLocation();

  return (
    <nav className={styles.sidebar}>
      <div className={styles.projectHeader}>
        <span className={styles.projectName}>TEST</span>
        <Text className={styles.projectType}>Scrum Project</Text>
      </div>
      {navItems.map(({ to, label, Icon }) => {
        const isActive = location.pathname === to;
        return (
          <NavLink
            key={to}
            to={to}
            className={`${styles.navItem} ${isActive ? styles.activeNavItem : ''}`}
          >
            <Icon fontSize={16} />
            {label}
          </NavLink>
        );
      })}
    </nav>
  );
}
