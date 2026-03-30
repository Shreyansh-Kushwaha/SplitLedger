import PropTypes from 'prop-types';

const TransactionItem = ({ transaction, onSettle }) => {
  const { id, role, otherName, amount, description, date, status, settleDisabled } = transaction;

  return (
    <article className="border border-(--app-border-2) rounded-xl p-3 bg-(--app-surface-2)">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-(--app-text-2)">{role} {otherName}</p>
          <p className="text-base font-semibold text-(--app-text)">₹{amount}</p>
        </div>
        <span className={`px-2 py-1 text-xs rounded font-medium ${
          status === 'settled'
            ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-200'
            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200'
        }`}>
          {status}
        </span>
      </div>
      <p className="text-xs text-(--app-text-2) mt-1">{description || 'No description'}</p>
      <p className="text-xs text-(--app-text-3) mt-1">{date}</p>
      <div className="mt-2">
        <button
          onClick={() => onSettle(id)}
          disabled={settleDisabled}
          className={`text-xs py-1 px-2 rounded transition-colors ${
            settleDisabled
              ? 'bg-slate-400 text-white cursor-not-allowed'
              : 'bg-(--app-accent) text-white hover:bg-(--app-accent-hover)'
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
