import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { authError, login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError((err as Error).message || 'Failed to log in');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError((err as Error).message || 'Failed to log in with Google');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 to-gold-500 px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-slide-in">
        <h1 className="text-4xl font-bold text-center text-gradient mb-2">📚 Study Manager</h1>
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Login</h2>
        
        {authError && <div className="error-message mb-6">{authError}</div>}
        {error && <div className="error-message mb-6">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-5 mb-6">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={loading}
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
              className="input-field"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="divider">OR</div>

        <button
          onClick={handleGoogleLogin}
          className="btn bg-gray-100 text-gray-900 btn-lg w-full border-2 border-gray-300 hover:border-primary-600 hover:shadow-lg"
          disabled={loading}
        >
          🔍 Sign in with Google
        </button>

        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary-600 font-bold hover:text-primary-700">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
