import { useState } from 'react';
import PropTypes from 'prop-types';

const RegisterForm = ({ onRegister, onSwitchToLogin, loading, error }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      return;
    }
    try {
      await onRegister({ name, email, password });
    } catch (err) {
      // Error handled by parent
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md dark:shadow-lg border border-slate-200 dark:border-slate-700">
      <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Register</h2>
      {error && <p className="text-sm text-rose-600 dark:text-rose-400 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="w-full border rounded px-3 py-2 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
          required
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          className="w-full border rounded px-3 py-2 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
          required
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          className="w-full border rounded px-3 py-2 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>

      <button
        onClick={onSwitchToLogin}
        className="mt-3 text-sm text-indigo-500 hover:underline"
      >
        Already have account? Login
      </button>
    </div>
  );
};

RegisterForm.propTypes = {
  onRegister: PropTypes.func.isRequired,
  onSwitchToLogin: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
};

export default RegisterForm;