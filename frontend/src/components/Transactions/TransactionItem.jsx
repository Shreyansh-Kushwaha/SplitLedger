import PropTypes from 'prop-types';

const TransactionItem = ({ transaction, onSettle }) => {
  const { id, role, otherName, amount, description, date, status, settleDisabled } = transaction;

  return (
    <article className="border border-slate-300 dark:border-slate-700 rounded-xl p-3 bg-slate-50 dark:bg-slate-700">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-400">{role} {otherName}</p>
          <p className="text-base font-semibold text-slate-900 dark:text-white">₹{amount}</p>
        </div>
        <span className={`px-2 py-1 text-xs rounded font-medium ${
          status === 'settled'
            ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-200'
            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200'
        }`}>
          {status}
        </span>
      </div>
      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{description || 'No description'}</p>
      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{date}</p>
      <div className="mt-2">
        <button
          onClick={() => onSettle(id)}
          disabled={settleDisabled}
          className={`text-xs py-1 px-2 rounded transition-colors ${
            settleDisabled
              ? 'bg-slate-400 text-white cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {settleDisabled ? 'Settled' : 'Mark as Settled'}
        </button>
      </div>
    </article>
  );
};

TransactionItem.propTypes = {
  transaction: PropTypes.shape({
    id: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    otherName: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    description: PropTypes.string,
    date: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    settleDisabled: PropTypes.bool,
  }).isRequired,
  onSettle: PropTypes.func.isRequired,
};

export default TransactionItem;