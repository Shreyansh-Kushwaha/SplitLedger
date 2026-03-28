import { useEffect, useMemo, useState } from 'react';
import './index.css';

const API_URL = import.meta.env.VITE_API_URL || '';

const apiFetch = async (path, method = 'GET', body, token) => {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) throw new Error(data.message || 'API error');

  return data;
};

function App() {
  const initialToken = localStorage.getItem('splitledger_token');
  const initialUser = JSON.parse(localStorage.getItem('splitledger_user') || 'null');
  const initialDarkMode = JSON.parse(localStorage.getItem('splitledger_darkMode') || 'false');

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(initialToken);
  const [user, setUser] = useState(initialUser);
  const [message, setMessage] = useState('');
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [toUserId, setToUserId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState('lent');
  const [transactionsData, setTransactionsData] = useState({ totalLent: 0, totalBorrowed: 0, transactions: [] });
  const [loadingTxn, setLoadingTxn] = useState(false);
  const [darkMode, setDarkMode] = useState(initialDarkMode);

  const loggedIn = Boolean(token && user);

  const authHeader = token;

  const userLabel = user?.name ? `${user.name} (${user.email})` : 'Anonymous';

  // Load transactions on mount if logged in
  useEffect(() => {
    if (loggedIn) {
      fetchTransactions();
    }
  }, [loggedIn]); // Only run when login status changes

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('splitledger_darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const fetchTransactions = async () => {
    if (!authHeader) return;
    try {
      setLoadingTxn(true);
      const data = await apiFetch('/api/transactions', 'GET', null, authHeader);
      setTransactionsData(data);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoadingTxn(false);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !name)) {
      setMessage('Please fill required fields');
      return;
    }

    try {
      setMessage('');
      const route = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin ? { email, password } : { name, email, password };
      const data = await apiFetch(route, 'POST', payload);

      localStorage.setItem('splitledger_token', data.token);
      localStorage.setItem('splitledger_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      setMessage('Authentication successful');

      // reset form
      setName('');
      setPassword('');

      setTimeout(() => setMessage(''), 2500);
      fetchTransactions();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('splitledger_token');
    localStorage.removeItem('splitledger_user');
    setToken(null);
    setUser(null);
    setTransactionsData({ totalLent: 0, totalBorrowed: 0, transactions: [] });
    setMessage('Logged out successfully');
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const data = await apiFetch(`/api/users/search?query=${encodeURIComponent(query)}`, 'GET', null, authHeader);
      setSearchResults(data);
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();

    if (!toUserId || !amount || !date || !type) {
      setMessage('Fill transaction details');
      return;
    }

    try {
      setMessage('');
      await apiFetch('/api/transactions', 'POST', {
        toUserId,
        amount: Number(amount),
        description,
        date,
        type,
      }, authHeader);

      setToUserId('');
      setAmount('');
      setDescription('');
      setMessage('Transaction added');
      fetchTransactions();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleSettle = async (id) => {
    try {
      setMessage('');
      await apiFetch(`/api/transactions/${id}/settle`, 'PATCH', null, authHeader);
      setMessage('Transaction settled');
      fetchTransactions();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const transactions = transactionsData.transactions ?? [];

  const transactionRows = useMemo(() =>
    transactions.map((tx) => {
      const mine = tx.fromUser?.email === user?.email;
      const other = mine ? tx.toUser : tx.fromUser;
      const fromName = tx.fromUser?.name || 'Unknown';
      const toName = tx.toUser?.name || 'Unknown';
      const role = mine ? 'Lent to' : 'Borrowed from';

      return {
        id: tx._id,
        pair: `${fromName} → ${toName}`,
        role,
        otherName: other?.name || 'Unknown',
        amount: tx.amount,
        description: tx.description || '',
        date: new Date(tx.date).toLocaleDateString(),
        status: tx.status,
        mine,
        settleDisabled: tx.status === 'settled',
      };
    }), [transactions, user]);

  // Calculate net effective amounts per person
  const netAmounts = useMemo(() => {
    const nets = {};
    transactions.forEach((tx) => {
      if (tx.status === 'settled') return; // Skip settled transactions

      const mine = tx.fromUser?.email === user?.email;
      const other = mine ? tx.toUser : tx.fromUser;
      const otherEmail = other?.email || 'unknown';

      if (!nets[otherEmail]) {
        nets[otherEmail] = { name: other?.name || 'Unknown', lent: 0, borrowed: 0, net: 0 };
      }

      if (mine) {
        nets[otherEmail].lent += tx.amount;
      } else {
        nets[otherEmail].borrowed += tx.amount;
      }

      nets[otherEmail].net = nets[otherEmail].lent - nets[otherEmail].borrowed;
    });

    return Object.values(nets).filter(person => person.net !== 0);
  }, [transactions, user]);

  const modeClass = darkMode ? 'dark' : '';

  if (!loggedIn) {
    return (
      <div className={`min-h-screen py-6 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 ${modeClass}`}>
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">SplitLedger</h1>
            <button className="px-3 py-1 rounded bg-indigo-600 text-white" onClick={() => setDarkMode((s) => !s)}>
              {darkMode ? 'Light' : 'Dark'}
            </button>
          </div>

          <div className="bg-white/80 dark:bg-slate-800 rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">{isLogin ? 'Login' : 'Register'}</h2>
            {message && <p className="text-sm text-rose-600 mb-3">{message}</p>}

            <form onSubmit={handleAuthSubmit} className="space-y-3">
              {!isLogin && (
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  className="w-full border rounded px-3 py-2 bg-slate-50 dark:bg-slate-900"
                />
              )}

              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                type="email"
                className="w-full border rounded px-3 py-2 bg-slate-50 dark:bg-slate-900"
              />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                type="password"
                className="w-full border rounded px-3 py-2 bg-slate-50 dark:bg-slate-900"
              />

              <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded">
                {isLogin ? 'Login' : 'Register'}
              </button>
            </form>

            <button onClick={() => setIsLogin((s) => !s)} className="mt-3 text-sm text-indigo-500 hover:underline">
              {isLogin ? 'Create new account' : 'Already have account? Login'}
            </button>
          </div>

          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">Backend: {API_URL}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-4 px-2 sm:px-4 lg:px-6 bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 ${modeClass}`}>
      <div className="max-w-5xl mx-auto space-y-5">
        <header className="flex flex-wrap justify-between items-center gap-3 bg-white dark:bg-slate-900 rounded-xl p-4 shadow">
          <div>
            <h1 className="text-2xl font-bold">SplitLedger</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">{userLabel}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleLogout} className="px-3 py-1 rounded bg-rose-500 text-white">Logout</button>
            <button onClick={() => setDarkMode((s) => !s)} className="px-3 py-1 rounded bg-indigo-600 text-white">{darkMode ? 'Light' : 'Dark'}</button>
          </div>
        </header>

        {message && <div className="bg-amber-50 text-amber-700 p-3 rounded">{message}</div>}

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow">
            <h2 className="font-semibold text-lg mb-3">Totals</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded">
                <p className="text-sm">Total You Lent</p>
                <p className="text-xl font-bold">₹{transactionsData.totalLent ?? 0}</p>
              </div>
              <div className="p-3 bg-rose-50 dark:bg-rose-900/30 rounded">
                <p className="text-sm">Total You Borrowed</p>
                <p className="text-xl font-bold">₹{transactionsData.totalBorrowed ?? 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow">
            <h2 className="font-semibold text-lg mb-3">Net Effective (Pending)</h2>
            <div className="space-y-2">
              {netAmounts.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">All settled up! 🎉</p>
              ) : (
                netAmounts.map((person, index) => (
                  <div key={index} className="flex justify-between items-center p-2 border rounded">
                    <span className="font-medium">{person.name}</span>
                    <span className={`font-bold ${person.net > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {person.net > 0 ? `You get ₹${person.net}` : `You owe ₹${Math.abs(person.net)}`}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Changed this from <div> to <section> to fix the orphaned closing tag */}
        <section className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow">
          <h2 className="font-semibold text-lg mb-3">Search Users</h2>

          <form className="flex gap-2" onSubmit={handleSearch}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or email"
              className="flex-1 border rounded px-3 py-2 bg-slate-50 dark:bg-slate-800"
            />
            <button type="submit" className="px-4 bg-indigo-600 text-white rounded">Search</button>
          </form>

          <ul className="mt-3 space-y-2">
            {searchResults.map((u) => (
              <li key={u._id} className="border rounded p-2 flex justify-between items-center">
                <div>
                  <p className="font-medium">{u.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{u.email}</p>
                </div>
                <button
                  onClick={() => setToUserId(u._id)}
                  className={`px-2 py-1 rounded ${toUserId === u._id ? 'bg-green-600' : 'bg-indigo-600'} text-white text-xs`}
                >
                  {toUserId === u._id ? 'Selected' : 'Select'}
                </button>
              </li>
            ))}
            {searchResults.length === 0 && <li className="text-xs text-slate-400">No users found yet.</li>}
          </ul>
        </section>

        <section className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow">
          <h2 className="font-semibold text-lg mb-3">Add Transaction</h2>
          <form onSubmit={handleAddTransaction} className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="block text-sm mb-1">With</label>
              <input
                value={toUserId}
                onChange={(e) => setToUserId(e.target.value)}
                placeholder="User ID"
                className="w-full border rounded px-3 py-2 bg-slate-50 dark:bg-slate-800"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">(paste user id from search)</p>
            </div>
            <div>
              <label className="block text-sm mb-1">Amount (₹)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={0}
                step="0.01"
                className="w-full border rounded px-3 py-2 bg-slate-50 dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border rounded px-3 py-2 bg-slate-50 dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border rounded px-3 py-2 bg-slate-50 dark:bg-slate-800"
              >
                <option value="lent">Lent</option>
                <option value="borrowed">Borrowed</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Description</label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Milk, dinner, cab..."
                className="w-full border rounded px-3 py-2 bg-slate-50 dark:bg-slate-800"
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button className="px-4 py-2 bg-emerald-600 text-white rounded">Add Transaction</button>
            </div>
          </form>
        </section>

        <section className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold text-lg">Transaction History</h2>
            <button className="text-sm text-indigo-500 hover:underline" onClick={fetchTransactions}>Refresh</button>
          </div>

          {loadingTxn ? (
            <p className="text-sm">Loading...</p>
          ) : (
            <div className="space-y-2">
              {transactionRows.length === 0 && <p className="text-sm text-slate-400">No transactions yet.</p>}

              {transactionRows.map((tx) => (
                <article key={tx.id} className="border rounded-xl p-3 bg-slate-50 dark:bg-slate-800">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-slate-500">{tx.role} {tx.otherName}</p>
                      <p className="text-base font-semibold">₹{tx.amount}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded ${tx.status === 'settled' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-200' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200'}`}>
                      {tx.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{tx.description || 'No description'}</p>
                  <p className="text-xs text-slate-400 mt-1">{tx.date}</p>
                  <div className="mt-2">
                    <button
                      onClick={() => handleSettle(tx.id)}
                      disabled={tx.settleDisabled}
                      className={`text-xs py-1 px-2 rounded ${tx.settleDisabled ? 'bg-slate-400 text-white cursor-not-allowed' : 'bg-indigo-600 text-white'}`}
                    >
                      {tx.settleDisabled ? 'Settled' : 'Mark as Settled'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;