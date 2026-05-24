import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';

export function Navigation() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  }

  if (!currentUser) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-primary-600 to-gold-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📚</span>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-white font-bold text-xl hover:text-gold-100 transition-colors"
            >
              Study Manager
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-white text-sm">
              <span className="hidden sm:inline">Welcome, </span>
              <span className="font-semibold truncate">
                {currentUser.email?.split('@')[0] || 'User'}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="btn bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
