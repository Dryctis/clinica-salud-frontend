import { useState, useEffect, useRef } from 'react';
import useAuth from './context/AuthContext';
import { LogOut, Settings, Shield } from 'lucide-react';

interface SettingsMenuProps {
  onAdminClick: () => void;
}

const SettingsMenu = ({ onAdminClick }: SettingsMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, user } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
        aria-expanded={isOpen}
      >
        <Settings size={24} className="text-gray-600" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50 animate-fade-in">
          {user && (
            <div className="px-4 py-2 border-b border-gray-200">
              <span className="block text-sm font-semibold text-gray-800">{user.email}</span>
              <span className="block text-xs text-gray-500">
                {user.role === 'admin' ? 'Administrador' : 'Usuario'}
              </span>
            </div>
          )}

          <button
            onClick={() => {
              onAdminClick();
              setIsOpen(false);
            }}
            className="w-full text-left flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
          >
            <Shield size={18} className="mr-2 text-indigo-500" />
            Área Administrativa
          </button>

          <button
            onClick={handleLogout}
            className="w-full text-left flex items-center px-4 py-2 text-red-600 hover:bg-gray-100 transition-colors duration-200"
          >
            <LogOut size={18} className="mr-2" />
            Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default SettingsMenu;
