import PropTypes from 'prop-types';

const UserTransactionHistoryTable = ({ selectedUserName, transactions }) => {
  if (!selectedUserName) return null;

  return (
    <div className="bg-(--app-surface) rounded-xl p-4 shadow-sm border border-(--app-border)">
      <h2 className="font-semibold text-lg mb-3 text-(--app-text)">
        History with {selectedUserName}
      </h2>
      {transactions.length === 0 ? (
        <p className="text-sm text-(--app-text-2)">No transactions found for this user.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-(--app-text)">
            <thead className="bg-(--app-surface-3) text-(--app-text)">
              <tr>
                <th className="px-3 py-2 border border-(--app-border)">Description</th>
                <th className="px-3 py-2 border border-(--app-border)">Date</th>
                <th className="px-3 py-2 border border-(--app-border)">Amount</th>
                <th className="px-3 py-2 border border-(--app-border)">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => {
                const value = tx.role === 'Lent to' ? tx.amount : -tx.amount;
                const amountClass = value >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400';
                return (
                  <tr key={tx.id} className="even:bg-(--app-surface-2) odd:bg-(--app-surface)">
                    <td className="px-3 py-2 border border-(--app-border)">{tx.description || '—'}</td>
                    <td className="px-3 py-2 border border-(--app-border)">{tx.date}</td>
                    <td className={`px-3 py-2 border border-(--app-border) font-semibold ${amountClass}`}>
                      {value >= 0 ? `+₹${value}` : `-₹${Math.abs(value)}`}
                    </td>
                    <td className="px-3 py-2 border border-(--app-border)">{tx.status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

UserTransactionHistoryTable.propTypes = {
  selectedUserName: PropTypes.string,
  transactions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    otherName: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    description: PropTypes.string,
  })).isRequired,
};

UserTransactionHistoryTable.defaultProps = {
  selectedUserName: '',
};

export default UserTransactionHistoryTable;
