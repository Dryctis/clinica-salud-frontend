import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Facebook, Instagram, Linkedin, MessageCircle, AlertCircle } from 'lucide-react';

const ContactoView = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('idle'); // Reset status

    // Simulación de envío de formulario
    console.log('Formulario de contacto enviado:', formData);
    
    // Aquí iría la lógica real de envío a un backend
    // Por ahora, simulamos un éxito o error aleatorio
    setTimeout(() => {
      if (Math.random() > 0.2) { // 80% de éxito
        setFormStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' }); // Limpiar formulario
      } else {
        setFormStatus('error');
      }
    }, 1000);
  };

  return (
    <div className="container mx-auto px-6 py-20 min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-5xl w-full border border-blue-200 animate-fade-in-up">
        <h1 className="text-6xl font-extrabold text-blue-800 mb-8 tracking-tight leading-tight">Contáctanos</h1>
        <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto">
          Estamos aquí para responder a tus preguntas, agendar tus citas y brindarte el mejor cuidado.
          No dudes en ponerte en contacto con nosotros.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Columna de Información de Contacto */}
          <div className="text-left space-y-8 p-6 bg-blue-50 rounded-2xl shadow-md border border-blue-100 animate-fade-in-left">
            <h2 className="text-3xl font-bold text-blue-700 mb-6">Información de la Clínica</h2>
            
            <div className="flex items-center text-gray-800 text-lg">
              <Phone size={24} className="text-blue-600 mr-4 flex-shrink-0" />
              <div>
                <p className="font-semibold">Teléfono:</p>
                <p>+1 (555) 123-4567</p>
                <p className="text-sm text-gray-600">Para citas y consultas generales</p>
              </div>
            </div>

            <div className="flex items-center text-gray-800 text-lg">
              <Mail size={24} className="text-blue-600 mr-4 flex-shrink-0" />
              <div>
                <p className="font-semibold">Correo Electrónico:</p>
                <p>info@clinicavidaySalud.com</p>
                <p className="text-sm text-gray-600">Para consultas no urgentes</p>
              </div>
            </div>

            <div className="flex items-start text-gray-800 text-lg">
              <MapPin size={24} className="text-blue-600 mr-4 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold">Dirección:</p>
                <p>123 Calle Principal, Colonia Saludable</p>
                <p>Ciudad, Código Postal, País</p>
              </div>
            </div>

            <div className="flex items-center text-gray-800 text-lg">
              <Clock size={24} className="text-blue-600 mr-4 flex-shrink-0" />
              <div>
                <p className="font-semibold">Horario de Atención:</p>
                <p>Lunes a Viernes: 8:00 AM - 6:00 PM</p>
                <p>Sábados: 9:00 AM - 1:00 PM</p>
                <p className="text-sm text-gray-600">Domingos: Cerrado</p>
              </div>
            </div>

            {/* Información de Emergencia */}
            <div className="bg-red-50 p-4 rounded-lg border border-red-200 flex items-start text-red-800">
              <AlertCircle size={24} className="mr-3 flex-shrink-0 mt-1" />
              <div>
                <p className="font-bold text-lg mb-1">En caso de Emergencia:</p>
                <p className="text-sm">Si se trata de una emergencia médica, por favor, llame al **911** o acuda a la sala de emergencias más cercana.</p>
              </div>
            </div>

            {/* Redes Sociales */}
            <div className="mt-8 text-center lg:text-left">
              <h3 className="text-2xl font-bold text-blue-700 mb-4">Síguenos en Redes Sociales</h3>
              <div className="flex justify-center lg:justify-start space-x-4">
                <a href="https://facebook.com/clinicavidaySalud" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
                  <Facebook size={32} />
                </a>
                <a href="https://instagram.com/clinicavidaySalud" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800 transition-colors duration-200">
                  <Instagram size={32} />
                </a>
                <a href="https://linkedin.com/company/clinicavidaySalud" target="_blank" rel="noopener noreferrer" className="text-blue-800 hover:text-blue-900 transition-colors duration-200">
                  <Linkedin size={32} />
                </a>
              </div>
            </div>

          </div>

          {/* Columna de Formulario de Contacto y Mapa */}
          <div className="space-y-8 animate-fade-in-right">
            {/* Formulario de Contacto */}
            <div className="p-6 bg-blue-50 rounded-2xl shadow-md border border-blue-100">
              <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Envíanos un Mensaje</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Nombre Completo</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Correo Electrónico</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Teléfono (Opcional)</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Tu Mensaje</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  ></textarea>
                </div>
                {formStatus === 'success' && (
                  <p className="text-green-600 font-semibold text-center">¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.</p>
                )}
                {formStatus === 'error' && (
                  <p className="text-red-600 font-semibold text-center">Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.</p>
                )}
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  Enviar Mensaje
                </button>
              </form>
            </div>

            {/* Mapa de Google Maps */}
            <div className="p-6 bg-white rounded-2xl shadow-md border border-blue-100">
              <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Encuéntranos Aquí</h2>
              <div className="aspect-w-16 aspect-h-9 w-full rounded-lg overflow-hidden shadow-inner border border-gray-200">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.956717757049!2d-73.98765438459453!3d40.7488179793282!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2598877f9c891%3A0x7d01f1f1f1f1f1f1!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1678901234567!5m2!1sen!2sus"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación de la clínica en Google Maps"
                ></iframe>
              </div>
              <p className="text-center text-gray-600 text-sm mt-4">Haz clic en el mapa para obtener indicaciones.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos para animaciones */}
      <style>{`
        @keyframes fadeInFromBottom {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInFromLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInFromRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in-up { animation: fadeInFromBottom 0.8s ease-out forwards; }
        .animate-fade-in-left { animation: fadeInFromLeft 0.8s ease-out forwards; }
        .animate-fade-in-right { animation: fadeInFromRight 0.8s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default ContactoView;
