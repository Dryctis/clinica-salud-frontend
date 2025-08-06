import React, { useState } from 'react';
import GestionPacientes from './GestionPacientes'; // Importamos el componente de Gestión de Pacientes
import GestionCitas from './GestionCitas'; // ¡Nuevo! Importamos el componente de Gestión de Citas
import { Users, Calendar } from 'lucide-react'; // Importamos los iconos de Users y Calendar

// Definimos la interfaz User aquí también para que el componente sepa el tipo de 'user'
interface User {
  id: string;
  email: string;
  role: string;
}

// Definimos las props que este componente espera recibir
interface GestionAdministrativaProps {
  user: User | null; // El usuario puede ser null si App.tsx decide pasarlo así
}

const GestionAdministrativa = ({ user }: GestionAdministrativaProps) => {
  // Estado para controlar qué vista se muestra dentro de Gestión Administrativa
  // 'dashboard' muestra la vista principal con los botones de navegación
  // 'patients' muestra el componente GestionPacientes
  // 'appointments' ¡Nuevo! muestra el componente GestionCitas
  const [currentView, setCurrentView] = useState<'dashboard' | 'patients' | 'appointments'>('dashboard');

  // Función para manejar el regreso al dashboard de administración
  const handleBackToAdminDashboard = () => {
    setCurrentView('dashboard');
  };

  return (
    <div className="container mx-auto px-6 py-20 min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="bg-white p-10 rounded-xl shadow-2xl text-center max-w-4xl w-full">
        {currentView === 'dashboard' ? (
          // Vista del Dashboard Administrativo principal
          <>
            {/* Título de Gestión Administrativa */}
            <h2 className="text-5xl font-extrabold text-indigo-800 mb-4">Gestión Administrativa</h2>
            <p className="text-xl text-gray-700 mb-10">
              {/* Mensaje de bienvenida simple, mostrando el email del usuario si está disponible */}
              ¡Bienvenido, {user ? user.email : 'Administrador'}!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Botón para la gestión de pacientes */}
              <button
                className="flex flex-col items-center justify-center p-6 bg-indigo-600 text-white rounded-xl shadow-lg
                           hover:bg-indigo-700 transform hover:scale-105 transition-all duration-300 ease-in-out
                           focus:outline-none focus:ring-4 focus:ring-indigo-300"
                onClick={() => setCurrentView('patients')} // Cambia la vista a 'patients'
              >
                {/* Icono de Usuarios de lucide-react */}
                <Users size={48} className="mb-3" />
                <span className="text-2xl font-bold">Gestión de Pacientes</span>
                <span className="text-sm mt-1 opacity-90">Administra la información de los pacientes.</span>
              </button>

              {/* ¡Nuevo! Botón para la gestión de citas */}
              <button
                className="flex flex-col items-center justify-center p-6 bg-blue-600 text-white rounded-xl shadow-lg
                           hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 ease-in-out
                           focus:outline-none focus:ring-4 focus:ring-blue-300"
                onClick={() => setCurrentView('appointments')} // Cambia la vista a 'appointments'
              >
                {/* Icono de Calendario de lucide-react */}
                <Calendar size={48} className="mb-3" />
                <span className="text-2xl font-bold">Gestión de Citas</span>
                <span className="text-sm mt-1 opacity-90">Administra y programa las citas.</span>
              </button>
            </div>
            {/* Aquí podrías añadir más botones para otras secciones administrativas */}
          </>
        ) : currentView === 'patients' ? (
          // Vista de Gestión de Pacientes
          // Pasamos la función handleBackToAdminDashboard como prop 'onBack'
          <GestionPacientes onBack={handleBackToAdminDashboard} />
        ) : (
          // ¡Nueva Vista! Gestión de Citas
          // Pasamos la función handleBackToAdminDashboard como prop 'onBack'
          <GestionCitas onBack={handleBackToAdminDashboard} />
        )}
      </div>
    </div>
  );
};

export default GestionAdministrativa;
