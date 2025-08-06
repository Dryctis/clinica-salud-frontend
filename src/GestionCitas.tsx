import React, { useState, useEffect, useMemo } from 'react';
import { PlusCircle, Pencil, Trash2, Search, XCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from './App';

// <--- ¡CAMBIOS CLAVE EN LAS IMPORTACIONES AQUÍ!
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import type { Event as BigCalendarEvent } from 'react-big-calendar'; // Importación de tipo explícita
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import { addMinutes } from 'date-fns/addMinutes'; // <-- Nueva importación para calcular la duración
import { es } from 'date-fns/locale/es';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

// Definición de interfaces basadas en tu backend
interface Patient {
  id: string;
  primerNombre: string;
  apellido: string;
  deletedAt?: string | null;
}

interface Service {
  id: string;
  name: string;
  duration: number; // Duración en minutos
}

interface Appointment {
  id: string;
  patientId: string;
  serviceId: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  patient: Patient;
  service: Service;
}

// Configuración del localizador para react-big-calendar
const locales = {
  es: es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Creamos el componente Calendar con Drag and Drop, especificando el tipo genérico
const DragAndDropCalendar = withDragAndDrop(Calendar<BigCalendarEvent>);

// Interfaz para las props del modal de formulario de citas
interface AppointmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    patientId: string,
    serviceId: string,
    startTime: string,
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed',
    appointmentId?: string
  ) => void;
  editingAppointment?: Appointment | null;
  patients: Patient[];
  services: Service[];
  initialStartTime?: string;
}

