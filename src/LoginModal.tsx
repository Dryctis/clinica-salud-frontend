import { useState } from 'react';
import useAuth from './context/AuthContext'; // Asegúrate de exportarlo desde un archivo separado

interface LoginModalProps {
  show: boolean;
  onClose: () => void;
}

const LoginModal = ({ show, onClose }: LoginModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const { login, loading } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    const result = await login(email, password);
    if (result.success) {
      onClose();
    } else {
      setLocalError(result.message);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center z-[100]">
      <div className="bg-white/50 p-8 rounded-xl shadow-2xl w-full max-w-md relative animate-fade-in">
        <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">Área Administrativa</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              required
            />
          </div>
          {localError && <p className="text-red-600 text-sm text-center">{localError}</p>}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 disabled:bg-indigo-400"
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full border border-indigo-600 text-indigo-600 font-bold py-3 rounded-full hover:bg-indigo-50 transition-colors duration-300 mt-2"
          >
            Regresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
