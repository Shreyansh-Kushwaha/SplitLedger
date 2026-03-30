import PropTypes from 'prop-types';
import TransactionItem from './TransactionItem.jsx';

const TransactionList = ({ transactions, onSettle, onRefresh, loading }) => {
  return (
    <section className="bg-(--app-surface) rounded-xl p-4 shadow-sm border border-(--app-border)">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-lg text-(--app-text)">Transaction History</h2>
        <button
          className="text-sm text-(--app-accent) hover:underline"
          onClick={onRefresh}
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-(--app-text-2)">Loading...</p>
      ) : (
        <div className="space-y-2">
          {transactions.length === 0 ? (
            <p className="text-sm text-(--app-text-3)">No transactions yet.</p>
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
