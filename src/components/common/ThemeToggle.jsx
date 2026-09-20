import React from 'react';
import { useTheme } from '../../hooks/useTheme';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="nav-action-btn"
      title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <i className="bi bi-moon-stars-fill fs-5 text-dark"></i>
      ) : (
        <i className="bi bi-sun-fill fs-5 text-warning"></i>
      )}
    </button>
  );
};

export default ThemeToggle;
