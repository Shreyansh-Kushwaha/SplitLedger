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
  SettlementRequests,
  SettlementForm,
} from './components';

// Hooks
import { useAuth, useTransactions, useSettlementRequests } from './hooks';

// Services
import { authService } from './services';

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedUserName, setSelectedUserName] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [settlementPerson, setSettlementPerson] = useState(null);

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
  const {
    requests,
    loading: reqLoading,
    error: reqError,
    fetchRequests,
    createRequest,
    confirmRequest,
    rejectRequest,
  } = useSettlementRequests();

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

  const handleSettleClick = (person) => {
    setSettlementPerson(person);
  };

  const handleSettlementSubmit = async (data) => {
    await createRequest(data);
    setSettlementPerson(null);
    await fetchTransactions(); // Refresh net amounts
  };

  const handleSettlementCancel = () => {
    setSettlementPerson(null);
  };

  const handleConfirmRequest = async (id) => {
    try {
      await confirmRequest(id);
    } catch (err) {
      console.error('Confirm request failed:', err);
    }
    await fetchRequests(); // Always refresh requests
    await fetchTransactions(); // Refresh after confirmation
  };

  const handleRejectRequest = async (id) => {
    try {
      await rejectRequest(id);
    } catch (err) {
      console.error('Reject request failed:', err);
    }
    await fetchRequests(); // Always refresh requests
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
      settledAt: tx.settledAt ? new Date(tx.settledAt).toLocaleDateString() : null,
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
      <div className="min-h-screen bg-(--app-bg) text-(--app-text) transition-colors duration-200">
        <div className="min-h-screen flex flex-col items-center justify-center py-10 px-4">
          <div className="w-full max-w-md">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">SplitLedger</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Track money lent &amp; borrowed</p>
              </div>
              <button
                className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm"
                onClick={handleToggleDarkMode}
                title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? '☀️' : '🌙'}
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
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 px-2 sm:px-4 lg:px-6 bg-(--app-bg) text-(--app-text) transition-colors duration-200">
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
          <NetEffectiveCard netAmounts={netAmounts} onSettleClick={handleSettleClick} />
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

        <SettlementRequests
          requests={requests}
          currentUserEmail={user?.email}
          onConfirm={handleConfirmRequest}
          onReject={handleRejectRequest}
          onRefresh={fetchRequests}
          loading={reqLoading}
        />

        {settlementPerson && (
          <SettlementForm
            person={settlementPerson}
            maxAmount={Math.abs(settlementPerson.net)}
            onSubmit={handleSettlementSubmit}
            onCancel={handleSettlementCancel}
            loading={reqLoading}
            error={reqError}
          />
        )}
      </div>
    </div>
  );
}

export default App;