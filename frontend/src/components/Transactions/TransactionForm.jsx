import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TRANSACTION_TYPES } from '../../utils/constants.js';

const TransactionForm = ({ onSubmit, loading, error, selectedUserId }) => {
  const [toUserId, setToUserId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState(TRANSACTION_TYPES.LENT);

  // Update toUserId when selectedUserId changes
  useEffect(() => {
    if (selectedUserId) {
      setToUserId(selectedUserId);
    }
  }, [selectedUserId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!toUserId || !amount || !date || !type) {
      return;
    }

    try {
      await onSubmit({
        toUserId,
        amount: Number(amount),
        description,
        date,
        type,
      });

      // Reset form
      setToUserId('');
      setAmount('');
      setDescription('');
    } catch (err) {
      // Error handled by parent
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md dark:shadow-lg border border-slate-200 dark:border-slate-700">
      <h2 className="font-semibold text-lg mb-3 text-slate-900 dark:text-white">Add Transaction</h2>
      {error && <p className="text-sm text-rose-600 dark:text-rose-400 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="block text-sm mb-1 text-slate-900 dark:text-white">With</label>
          <input
            value={toUserId}
            onChange={(e) => setToUserId(e.target.value)}
            placeholder="User ID"
            className="w-full border rounded px-3 py-2 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
            required
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Paste user ID from search results
          </p>
        </div>

        <div>
          <label className="block text-sm mb-1 text-slate-900 dark:text-white">Amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="0.01"
            className="w-full border rounded px-3 py-2 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-slate-900 dark:text-white">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded px-3 py-2 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-slate-900 dark:text-white">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border rounded px-3 py-2 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
            required
          >
            <option value={TRANSACTION_TYPES.LENT}>Lent</option>
            <option value={TRANSACTION_TYPES.BORROWED}>Borrowed</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm mb-1 text-slate-900 dark:text-white">Description</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Milk, dinner, cab..."
            className="w-full border rounded px-3 py-2 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
          />
        </div>

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Transaction'}
          </button>
        </div>
      </form>
    </div>
  );
};

TransactionForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  selectedUserId: PropTypes.string,
};

export default TransactionForm;