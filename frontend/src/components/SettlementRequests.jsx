import PropTypes from 'prop-types';

const SettlementRequestItem = ({ request, currentUserEmail, onConfirm, onReject }) => {
  const isIncoming = request.toUser.email === currentUserEmail;

  return (
    <article className="border border-(--app-border-2) rounded-xl p-3 bg-(--app-surface-2)">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-(--app-text-2)">
            {isIncoming
              ? `${request.fromUser.name} wants to settle ₹${request.amount} with you`
              : `You requested to settle ₹${request.amount} with ${request.toUser.name}`
            }
          </p>
        </div>
        <span className={`px-2 py-1 text-xs rounded font-medium ${
          request.status === 'pending'
            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200'
            : request.status === 'confirmed'
            ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-200'
            : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200'
        }`}>
          {request.status}
        </span>
      </div>
      <p className="text-xs text-(--app-text-3) mt-1">
        {new Date(request.createdAt).toLocaleDateString()}
      </p>
      {request.status === 'pending' && isIncoming && (
        <div className="mt-2 space-x-2">
          <button
            onClick={() => onConfirm(request._id)}
            className="text-xs py-1 px-2 rounded bg-green-600 text-white hover:bg-green-700"
          >
            Confirm
          </button>
          <button
            onClick={() => onReject(request._id)}
            className="text-xs py-1 px-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Reject
          </button>
        </div>
      )}
    </article>
  );
};

SettlementRequestItem.propTypes = {
  request: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    fromUser: PropTypes.shape({ name: PropTypes.string, email: PropTypes.string }),
    toUser: PropTypes.shape({ name: PropTypes.string, email: PropTypes.string }),
    amount: PropTypes.number,
    status: PropTypes.string,
    createdAt: PropTypes.string,
  }).isRequired,
  currentUserEmail: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
};

const SettlementRequests = ({ requests, currentUserEmail, onConfirm, onReject, onRefresh, loading }) => {
  return (
    <section className="bg-(--app-surface) rounded-xl p-4 shadow-sm border border-(--app-border)">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-lg text-(--app-text)">Settlement Requests</h2>
        <button className="text-sm text-(--app-accent) hover:underline" onClick={onRefresh}>
          Refresh
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-(--app-text-2)">Loading...</p>
      ) : (
        <div className="space-y-2">
          {requests.length === 0 ? (
            <p className="text-sm text-(--app-text-3)">No settlement requests.</p>
          ) : (
            requests.map((req) => (
              <SettlementRequestItem
                key={req._id}
                request={req}
                currentUserEmail={currentUserEmail}
                onConfirm={onConfirm}
                onReject={onReject}
              />
            ))
          )}
        </div>
      )}
    </section>
  );
};

SettlementRequests.propTypes = {
  requests: PropTypes.array.isRequired,
  currentUserEmail: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default SettlementRequests;
