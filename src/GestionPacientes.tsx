import { useState, useEffect } from 'react';
import { PlusCircle, Pencil, Trash2, Search, XCircle, ArrowLeft } from 'lucide-react'; // Iconos para acciones
import React from 'react'; // Importar React para JSX
import { useAuth } from './App'; // <--- ¡CORRECCIÓN CLAVE AQUÍ! Importación nombrada con llaves

// Definición de la interfaz para un paciente, basada en tu backend
interface Patient {
  id: string; // El ID que genera Prisma
  primerNombre: string;
  apellido: string;
  fechaNacimiento: string | null; // Puede ser string (ISO date) o null
  genero: string | null;
  telefono: string | null;
  direccion: string | null;
  historialMedico: string | null;
}

// Interfaz para las props del modal de formulario (crear/editar)
interface PatientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (patient: Omit<Patient, 'id'>, id?: string) => void; // Omitir 'id' al crear, opcional al editar
  editingPatient?: Patient | null; // Paciente a editar, si existe
}

// Componente Modal para Crear/Editar Paciente
const PatientFormModal = ({ isOpen, onClose, onSave, editingPatient }: PatientFormModalProps) => {
  const [primerNombre, setPrimerNombre] = useState(editingPatient?.primerNombre || '');
  const [apellido, setApellido] = useState(editingPatient?.apellido || '');
  const [fechaNacimiento, setFechaNacimiento] = useState(
    editingPatient?.fechaNacimiento ? new Date(editingPatient.fechaNacimiento).toISOString().split('T')[0] : ''
  );
  const [genero, setGenero] = useState(editingPatient?.genero || '');
  const [telefono, setTelefono] = useState(editingPatient?.telefono || '');
  const [direccion, setDireccion] = useState(editingPatient?.direccion || '');
  const [historialMedico, setHistorialMedico] = useState(editingPatient?.historialMedico || '');

  // Efecto para resetear el formulario cuando el modal se abre para un nuevo paciente
  // o cuando cambia el paciente a editar
  useEffect(() => {
    if (isOpen) {
      setPrimerNombre(editingPatient?.primerNombre || '');
      setApellido(editingPatient?.apellido || '');
      setFechaNacimiento(
        editingPatient?.fechaNacimiento ? new Date(editingPatient.fechaNacimiento).toISOString().split('T')[0] : ''
      );
      setGenero(editingPatient?.genero || '');
      setTelefono(editingPatient?.telefono || '');
      setDireccion(editingPatient?.direccion || '');
      setHistorialMedico(editingPatient?.historialMedico || '');
    }
  }, [isOpen, editingPatient]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patientData: Omit<Patient, 'id'> = {
      primerNombre,
      apellido,
      fechaNacimiento: fechaNacimiento || null, // Enviar null si está vacío
      genero: genero || null,
      telefono: telefono || null,
      direccion: direccion || null,
      historialMedico: historialMedico || null,
    };
    onSave(patientData, editingPatient?.id);
    // onClose(); // No cerramos aquí, onSave debería manejar el cierre después de la operación exitosa
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl relative animate-fade-in">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <XCircle size={24} />
        </button>
        <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
          {editingPatient ? 'Editar Paciente' : 'Crear Nuevo Paciente'}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Primer Nombre <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={primerNombre}
              onChange={(e) => setPrimerNombre(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Apellido <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Fecha de Nacimiento</label>
            <input
              type="date"
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Género</label>
            <select
              value={genero}
              onChange={(e) => setGenero(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Seleccionar</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Teléfono</label>
            <input
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Dirección</label>
            <input
              type="text"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-2">Historial Médico</label>
            <textarea
              value={historialMedico}
              onChange={(e) => setHistorialMedico(e.target.value)}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
          </div>
          <div className="md:col-span-2 flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-full text-gray-700 font-bold hover:bg-gray-100 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white rounded-full font-bold shadow-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105"
            >
              {editingPatient ? 'Guardar Cambios' : 'Crear Paciente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Nueva interfaz para las props de GestionPacientes
interface GestionPacientesProps {
  onBack: () => void; // Función para volver a la vista anterior (Gestión Administrativa)
}

// Componente principal de Gestión de Pacientes
const GestionPacientes = ({ onBack }: GestionPacientesProps) => { // Acepta la prop onBack
  const { token, user } = useAuth(); // <--- OBTENEMOS EL TOKEN Y EL USUARIO DEL CONTEXTO
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<string | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL; 

  // Función para obtener pacientes
  const fetchPatients = async (searchQuery = '') => {
    setLoading(true);
    setError(null);
    if (!token) { // <--- Verificamos si hay token antes de hacer la solicitud
      setError('No autenticado. Por favor, inicie sesión.');
      setLoading(false);
      return;
    }
    try {
      const url = searchQuery ? `${API_BASE_URL}/pacientes?search=${encodeURIComponent(searchQuery)}` : `${API_BASE_URL}/pacientes`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // <--- AÑADIMOS EL TOKEN AQUÍ
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || `Error al obtener pacientes: ${response.statusText}`);
      }
      const data = await response.json();
      setPatients(data.pacientes);
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido al cargar pacientes.');
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar pacientes al montar el componente o cuando el token cambia
  useEffect(() => {
    fetchPatients();
  }, [token]); // <--- Dependencia en 'token' para recargar si el token cambia

  // Manejador para la búsqueda
  const handleSearch = () => {
    fetchPatients(searchTerm);
  };

  // Función para crear o actualizar un paciente
  const handleSavePatient = async (patientData: Omit<Patient, 'id'>, id?: string) => {
    setLoading(true);
    setError(null);
    if (!token) { // <--- Verificamos si hay token antes de hacer la solicitud
      setError('No autenticado. Por favor, inicie sesión.');
      setLoading(false);
      return;
    }
    try {
      let response;
      const commonHeaders = { // Definimos cabeceras comunes
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // <--- AÑADIMOS EL TOKEN AQUÍ
      };
      if (id) {
        // Actualizar paciente
        response = await fetch(`${API_BASE_URL}/pacientes/${id}`, {
          method: 'PUT',
          headers: commonHeaders, // Usamos las cabeceras comunes
          body: JSON.stringify(patientData),
        });
      } else {
        // Crear paciente
        response = await fetch(`${API_BASE_URL}/pacientes`, {
          method: 'POST',
          headers: commonHeaders, // Usamos las cabeceras comunes
          body: JSON.stringify(patientData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || 'Error al guardar el paciente.');
      }
      // Recargar la lista de pacientes después de guardar
      fetchPatients();
      closeModals(); // Cierra el modal solo después de un guardado exitoso
    } catch (err) {
      console.error('Error saving patient:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido al guardar paciente.');
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar un paciente
  const handleDeletePatient = async (id: string) => {
    setLoading(true);
    setError(null);
    if (!token) { // <--- Verificamos si hay token antes de hacer la solicitud
      setError('No autenticado. Por favor, inicie sesión.');
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/pacientes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`, // <--- AÑADIMOS EL TOKEN AQUÍ
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || 'Error al eliminar el paciente.');
      }
      // Recargar la lista de pacientes después de eliminar
      fetchPatients();
    } catch (err) {
      console.error('Error deleting patient:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido al eliminar paciente.');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false); // Cerrar modal de confirmación
      setPatientToDelete(null); // Limpiar ID del paciente a eliminar
    }
  };

  // Manejadores para abrir/cerrar modales
  const openCreateModal = () => {
    setEditingPatient(null); // Asegurarse de que no estamos editando
    setShowCreateModal(true);
  };

  const openEditModal = (patient: Patient) => {
    setEditingPatient(patient);
    setShowEditModal(true);
  };

  const closeModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setEditingPatient(null);
  };

  const openDeleteConfirm = (patientId: string) => {
    setPatientToDelete(patientId);
    setShowDeleteConfirm(true);
  };

  const closeDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    setPatientToDelete(null);
  };

  // Formatear fecha para mostrar
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      // Formato DD/MM/YYYY
      return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch (e) {
      return 'Fecha inválida';
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl w-full">
      {/* Botón para volver a la Gestión Administrativa */}
      <button
        onClick={onBack}
        className="mb-6 flex items-center text-indigo-600 hover:text-indigo-800 font-semibold transition-colors duration-200"
      >
        <ArrowLeft size={20} className="mr-2" /> Volver a Gestión Administrativa
      </button>

      <h2 className="text-4xl font-extrabold text-indigo-800 mb-6 text-center">Gestión de Pacientes</h2>

      {/* Sección de búsqueda y botón de crear */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Buscar paciente por nombre o apellido..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => { if (e.key === 'Enter') handleSearch(); }}
            className="w-full p-3 pl-10 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <button
          onClick={openCreateModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
        >
          <PlusCircle size={20} className="mr-2" /> Crear Nuevo Paciente
        </button>
      </div>

      {/* Mensajes de estado */}
      {loading && <p className="text-center text-indigo-600 text-lg">Cargando pacientes...</p>}
      {error && <p className="text-center text-red-600 text-lg">Error: {error}</p>}

      {/* Tabla de pacientes */}
      {!loading && !error && patients.length === 0 && (
        <p className="text-center text-gray-600 text-lg mt-8">No hay pacientes registrados. ¡Crea uno!</p>
      )}

      {!loading && !error && patients.length > 0 && (
        <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Completo</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Nac.</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Género</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {patients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900">{patient.primerNombre} {patient.apellido}</td>
                  <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-700">{formatDate(patient.fechaNacimiento)}</td>
                  <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-700">{patient.genero || 'N/A'}</td>
                  <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-700">{patient.telefono || 'N/A'}</td>
                  <td className="py-4 px-6 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openEditModal(patient)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors duration-200"
                      title="Editar Paciente"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => openDeleteConfirm(patient.id)}
                      className="text-red-600 hover:text-red-900 transition-colors duration-200"
                      title="Eliminar Paciente"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de Creación/Edición */}
      {(showCreateModal || showEditModal) && (
        <PatientFormModal
          isOpen={showCreateModal || showEditModal}
          onClose={closeModals}
          onSave={handleSavePatient}
          editingPatient={editingPatient}
        />
      )}

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-sm relative animate-fade-in text-center">
            <h3 className="text-xl font-bold text-red-700 mb-4">Confirmar Eliminación</h3>
            <p className="text-gray-700 mb-6">¿Estás seguro de que quieres eliminar este paciente? Esta acción no se puede deshacer.</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={closeDeleteConfirm}
                className="px-6 py-3 border border-gray-300 rounded-full text-gray-700 font-bold hover:bg-gray-100 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={() => patientToDelete && handleDeletePatient(patientToDelete)}
                className="px-6 py-3 bg-red-600 text-white rounded-full font-bold shadow-lg hover:bg-red-700 transition-all duration-300"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionPacientes;
