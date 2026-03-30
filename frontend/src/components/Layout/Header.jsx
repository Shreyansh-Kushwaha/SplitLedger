import PropTypes from 'prop-types';

const Header = ({ user, onLogout, darkMode, onToggleDarkMode }) => {
  const userName = user?.name || 'Anonymous';
  const userEmail = user?.email || '';

  return (
    <header className="flex flex-wrap justify-between items-center gap-3 bg-(--app-surface) rounded-xl px-5 py-4 shadow-sm border border-(--app-border)">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-(--app-text)">SplitLedger</h1>
        <p className="text-xs text-(--app-text-3) mt-0.5">
          {userName}{userEmail ? ` · ${userEmail}` : ''}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleDarkMode}
          className="p-2 rounded-lg bg-(--app-surface-2) border border-(--app-border-2) text-(--app-text-2) hover:bg-(--app-surface-3) transition-colors"
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
        <button
          onClick={onLogout}
          className="px-4 py-2 rounded-lg bg-rose-500 text-white text-sm font-medium hover:bg-rose-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

Header.propTypes = {
  user: PropTypes.object,
  onLogout: PropTypes.func.isRequired,
  darkMode: PropTypes.bool.isRequired,
  onToggleDarkMode: PropTypes.func.isRequired,
};

export default Header;
