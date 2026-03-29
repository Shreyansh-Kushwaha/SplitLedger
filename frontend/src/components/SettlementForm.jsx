import { useState } from 'react';
import PropTypes from 'prop-types';

// 1. We added maxAmount to the props
const SettlementForm = ({ person, maxAmount, onSubmit, onCancel, loading, error }) => {
  const [amount, setAmount] = useState('');
  const [localError, setLocalError] = useState(''); // State for our frontend validation error

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError(''); // Clear previous errors
    
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount) || numAmount <= 0) {
      setLocalError('Please enter a valid amount');
      return;
    }

    // 2. The new safety check! Block it if it's too high.
    if (numAmount > maxAmount) {
      setLocalError(`You cannot settle more than you owe (₹${maxAmount}).`);
      return;
    }

    onSubmit({ toUserId: person.userId, amount: numAmount });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold mb-1 text-slate-900 dark:text-white">
          Settle with {person.name}
        </h2>
        
        {/* 3. Show the user exactly how much they owe */}
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Net Pending Debt: <span className="font-semibold text-slate-700 dark:text-slate-300">₹{maxAmount}</span>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Amount to settle (₹)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setLocalError(''); // Clear error when they start typing again
              }}
              className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white ${
                localError ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
              }`}
              placeholder="Enter amount"
              min="0.01"
              max={maxAmount} // HTML level validation
              step="0.01"
              required
            />
          </div>
          
          {/* Display either our local frontend error OR the backend error */}
          {(localError || error) && (
            <p className="text-red-600 dark:text-red-400 text-sm mb-4">
              {localError || error}
            </p>
          )}

          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Sending...' : 'Send Request'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-300 py-2 px-4 rounded-md hover:bg-slate-400 dark:hover:bg-slate-500 transition-colors"
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
  maxAmount: PropTypes.number.isRequired, // Added requirement for maxAmount
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
};

export default SettlementForm;