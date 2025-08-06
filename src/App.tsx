import { useState, useRef, useEffect, createContext, useContext } from 'react';
import { Facebook, MapPin, MessageCircle, Stethoscope, Heart, Shield, Plus, X, LogOut, Settings, Brain, Bone, Syringe, ClipboardList } from 'lucide-react'; // Importar Stethoscope y otros iconos
import type { ReactNode } from 'react';
import clinicaModerna from './clinicaModerna.webp';
import equipoMedico from './equipoMedico.webp';
import GestionAdministrativa from './gestionAdministrativa'; // Asegúrate de que esta ruta sea correcta
import ServiciosView from './ServiciosView';
import ContactoView from './ContactoView'; // Asegúrate de que esta ruta sea correcta si moviste ContactoView

// =================================================================================================
// AuthContext: Contexto para gestionar la autenticación
// =================================================================================================
interface User {
  id: string;
  email: string;
  role: string;
}

interface LoginResult {
  success: boolean;
  message: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<LoginResult> => {
    setLoading(true);
    setError(null);

    try {
      
      const API_BASE_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
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

      const data = await response.json();
      console.log('Login exitoso:', data);

      const userData: User = {
        id: data.id || '1',
        email: data.email || email,
        role: data.role || 'admin',
      };

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      setToken(data.token);

      return { success: true, message: 'Inicio de sesión exitoso' };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error de conexión';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

// =================================================================================================
// SettingsMenu: Menú de ajustes para usuarios autenticados
// =================================================================================================
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
              <span className="block text-sm font-semibold text-gray-800">
                {user.email}
              </span>
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

// =================================================================================================
// LoginModal: Modal para el inicio de sesión
// =================================================================================================
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

// Componente para una pregunta frecuente individual
interface FAQItemProps {
  question: string;
  answer: string;
  delay?: number; // Prop para el retraso de animación
}

const FAQItem = ({ question, answer, delay = 0 }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className={`bg-white rounded-lg shadow-md border border-blue-100 overflow-hidden animate-fade-in-up`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <button
        className="w-full text-left p-6 flex justify-between items-center text-blue-700 font-semibold text-lg hover:bg-blue-50 transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        {question}
        <span className="text-blue-500 text-2xl">{isOpen ? '-' : '+'}</span>
      </button>
      {isOpen && (
        <div className="p-6 pt-0 text-gray-700 leading-relaxed animate-fade-in">
          {answer}
        </div>
      )}
    </div>
  );
};


// =================================================================================================
// AppContent: Componente principal de la aplicación
// =================================================================================================
const AppContent = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [view, setView] = useState('home'); // Estado para controlar la vista actual
  const { user, loading } = useAuth();
  const isAuthenticated = !!user;

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleAdminClick = () => {
    setView('admin');
    setIsMobileMenuOpen(false);
  };
  
  // Función para manejar la navegación a cualquier vista
  const handleNavigate = (targetView: string) => {
    setView(targetView);
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-xl text-gray-600">Cargando...</p>
        </div>
      );
    }

    switch (view) {
      case 'admin':
        if (isAuthenticated && user?.role === 'admin') {
          return <GestionAdministrativa user={user} />;
        } else {
          return (
            <div className="flex items-center justify-center min-h-screen">
              <p className="text-xl text-red-600">Acceso denegado. Solo administradores pueden ver esta página.</p>
            </div>
          );
        }
      case 'services':
        return <ServiciosView />;
      case 'contact':
        return <ContactoView />;
      case 'home': // Vista por defecto
      default:
        return (
          <>
            {/* Sección principal (Hero) */}
            <main className="container mx-auto px-6 py-24 flex-grow bg-gradient-to-br from-blue-50 to-gray-100 rounded-xl shadow-lg mt-8 mb-20 animate-fade-in-up" id="inicio">
              <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="md:w-1/2 text-center md:text-left">
                  <h2 className="text-4xl md:text-6xl font-extrabold text-blue-800 leading-tight mb-6 animate-slide-in-left">
                    Tu salud es nuestra prioridad
                  </h2>
                  <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-lg mx-auto md:mx-0 animate-slide-in-left animation-delay-200">
                    Ofrecemos atención médica de alta calidad con un equipo de profesionales dedicados a tu bienestar.
                  </p>
                  <button 
                    onClick={() => handleNavigate('contact')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out animate-fade-in-up animation-delay-400"
                  >
                    Reservar una cita
                  </button>
                </div>
                <div className="md:w-1/2 animate-fade-in-right animation-delay-600">
                  <img 
                    src={clinicaModerna}
                    alt="Clínica moderna con equipo médico"
                    className="w-full h-auto rounded-xl shadow-xl"
                    onError={(e) => { e.currentTarget.src = "https://placehold.co/600x400/DDE3FF/2F46A9?text=Clínica+Moderna"; }}
                  />
                </div>
              </div>
            </main>

            {/* Sección "Nuestras Especialidades" (3ra sección) */}
            <section className="bg-gradient-to-br from-blue-50 to-gray-100 py-24 mb-20 rounded-xl shadow-lg animate-fade-in-up animation-delay-900">
              <div className="container mx-auto px-6 text-center">
                <h3 className="text-4xl font-extrabold text-blue-800 mb-12 animate-slide-in-up">Nuestras Especialidades</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Card Neurocirujano */}
                  <div className="bg-white p-8 rounded-xl shadow-md border border-blue-100 transform hover:scale-105 transition-all duration-300 animate-fade-in-up animation-delay-1000">
                    <Brain size={64} className="text-blue-600 mx-auto mb-4" />
                    <h4 className="text-2xl font-bold text-blue-700 mb-2">Neurocirugía</h4>
                    <p className="text-gray-700">Expertos en el diagnóstico y tratamiento quirúrgico de enfermedades del cerebro, columna vertebral y sistema nervioso.</p>
                  </div>
                  {/* Card Cardiólogo */}
                  <div className="bg-white p-8 rounded-xl shadow-md border border-blue-100 transform hover:scale-105 transition-all duration-300 animate-fade-in-up animation-delay-1100">
                    <Heart size={64} className="text-red-600 mx-auto mb-4" />
                    <h4 className="text-2xl font-bold text-blue-700 mb-2">Cardiología</h4>
                    <p className="text-gray-700">Cuidado integral del corazón, prevención, diagnóstico y tratamiento de afecciones cardiovasculares.</p>
                  </div>
                  {/* Card Médico General */}
                  <div className="bg-white p-8 rounded-xl shadow-md border border-blue-100 transform hover:scale-105 transition-all duration-300 animate-fade-in-up animation-delay-1200">
                    <Stethoscope size={64} className="text-green-600 mx-auto mb-4" />
                    <h4 className="text-2xl font-bold text-blue-700 mb-2">Medicina General</h4>
                    <p className="text-gray-700">Atención primaria de salud, diagnósticos, tratamientos y seguimiento para toda la familia.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Sección "Sobre Nosotros" */}
            <section className="bg-white py-24 rounded-xl shadow-lg mb-20 animate-fade-in-up animation-delay-1300">
              <div className="container mx-auto px-6 text-center">
                <h3 className="text-4xl font-extrabold text-blue-800 mb-4 animate-slide-in-up">Sobre Nosotros</h3>
                <p className="text-lg text-gray-700 mb-12 max-w-2xl mx-auto animate-slide-in-up animation-delay-100">
                  Fundada en 2010, nuestra clínica ha crecido para convertirse en un referente de salud en la comunidad, 
                  comprometidos con la excelencia y el trato humano.
                </p>
                <img 
                  src={equipoMedico}
                  alt="Equipo médico de la clínica"
                  className="mx-auto rounded-xl shadow-xl w-full max-w-4xl h-auto animate-fade-in-up animation-delay-200"
                  onError={(e) => { e.currentTarget.src = "https://placehold.co/800x400/DDE3FF/2F46A9?text=Equipo+Médico"; }}
                />
              </div>
            </section>

            {/* Sección de Preguntas Frecuentes (FAQ) */}
            <section className="container mx-auto px-6 py-24 mb-20 bg-gradient-to-br from-blue-50 to-gray-100 rounded-xl shadow-lg animate-fade-in-up animation-delay-1400">
              <div className="text-center mb-12">
                <h3 className="text-4xl font-extrabold text-blue-800 mb-4 animate-slide-in-up">Preguntas Frecuentes</h3>
                <p className="text-lg text-gray-700 max-w-2xl mx-auto animate-slide-in-up animation-delay-100">
                  Encuentra respuestas a las dudas más comunes sobre nuestros servicios y procedimientos.
                </p>
              </div>
              <div className="max-w-3xl mx-auto space-y-4">
                <FAQItem 
                  question="¿Cómo puedo agendar una cita?" 
                  answer="Puedes agendar una cita llamándonos directamente a nuestro número de teléfono, o utilizando el formulario de contacto en nuestra sección de 'Contacto' y nos pondremos en contacto contigo."
                  delay={1500}
                />
                <FAQItem 
                  question="¿Aceptan seguros médicos?" 
                  answer="Sí, trabajamos con una amplia variedad de seguros médicos. Te recomendamos contactarnos o revisar nuestra sección de 'Servicios' para confirmar si tu seguro es compatible."
                  delay={1600}
                />
                <FAQItem 
                  question="¿Cuáles son sus horarios de atención?" 
                  answer="Nuestros horarios de atención son de Lunes a Viernes de 8:00 AM a 6:00 PM, y Sábados de 9:00 AM a 1:00 PM. Los Domingos estamos cerrados."
                  delay={1700}
                />
                <FAQItem 
                  question="¿Qué debo llevar a mi primera consulta?" 
                  answer="Para tu primera consulta, te pedimos que traigas tu identificación oficial, tu tarjeta de seguro (si aplica) y cualquier historial médico relevante o resultados de exámenes previos."
                  delay={1800}
                />
              </div>
            </section>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans antialiased flex flex-col">
      <style>
        {`
        @keyframes slide-in {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
        }
        @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .animate-slide-in {
            animation: slide-in 0.3s ease-out forwards;
        }
        .animate-fade-in {
            animation: fade-in 0.2s ease-out forwards;
        }

        /* Nuevas animaciones para la página principal */
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInFromBottom {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-slide-in-left { animation: slideInLeft 0.7s ease-out forwards; }
        .animate-fade-in-right { animation: slideInRight 0.7s ease-out forwards; }
        .animate-slide-in-up { animation: slideInUp 0.7s ease-out forwards; }
        .animate-fade-in-up { animation: fadeInFromBottom 0.8s ease-out forwards; }

        /* Clases para retrasos de animación */
        .animation-delay-100 { animation-delay: 0.1s; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-500 { animation-delay: 0.5s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        .animation-delay-700 { animation-delay: 0.7s; }
        .animation-delay-800 { animation-delay: 0.8s; }
        .animation-delay-900 { animation-delay: 0.9s; }
        .animation-delay-1000 { animation-delay: 1.0s; }
        .animation-delay-1100 { animation-delay: 1.1s; }
        .animation-delay-1200 { animation-delay: 1.2s; }
        .animation-delay-1300 { animation-delay: 1.3s; }
        .animation-delay-1400 { animation-delay: 1.4s; }
        .animation-delay-1500 { animation-delay: 1.5s; }
        .animation-delay-1600 { animation-delay: 1.6s; }
        .animation-delay-1700 { animation-delay: 1.7s; }
        .animation-delay-1800 { animation-delay: 1.8s; }
        `}
      </style>

      {/* Sección de encabezado */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Nombre de la clínica con icono */}
          <h1 className="text-2xl md:text-3xl font-bold text-indigo-700 flex items-center">
            <Stethoscope size={32} className="text-blue-600 mr-2" /> {/* Icono de estetoscopio */}
            Clínica Vida y Salud
          </h1>
          
          {/* Navegación de escritorio */}
          <nav className="hidden md:flex gap-2"> {/* Reducido el gap para que los botones tengan espacio para el padding */}
            <button onClick={() => handleNavigate('home')} className="text-lg text-gray-700 hover:text-blue-700 hover:bg-blue-100 px-3 py-2 rounded-md transition-all duration-300">Inicio</button>
            <button onClick={() => handleNavigate('services')} className="text-lg text-gray-700 hover:text-blue-700 hover:bg-blue-100 px-3 py-2 rounded-md transition-all duration-300">Servicios</button>
            <button onClick={() => handleNavigate('contact')} className="text-lg text-gray-700 hover:text-blue-700 hover:bg-blue-100 px-3 py-2 rounded-md transition-all duration-300">Contacto</button>
          </nav>

          {/* Condicional para mostrar el menú de ajustes */}
          <div className="hidden md:flex items-center">
            {isAuthenticated && <SettingsMenu onAdminClick={handleAdminClick} />}
          </div>

          {/* Botón del menú móvil */}
          <div className="flex items-center md:hidden gap-4">
            {isAuthenticated && <SettingsMenu onAdminClick={handleAdminClick} />}
            <button onClick={toggleMobileMenu} className="text-gray-700 text-3xl">
              {isMobileMenuOpen ? <X size={32} /> : <span>☰</span>}
            </button>
          </div>
        </div>
        
        {/* Menú móvil deslizante */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-0 left-0 w-full h-full bg-white z-40 flex flex-col items-center justify-center space-y-8 animate-slide-in">
            <button onClick={toggleMobileMenu} className="absolute top-6 right-6 text-gray-700">
              <X size={32} />
            </button>
            {/* Botones de navegación móvil con hover */}
            <button onClick={() => handleNavigate('home')} className="text-2xl text-gray-700 hover:text-blue-700 hover:bg-blue-100 px-4 py-3 rounded-md transition-all duration-300 w-full text-center">Inicio</button>
            <button onClick={() => handleNavigate('services')} className="text-2xl text-gray-700 hover:text-blue-700 hover:bg-blue-100 px-4 py-3 rounded-md transition-all duration-300 w-full text-center">Servicios</button>
            <button onClick={() => handleNavigate('contact')} className="text-2xl text-gray-700 hover:text-blue-700 hover:bg-blue-100 px-4 py-3 rounded-md transition-all duration-300 w-full text-center">Contacto</button>
          </div>
        )}
      </header>

      {renderContent()}

      {/* Pie de página */}
      <footer className="bg-white text-center text-sm text-gray-600 py-6 mt-10 shadow-inner">
        <div className="container mx-auto px-6">
          <p className="mb-2">
            © {new Date().getFullYear()} Clínica Vida y Salud. Todos los derechos reservados.
          </p>
          <div className="flex justify-center gap-4 text-gray-500">
            <button onClick={() => { /* Lógica para Política de Privacidad */ }} className="hover:text-indigo-600">Política de Privacidad</button>
            <span className="text-gray-400">|</span>
            <button onClick={() => { /* Lógica para Términos y Condiciones */ }} className="hover:text-indigo-600">Términos y Condiciones</button>
            {!isAuthenticated && (
              <>
                <span className="text-gray-400">|</span>
                <button onClick={handleLoginClick} className="hover:text-indigo-600 text-gray-500 transition-colors duration-300">
                  Acceder
                </button>
              </>
            )}
          </div>
        </div>
      </footer>
      
      {/* Botones flotantes en la esquina inferior derecha */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-4 z-50">
        <a 
          href="https://wa.me/numerodetelefono" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-green-500 text-white p-4 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-xl"
        >
          <MessageCircle size={24} />
        </a>
        <a 
          href="https://facebook.com/pagina" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-xl"
        >
          <Facebook size={24} />
        </a>
        <a 
          href="https://maps.google.com/?q=direccion" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-gray-800 text-white p-4 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-xl"
        >
          <MapPin size={24} />
        </a>
      </div>
      
      <LoginModal 
        show={showLoginModal} 
        onClose={handleCloseModal}
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
