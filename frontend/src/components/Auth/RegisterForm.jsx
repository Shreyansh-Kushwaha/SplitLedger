import { useState } from 'react';
import PropTypes from 'prop-types';
import { GoogleLogin } from '@react-oauth/google';

const RegisterForm = ({ onRegister, onSwitchToLogin, loading, error, onGoogleLogin, googleReady }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    try {
      await onRegister({ name, email, password });
    } catch (err) {
      // Error handled by parent
    }
  };

  return (
    <div className="bg-(--app-surface) rounded-2xl p-7 shadow-lg border border-(--app-border)">
      <h2 className="text-2xl font-bold mb-1 text-(--app-text)">Create account</h2>
      <p className="text-sm text-(--app-text-3) mb-5">Start tracking your expenses</p>
      {error && (
        <p className="text-sm text-rose-600 mb-3 bg-rose-50 dark:bg-rose-900/20 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
          className="w-full border border-(--app-border-2) rounded-lg px-3.5 py-2.5 bg-(--app-surface-2) text-(--app-text) placeholder:text-(--app-text-3) focus:outline-none focus:ring-2 focus:ring-(--app-ring) focus:border-transparent"
          required
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          type="email"
          className="w-full border border-(--app-border-2) rounded-lg px-3.5 py-2.5 bg-(--app-surface-2) text-(--app-text) placeholder:text-(--app-text-3) focus:outline-none focus:ring-2 focus:ring-(--app-ring) focus:border-transparent"
          required
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          className="w-full border border-(--app-border-2) rounded-lg px-3.5 py-2.5 bg-(--app-surface-2) text-(--app-text) placeholder:text-(--app-text-3) focus:outline-none focus:ring-2 focus:ring-(--app-ring) focus:border-transparent"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-(--app-accent) text-white py-2.5 rounded-lg font-medium hover:bg-(--app-accent-hover) transition-colors disabled:opacity-50 mt-1"
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      {googleReady && (
        <>
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-(--app-border-2)" />
            <span className="text-xs text-(--app-text-3)">or</span>
            <div className="flex-1 h-px bg-(--app-border-2)" />
          </div>
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={onGoogleLogin}
              onError={() => {}}
              theme="outline"
              size="large"
              width="360"
              text="signup_with"
              shape="rectangular"
            />
          </div>
        </>
      )}

      <p className="mt-4 text-sm text-(--app-text-3) text-center">
        Already have an account?{' '}
        <button onClick={onSwitchToLogin} className="text-(--app-accent) font-medium hover:underline">
          Sign in
        </button>
      </p>
    </div>
  );
};

RegisterForm.propTypes = {
  onRegister: PropTypes.func.isRequired,
  onSwitchToLogin: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  onGoogleLogin: PropTypes.func,
  googleReady: PropTypes.bool,
};

export default RegisterForm;
