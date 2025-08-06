import { useState } from 'react';

// Se puede definir un tipo de usuario más detallado según la respuesta de tu API
interface User {
  id: string;
  email: string;
  role: string;
}

// Interfaz para la respuesta del login
interface LoginResponse {
  mensaje: string;
  token: string;
}

// Tipo para el estado de autenticación
interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      // CORRECCIÓN: La URL se ha actualizado a '/api/auth/login' para coincidir con el backend
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || 'Credenciales inválidas');
      }

      const data: LoginResponse = await response.json();
      console.log('Login exitoso:', data);

      // Aquí deberías decodificar el token para obtener la información del usuario
      // o tu API podría devolver el usuario directamente.
      // Por ahora, usamos un objeto de usuario de ejemplo.
      const fakeUser: User = { id: '1', email, role: 'admin' };
      
      setUser(fakeUser);
      setToken(data.token);
      
      // En una aplicación real, guardarías el token en localStorage o cookies
      // para mantener la sesión.
      localStorage.setItem('token', data.token);

      return { success: true, message: 'Inicio de sesión exitoso' };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión');
      return { success: false, message: error || 'Error al iniciar sesión' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return {
    user,
    token,
    loading,
    error,
    login,
    logout,
  };
};

export default useAuth;
