import PropTypes from 'prop-types';

const TotalsCard = ({ totalLent, totalBorrowed }) => {
  return (
    <div className="bg-(--app-surface) rounded-xl p-4 shadow-sm border border-(--app-border)">
      <h2 className="font-semibold text-lg mb-3 text-(--app-text)">Totals</h2>
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 rounded border border-emerald-200 dark:border-emerald-800">
          <p className="text-sm text-emerald-800 dark:text-emerald-200">Total You Lent</p>
          <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">₹{totalLent ?? 0}</p>
        </div>
        <div className="p-3 bg-rose-100 dark:bg-rose-900/40 rounded border border-rose-200 dark:border-rose-800">
          <p className="text-sm text-rose-800 dark:text-rose-200">Total You Borrowed</p>
          <p className="text-xl font-bold text-rose-700 dark:text-rose-300">₹{totalBorrowed ?? 0}</p>
        </div>
      </div>
    </div>
  );
};

TotalsCard.propTypes = {
  totalLent: PropTypes.number,
  totalBorrowed: PropTypes.number,
};

export default TotalsCard;
