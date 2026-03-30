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
    <div className="bg-(--app-surface) rounded-xl p-4 shadow-sm border border-(--app-border)">
      <h2 className="font-semibold text-lg mb-3 text-(--app-text)">Search Users</h2>

      <form className="flex gap-2" onSubmit={handleSearch}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or email"
          className="flex-1 border border-(--app-border-2) rounded-lg px-3 py-2 bg-(--app-surface-2) text-(--app-text) placeholder:text-(--app-text-3) focus:outline-none focus:ring-2 focus:ring-(--app-ring)"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 bg-(--app-accent) text-white rounded-lg hover:bg-(--app-accent-hover) transition-colors disabled:opacity-50"
        >
          {loading ? '...' : 'Search'}
        </button>
      </form>

      <ul className="mt-3 space-y-2">
        {searchResults.map((user) => (
          <li key={user._id} className="border border-(--app-border-2) rounded-lg p-2 flex justify-between items-center bg-(--app-surface-2)">
            <div>
              <p className="font-medium text-(--app-text)">{user.name}</p>
              <p className="text-xs text-(--app-text-2)">{user.email}</p>
            </div>
            <button
              onClick={() => onUserSelect(user)}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                selectedUserId === user._id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-(--app-accent) text-white hover:bg-(--app-accent-hover)'
              }`}
            >
              {selectedUserId === user._id ? 'Selected' : 'Select'}
            </button>
          </li>
        ))}
        {searchResults.length === 0 && !loading && (
          <li className="text-xs text-(--app-text-3)">No users found yet.</li>
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