// Componente Modal para Crear/Editar Cita
const AppointmentFormModal = ({ isOpen, onClose, onSave, editingAppointment, patients, services, initialStartTime }: AppointmentFormModalProps) => {
  const [patientId, setPatientId] = useState(editingAppointment?.patientId || '');
  const [serviceId, setServiceId] = useState(editingAppointment?.serviceId || '');
  const [startTime, setStartTime] = useState(
    editingAppointment?.startTime ? new Date(editingAppointment.startTime).toISOString().slice(0, 16) : ''
  );
  const [status, setStatus] = useState(editingAppointment?.status || 'pending');
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>(patients);

  useEffect(() => {
    if (isOpen) {
      setPatientId(editingAppointment?.patientId || '');
      setServiceId(editingAppointment?.serviceId || '');
      setStartTime(
        editingAppointment?.startTime
          ? new Date(editingAppointment.startTime).toISOString().slice(0, 16)
          : initialStartTime || ''
      );
      setStatus(editingAppointment?.status || 'pending');
      setPatientSearchTerm('');
      setFilteredPatients(patients);
    }
  }, [isOpen, editingAppointment, patients, initialStartTime]);

  useEffect(() => {
    setFilteredPatients(
      patients.filter(p =>
        p.primerNombre.toLowerCase().includes(patientSearchTerm.toLowerCase()) ||
        p.apellido.toLowerCase().includes(patientSearchTerm.toLowerCase())
      )
    );
  }, [patientSearchTerm, patients]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(
      patientId,
      serviceId,
      startTime,
      status as 'pending' | 'confirmed' | 'cancelled' | 'completed',
      editingAppointment?.id
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl relative animate-fade-in">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <XCircle size={24} />
        </button>
        <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
          {editingAppointment ? 'Editar Cita' : 'Crear Nueva Cita'}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Buscar Paciente</label>
            <input
              type="text"
              placeholder="Escribe para buscar paciente..."
              value={patientSearchTerm}
              onChange={(e) => setPatientSearchTerm(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mt-2"
              required
            >
              <option value="">Seleccionar Paciente</option>
              {filteredPatients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.primerNombre} {p.apellido}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Servicio <span className="text-red-500">*</span></label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Seleccionar Servicio</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.duration} min)
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Fecha y Hora de Inicio <span className="text-red-500">*</span></label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Estado</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'pending' | 'confirmed' | 'cancelled' | 'completed')}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="pending">Pendiente</option>
              <option value="confirmed">Confirmada</option>
              <option value="cancelled">Cancelada</option>
              <option value="completed">Completada</option>
            </select>
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
              {editingAppointment ? 'Guardar Cambios' : 'Crear Cita'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Interfaz para las props de GestionCitas
interface GestionCitasProps {
  onBack: () => void;
}

const GestionCitas = ({ onBack }: GestionCitasProps) => {
  const { token, logout } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(null);
  const [initialCreateTime, setInitialCreateTime] = useState<string | undefined>(undefined);

  // <-- CAMBIO CLAVE: Se ajusta la URL base para incluir el prefijo /api -->
  const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

  // Función para manejar errores de autenticación y cerrar sesión
  const handleAuthError = (err: any) => {
    console.error('Error de autenticación detectado:', err);
    setError('Tu sesión ha expirado o no estás autorizado. Por favor, inicia sesión de nuevo.');
    logout();
  };

  // Función para obtener citas
  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    if (!token) {
      setError('No autenticado. Por favor, inicie sesión.');
      setLoading(false);
      return;
    }
    try {
      // <-- CAMBIO CLAVE: Se usa la ruta correcta con el prefijo /api -->
      const response = await fetch(`${API_BASE_URL}/citas`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401 || response.status === 500) {
        handleAuthError(response);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || `Error al obtener citas: ${response.statusText}`);
      }
      const data = await response.json();
      if (data.citas) {
        const fullAppointments = data.citas.map((appt: Appointment) => {
          const patient = patients.find(p => p.id === appt.patientId);
          const service = services.find(s => s.id === appt.serviceId);
          return {
            ...appt,
            patient: patient || { id: appt.patientId, primerNombre: 'Desconocido', apellido: '' },
            service: service || { id: appt.serviceId, name: 'Desconocido', duration: 30 },
          };
        });
        setAppointments(fullAppointments);
      } else {
        setAppointments([]);
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido al cargar citas.');
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener pacientes (para el selector en el modal)
  const fetchPatientsForModal = async () => {
    if (!token) return;
    try {
      // <-- CAMBIO CLAVE: Se usa la ruta correcta con el prefijo /api -->
      const response = await fetch(`${API_BASE_URL}/pacientes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401 || response.status === 500) {
        handleAuthError(response);
        return;
      }

      if (!response.ok) throw new Error('Error al cargar pacientes para el modal.');
      const data = await response.json();
      setPatients(data.pacientes.filter((p: Patient) => !('deletedAt' in p) || p.deletedAt === null));
    } catch (err) {
      console.error('Error fetching patients for modal:', err);
    }
  };

  // Función para obtener servicios (para el selector en el modal)
  const fetchServicesForModal = async () => {
    if (!token) return;
    try {
      // <-- CAMBIO CLAVE: Se usa la ruta correcta con el prefijo /api -->
      const response = await fetch(`${API_BASE_URL}/servicios`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401 || response.status === 500) {
        handleAuthError(response);
        return;
      }

      if (!response.ok) throw new Error('Error al cargar servicios para el modal.');
      const data = await response.json();
      setServices(data.servicios);
    } catch (err) {
      console.error('Error fetching services for modal:', err);
    }
  };

  // Efecto para cargar datos al montar el componente o cuando el token cambia
  useEffect(() => {
    fetchPatientsForModal();
    fetchServicesForModal();
  }, [token]);

  // Recargar citas cada vez que cambien los pacientes o servicios
  useEffect(() => {
    // Solo si patients y services ya se han cargado
    if (patients.length > 0 && services.length > 0) {
      fetchAppointments();
    }
  }, [patients, services, token]);


  // Función para crear o actualizar una cita
  const handleSaveAppointment = async (
    patientId: string,
    serviceId: string,
    startTime: string,
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed',
    appointmentId?: string
  ) => {
    setLoading(true);
    setError(null);
    if (!token) {
      setError('No autenticado. Por favor, inicie sesión.');
      setLoading(false);
      return;
    }

    const selectedService = services.find(s => s.id === serviceId);
    if (!selectedService) {
      setError('Servicio no encontrado. Por favor, recarga la página.');
      setLoading(false);
      return;
    }

    const startDateTime = new Date(startTime);
    const endTime = addMinutes(startDateTime, selectedService.duration).toISOString();

    // <-- CAMBIO CLAVE: Enviar el patientId, no el nombre y apellido -->
    const dataToSend = {
      patientId,
      serviceId,
      startTime,
      endTime,
      status,
    };

    try {
      let response;
      const commonHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };
      if (appointmentId) {
        // <-- CAMBIO CLAVE: Se usa la ruta correcta con el prefijo /api -->
        response = await fetch(`${API_BASE_URL}/citas/${appointmentId}`, {
          method: 'PUT',
          headers: commonHeaders,
          body: JSON.stringify(dataToSend),
        });
      } else {
        // <-- CAMBIO CLAVE: Se usa la ruta correcta con el prefijo /api -->
        response = await fetch(`${API_BASE_URL}/citas`, {
          method: 'POST',
          headers: commonHeaders,
          body: JSON.stringify(dataToSend),
        });
      }

      if (response.status === 401 || response.status === 500) {
        handleAuthError(response);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || 'Error al guardar la cita.');
      }
      fetchAppointments();
      closeModals();
    } catch (err) {
      console.error('Error saving appointment:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido al guardar cita.');
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar una cita
  const handleDeleteAppointment = async (id: string) => {
    setLoading(true);
    setError(null);
    if (!token) {
      setError('No autenticado. Por favor, inicie sesión.');
      setLoading(false);
      return;
    }
    try {
      // <-- CAMBIO CLAVE: Se usa la ruta correcta con el prefijo /api -->
      const response = await fetch(`${API_BASE_URL}/citas/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401 || response.status === 500) {
        handleAuthError(response);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || 'Error al eliminar la cita.');
      }
      fetchAppointments();
    } catch (err) {
      console.error('Error deleting appointment:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido al eliminar cita.');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
      setAppointmentToDelete(null);
    }
  };

  // Manejadores para abrir/cerrar modales
  const openCreateModal = () => {
    setEditingAppointment(null);
    setInitialCreateTime(undefined);
    setShowCreateModal(true);
  };

  const openEditModal = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setShowEditModal(true);
  };

  const closeModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setEditingAppointment(null);
    setInitialCreateTime(undefined);
  };

  const openDeleteConfirm = (appointmentId: string) => {
    setAppointmentToDelete(appointmentId);
    setShowDeleteConfirm(true);
  };

  const closeDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    setAppointmentToDelete(null);
  };

  // Formatear fecha y hora para mostrar
  const formatDateTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    } catch (e) {
      return 'Fecha/Hora inválida';
    }
  };

  // Transformar citas a eventos para react-big-calendar
  const events = useMemo(() => {
    return appointments.map(appt => ({
      id: appt.id,
      title: `${appt.patient.primerNombre} ${appt.patient.apellido} - ${appt.service.name}`,
      start: new Date(appt.startTime),
      end: new Date(appt.endTime),
      resource: appt,
      allDay: false,
    }));
  }, [appointments]);

  // Define una interfaz local para los argumentos de los eventos de arrastrar/redimensionar
  interface DragResizeEventArguments {
    event: BigCalendarEvent;
    start: Date | string;
    end: Date | string;
    isAllDay?: boolean;
    resourceId?: any;
    originalEvent?: any;
  }

  // Manejadores de eventos del calendario
  const handleSelectSlot = ({ start, end }: { start: Date, end: Date }) => {
    const formattedStartTime = start.toISOString().slice(0, 16);
    setInitialCreateTime(formattedStartTime);
    openCreateModal();
  };

  const handleSelectEvent = (event: BigCalendarEvent) => {
    openEditModal(event.resource as Appointment);
  };

  // <-- ¡CAMBIOS CLAVE EN LOS MANEJADORES DE DRAG AND DROP AQUÍ!
  const handleEventDrop = async ({ event, start, end }: DragResizeEventArguments) => {
    const originalAppointment = event.resource as Appointment;
    const updatedStartTime = (start instanceof Date ? start : new Date(start)).toISOString();
    const selectedService = services.find(s => s.id === originalAppointment.serviceId);
    if (!selectedService) return; // Salir si el servicio no se encuentra
    const updatedEndTime = addMinutes(updatedStartTime, selectedService.duration).toISOString(); // Recalcular end time
    await handleSaveAppointment(
      originalAppointment.patientId,
      originalAppointment.serviceId,
      updatedStartTime,
      originalAppointment.status,
      originalAppointment.id
    );
  };

  const handleEventResize = async ({ event, start, end }: DragResizeEventArguments) => {
    const originalAppointment = event.resource as Appointment;
    const updatedStartTime = (start instanceof Date ? start : new Date(start)).toISOString();
    const selectedService = services.find(s => s.id === originalAppointment.serviceId);
    if (!selectedService) return; // Salir si el servicio no se encuentra
    const updatedEndTime = addMinutes(updatedStartTime, selectedService.duration).toISOString(); // Recalcular end time
    await handleSaveAppointment(
      originalAppointment.patientId,
      originalAppointment.serviceId,
      updatedStartTime,
      originalAppointment.status,
      originalAppointment.id
    );
  };

  // Componente para personalizar la visualización de eventos
  const EventComponent = ({ event }: { event: BigCalendarEvent }) => {
    const appt = event.resource as Appointment;
    let statusClass = '';
    switch (appt.status) {
      case 'pending': statusClass = 'bg-yellow-200 text-yellow-900'; break;
      case 'confirmed': statusClass = 'bg-green-200 text-green-900'; break;
      case 'cancelled': statusClass = 'bg-red-200 text-red-900'; break;
      case 'completed': statusClass = 'bg-blue-200 text-blue-900'; break;
      default: statusClass = 'bg-gray-200 text-gray-900';
    }

    return (
      <div className={`rounded-md p-1 text-xs overflow-hidden ${statusClass}`}>
        <strong className="block truncate">{event.title}</strong>
        <span className="block truncate text-gray-700">
          {format(event.start as Date, 'HH:mm')} - {format(event.end as Date, 'HH:mm')}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl w-full">
      <button
        onClick={onBack}
        className="mb-6 flex items-center text-indigo-600 hover:text-indigo-800 font-semibold transition-colors duration-200"
      >
        <ArrowLeft size={20} className="mr-2" /> Volver a Gestión Administrativa
      </button>

      <h2 className="text-4xl font-extrabold text-indigo-800 mb-6 text-center">Gestión de Citas</h2>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Buscar citas (por paciente o servicio)..."
            className="w-full p-3 pl-10 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            disabled
          />
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <button
          onClick={openCreateModal}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
        >
          <PlusCircle size={20} className="mr-2" /> Crear Nueva Cita
        </button>
      </div>

      {loading && <p className="text-center text-indigo-600 text-lg">Cargando citas...</p>}
      {error && <p className="text-center text-red-600 text-lg">Error: {error}</p>}

      {!loading && !error && (
        <div className="h-[700px] w-full mt-8 rounded-lg shadow-md border border-gray-200 p-4">
          <DragAndDropCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            titleAccessor="title"
            defaultView="week"
            views={['month', 'week', 'day', 'agenda']}
            culture="es"
            selectable
            resizable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            onEventDrop={handleEventDrop}
            onEventResize={handleEventResize}
            components={{
              event: EventComponent,
            }}
            className="rbc-calendar"
            style={{ height: '100%' }}
          />
        </div>
      )}

      {/* Modal de Creación/Edición de Citas */}
      {(showCreateModal || showEditModal) && (
        <AppointmentFormModal
          isOpen={showCreateModal || showEditModal}
          onClose={closeModals}
          onSave={handleSaveAppointment}
          editingAppointment={editingAppointment}
          patients={patients}
          services={services}
          initialStartTime={initialCreateTime}
        />
      )}

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-sm relative animate-fade-in text-center">
            <h3 className="text-xl font-bold text-red-700 mb-4">Confirmar Eliminación de Cita</h3>
            <p className="text-gray-700 mb-6">¿Estás seguro de que quieres eliminar esta cita? Esta acción no se puede deshacer.</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={closeDeleteConfirm}
                className="px-6 py-3 border border-gray-300 rounded-full text-gray-700 font-bold hover:bg-gray-100 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={() => appointmentToDelete && handleDeleteAppointment(appointmentToDelete)}
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

export default GestionCitas;
