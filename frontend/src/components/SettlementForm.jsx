import { useState } from 'react';
import PropTypes from 'prop-types';

const SettlementForm = ({ person, maxAmount, onSubmit, onCancel, loading, error }) => {
  const [amount, setAmount] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError('');
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setLocalError('Please enter a valid amount');
      return;
    }
    if (numAmount > maxAmount) {
      setLocalError(`You cannot settle more than you owe (₹${maxAmount}).`);
      return;
    }
    onSubmit({ toUserId: person.userId, amount: numAmount });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-(--app-surface) rounded-xl p-6 shadow-lg max-w-md w-full mx-4 border border-(--app-border)">
        <h2 className="text-xl font-semibold mb-1 text-(--app-text)">
          Settle with {person.name}
        </h2>
        <p className="text-sm text-(--app-text-3) mb-4">
          Net Pending Debt: <span className="font-semibold text-(--app-text-2)">₹{maxAmount}</span>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-(--app-text-2) mb-1">
              Amount to settle (₹)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setLocalError(''); }}
              className={`w-full px-3 py-2 border rounded-lg bg-(--app-surface-2) text-(--app-text) focus:outline-none focus:ring-2 focus:ring-(--app-ring) ${
                localError ? 'border-red-500' : 'border-(--app-border-2)'
              }`}
              placeholder="Enter amount"
              min="0.01"
              max={maxAmount}
              step="0.01"
              required
            />
          </div>

          {(localError || error) && (
            <p className="text-red-500 text-sm mb-4">{localError || error}</p>
          )}

          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-(--app-accent) text-white py-2 px-4 rounded-lg hover:bg-(--app-accent-hover) disabled:opacity-50 transition-colors"
            >
              {loading ? 'Sending...' : 'Send Request'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-(--app-surface-3) text-(--app-text) py-2 px-4 rounded-lg hover:bg-(--app-border-2) transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

SettlementForm.propTypes = {
  person: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string,
    userId: PropTypes.string.isRequired,
  }).isRequired,
  maxAmount: PropTypes.number.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
};

export default SettlementForm;
