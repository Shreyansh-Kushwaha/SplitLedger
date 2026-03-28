import PropTypes from 'prop-types';

const Header = ({ user, onLogout, darkMode, onToggleDarkMode }) => {
  const userLabel = user?.name ? `${user.name} (${user.email})` : 'Anonymous';

  return (
    <header className="flex flex-wrap justify-between items-center gap-3 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md dark:shadow-lg border border-slate-200 dark:border-slate-700">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">SplitLedger</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">{userLabel}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onLogout}
          className="px-3 py-1 rounded bg-rose-500 text-white hover:bg-rose-600 transition-colors"
        >
          Logout
        </button>
        <button
          onClick={onToggleDarkMode}
          className="px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
        >
          {darkMode ? 'Light' : 'Dark'}
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