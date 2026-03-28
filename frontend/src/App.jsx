import { useState, useEffect, useMemo } from 'react';
import './index.css';

// Components
import {
  Header,
  LoginForm,
  RegisterForm,
  TotalsCard,
  NetEffectiveCard,
  UserSearch,
  TransactionForm,
  TransactionList,
  UserTransactionHistoryTable,
} from './components';

// Hooks
import { useAuth, useTransactions } from './hooks';

// Services
import { authService } from './services';

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedUserName, setSelectedUserName] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  // Initialize dark mode on mount
  useEffect(() => {
    const initialDarkMode = authService.getDarkMode();
    setDarkMode(initialDarkMode);
  }, []);

  // Custom hooks
  const { user, loading: authLoading, error: authError, login, register, logout } = useAuth();
  const {
    transactionsData,
    netAmounts,
    loading: txnLoading,
    error: txnError,
    fetchTransactions,
    createTransaction,
    settleTransaction,
  } = useTransactions();

  const loggedIn = authService.isAuthenticated();

  // Apply dark mode to document root
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
    authService.setDarkMode(darkMode);
  }, [darkMode]);

  const handleAuthSubmit = async (userData) => {
    const authFn = isLogin ? login : register;
    await authFn(userData);
    setTimeout(() => setMessage(''), 2500);
  };

  const handleLogout = () => {
    logout();
    setSelectedUserId('');
    setSelectedUserName('');
  };

  const handleToggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const handleUserSelect = (user) => {
    setSelectedUserId(user._id);
    setSelectedUserName(user.name);
  };

  const handleTransactionSubmit = async (transactionData) => {
    await createTransaction(transactionData);
    setSelectedUserId('');
  };

  const handleSettleTransaction = async (id) => {
    await settleTransaction(id);
  };

  // Transform transactions for display
  const transactionRows = useMemo(() => transactionsData.transactions.map((tx) => {
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
      fromUserId: tx.fromUser?._id,
      toUserId: tx.toUser?._id,
    };
  }), [transactionsData.transactions, user]);

  const selectedUserTransactions = useMemo(() => {
    if (!selectedUserId) return [];

    return transactionRows.filter((tx) =>
      tx.fromUserId === selectedUserId || tx.toUserId === selectedUserId
    );
  }, [selectedUserId, transactionRows]);

  if (!loggedIn) {
    return (
      <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">SplitLedger</h1>
            <button
              className="px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              onClick={handleToggleDarkMode}
            >
              {darkMode ? 'Light' : 'Dark'}
            </button>
          </div>

          {isLogin ? (
            <LoginForm
              onLogin={handleAuthSubmit}
              onSwitchToRegister={() => setIsLogin(false)}
              loading={authLoading}
              error={authError}
            />
          ) : (
            <RegisterForm
              onRegister={handleAuthSubmit}
              onSwitchToLogin={() => setIsLogin(true)}
              loading={authLoading}
              error={authError}
            />
          )}

          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
            Backend: {import.meta.env.VITE_API_URL || 'http://localhost:5000'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 px-2 sm:px-4 lg:px-6 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="max-w-5xl mx-auto space-y-5">
        <Header
          user={user}
          onLogout={handleLogout}
          darkMode={darkMode}
          onToggleDarkMode={handleToggleDarkMode}
        />

        {(authError || txnError) && (
          <div className="bg-amber-50 text-amber-700 p-3 rounded">
            {authError || txnError}
          </div>
        )}

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TotalsCard
            totalLent={transactionsData.totalLent}
            totalBorrowed={transactionsData.totalBorrowed}
          />
          <NetEffectiveCard netAmounts={netAmounts} />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UserSearch
            onUserSelect={handleUserSelect}
            selectedUserId={selectedUserId}
          />
          <TransactionForm
            onSubmit={handleTransactionSubmit}
            loading={txnLoading}
            error={txnError}
            selectedUserId={selectedUserId}
          />
        </section>

        <UserTransactionHistoryTable
          selectedUserName={selectedUserName}
          transactions={selectedUserTransactions}
        />

        <TransactionList
          transactions={transactionRows}
          onSettle={handleSettleTransaction}
          onRefresh={fetchTransactions}
          loading={txnLoading}
        />
      </div>
    </div>
  );
}

export default App;