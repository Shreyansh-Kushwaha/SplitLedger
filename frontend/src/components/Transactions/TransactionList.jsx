import PropTypes from 'prop-types';
import TransactionItem from './TransactionItem.jsx';

const TransactionList = ({ transactions, onSettle, onRefresh, loading }) => {
  return (
    <section className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md dark:shadow-lg border border-slate-200 dark:border-slate-700">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-lg text-slate-900 dark:text-white">Transaction History</h2>
        <button
          className="text-sm text-indigo-500 hover:underline"
          onClick={onRefresh}
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-slate-600 dark:text-slate-400">Loading...</p>
      ) : (
        <div className="space-y-2">
          {transactions.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">No transactions yet.</p>
          ) : (
            transactions.map((tx) => (
              <TransactionItem
                key={tx.id}
                transaction={tx}
                onSettle={onSettle}
              />
            ))
          )}
        </div>
      )}
    </section>
  );
};

TransactionList.propTypes = {
  transactions: PropTypes.array.isRequired,
  onSettle: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default TransactionList;