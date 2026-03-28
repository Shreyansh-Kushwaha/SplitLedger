import { useState } from 'react';
import PropTypes from 'prop-types';
import { userAPI, authService } from '../../services';

const UserSearch = ({ onUserSelect, selectedUserId }) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const data = await userAPI.search(query, authService.getToken());
      setSearchResults(data);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md dark:shadow-lg border border-slate-200 dark:border-slate-700">
      <h2 className="font-semibold text-lg mb-3 text-slate-900 dark:text-white">Search Users</h2>

      <form className="flex gap-2" onSubmit={handleSearch}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or email"
          className="flex-1 border rounded px-3 py-2 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {loading ? '...' : 'Search'}
        </button>
      </form>

      <ul className="mt-3 space-y-2">
        {searchResults.map((user) => (
          <li key={user._id} className="border border-slate-300 dark:border-slate-600 rounded p-2 flex justify-between items-center bg-slate-50 dark:bg-slate-700">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">{user.name}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">{user.email}</p>
            </div>
            <button
              onClick={() => onUserSelect(user)}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                selectedUserId === user._id
                  ? 'bg-green-600 text-white'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {selectedUserId === user._id ? 'Selected' : 'Select'}
            </button>
          </li>
        ))}
        {searchResults.length === 0 && !loading && (
          <li className="text-xs text-slate-500 dark:text-slate-400">No users found yet.</li>
        )}
      </ul>
    </div>
  );
};

UserSearch.propTypes = {
  onUserSelect: PropTypes.func.isRequired,
  selectedUserId: PropTypes.string,
};

export default UserSearch;