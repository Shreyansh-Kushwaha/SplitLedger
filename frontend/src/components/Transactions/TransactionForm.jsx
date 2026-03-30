import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TRANSACTION_TYPES } from '../../utils/constants.js';

const TransactionForm = ({ onSubmit, loading, error, selectedUserId }) => {
  const [toUserId, setToUserId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState(TRANSACTION_TYPES.LENT);

  useEffect(() => {
    if (selectedUserId) setToUserId(selectedUserId);
  }, [selectedUserId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!toUserId || !amount || !date || !type) return;
    try {
      await onSubmit({ toUserId, amount: Number(amount), description, date, type });
      setToUserId('');
      setAmount('');
      setDescription('');
    } catch (err) {
      // Error handled by parent
    }
  };

  const inputClass = "w-full border border-(--app-border-2) rounded-lg px-3 py-2 bg-(--app-surface-2) text-(--app-text) placeholder:text-(--app-text-3) focus:outline-none focus:ring-2 focus:ring-(--app-ring)";
  const labelClass = "block text-sm mb-1 text-(--app-text-2)";

  return (
    <div className="bg-(--app-surface) rounded-xl p-4 shadow-sm border border-(--app-border)">
      <h2 className="font-semibold text-lg mb-3 text-(--app-text)">Add Transaction</h2>
      {error && <p className="text-sm text-rose-600 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2">
        <div>
          <label className={labelClass}>With (User ID)</label>
          <input
            value={toUserId}
            onChange={(e) => setToUserId(e.target.value)}
            placeholder="User ID from search"
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className={labelClass}>Amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="0.01"
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className={labelClass}>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className={labelClass}>Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className={inputClass}
            required
          >
            <option value={TRANSACTION_TYPES.LENT}>Lent</option>
            <option value={TRANSACTION_TYPES.BORROWED}>Borrowed</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Description</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Milk, dinner, cab..."
            className={inputClass}
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-(--app-accent) text-white py-2 rounded-lg font-medium hover:bg-(--app-accent-hover) transition-colors disabled:opacity-50"
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
