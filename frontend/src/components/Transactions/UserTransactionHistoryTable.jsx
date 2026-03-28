import PropTypes from 'prop-types';

const UserTransactionHistoryTable = ({ selectedUserName, transactions }) => {
  if (!selectedUserName) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md dark:shadow-lg border border-slate-200 dark:border-slate-700">
      <h2 className="font-semibold text-lg mb-3 text-slate-900 dark:text-white">
        Transaction History for {selectedUserName}
      </h2>
      {transactions.length === 0 ? (
        <p className="text-sm text-slate-600 dark:text-slate-400">No transactions found for this user.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-700 dark:text-slate-200">
            <thead className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
              <tr>
                <th className="px-3 py-2 border">Description</th>
                <th className="px-3 py-2 border">Date</th>
                <th className="px-3 py-2 border">Amount</th>
                <th className="px-3 py-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => {
                const value = tx.role === 'Lent to' ? tx.amount : -tx.amount;
                const amountClass = value >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';

                return (
                  <tr key={tx.id} className="even:bg-slate-50 odd:bg-white dark:even:bg-slate-700 dark:odd:bg-slate-800">
                    <td className="px-3 py-2 border">{tx.description || '—'}</td>
                    <td className="px-3 py-2 border">{tx.date}</td>
                    <td className={`px-3 py-2 border font-semibold ${amountClass}`}>{value >= 0 ? `+₹${value}` : `-₹${Math.abs(value)}`}</td>
                    <td className="px-3 py-2 border">{tx.status}</td>
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
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      otherName: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
      description: PropTypes.string,
    }),
  ).isRequired,
};

UserTransactionHistoryTable.defaultProps = {
  selectedUserName: '',
};

export default UserTransactionHistoryTable;
