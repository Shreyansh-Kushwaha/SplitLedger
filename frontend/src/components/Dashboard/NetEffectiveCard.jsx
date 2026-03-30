import PropTypes from 'prop-types';

const NetEffectiveCard = ({ netAmounts, onSettleClick }) => {
  return (
    <div className="bg-(--app-surface) rounded-xl p-4 shadow-sm border border-(--app-border)">
      <h2 className="font-semibold text-lg mb-3 text-(--app-text)">Net Effective (Pending)</h2>
      <div className="space-y-2">
        {netAmounts.length === 0 ? (
          <p className="text-sm text-(--app-text-2)">All settled up! 🎉</p>
        ) : (
          netAmounts.map((person, index) => (
            <div key={index} className="flex justify-between items-center p-2 border border-(--app-border-2) rounded bg-(--app-surface-2)">
              <span className="font-medium text-(--app-text)">{person.name}</span>
              <div className="flex items-center space-x-2">
                <span className={`font-bold text-sm ${person.net > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {person.net > 0 ? `You get ₹${person.net}` : `You owe ₹${Math.abs(person.net)}`}
                </span>
                <button
                  onClick={() => onSettleClick(person)}
                  className="text-xs py-1 px-2 rounded bg-(--app-accent) text-white hover:bg-(--app-accent-hover) transition-colors"
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
