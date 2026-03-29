import PropTypes from 'prop-types';

const NetEffectiveCard = ({ netAmounts, onSettleClick }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md dark:shadow-lg border border-slate-200 dark:border-slate-700">
      <h2 className="font-semibold text-lg mb-3 text-slate-900 dark:text-white">Net Effective (Pending)</h2>
      <div className="space-y-2">
        {netAmounts.length === 0 ? (
          <p className="text-sm text-slate-600 dark:text-slate-400">All settled up! 🎉</p>
        ) : (
          netAmounts.map((person, index) => (
            <div key={index} className="flex justify-between items-center p-2 border border-slate-300 dark:border-slate-600 rounded bg-slate-50 dark:bg-slate-700">
              <span className="font-medium text-slate-900 dark:text-white">{person.name}</span>
              <div className="flex items-center space-x-2">
                <span className={`font-bold text-sm ${person.net > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {person.net > 0 ? `You get ₹${person.net}` : `You owe ₹${Math.abs(person.net)}`}
                </span>
                <button
                  onClick={() => onSettleClick(person)}
                  className="text-xs py-1 px-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Settle
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

NetEffectiveCard.propTypes = {
  netAmounts: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    userId: PropTypes.string,
    net: PropTypes.number,
  })),
  onSettleClick: PropTypes.func.isRequired,
};

export default NetEffectiveCard;