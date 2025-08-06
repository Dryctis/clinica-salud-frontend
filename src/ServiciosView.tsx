import React from 'react';

const ServiciosView = () => {
  return (
    <div className="container mx-auto px-6 py-20 min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-5xl w-full border border-blue-200 animate-fade-in-up">
        <h1 className="text-6xl font-extrabold text-blue-800 mb-8 tracking-tight leading-tight">Nuestros Servicios</h1>
        <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto">
          En Clínica Vida y Salud, nos dedicamos a ofrecer una amplia gama de servicios médicos de alta calidad,
          centrados en tu bienestar y recuperación. Nuestro equipo de profesionales está aquí para cuidarte con pasión y experiencia.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Servicio 1: Consulta General */}
          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 border border-blue-100 service-card">
            <h3 className="text-3xl font-bold text-blue-700 mb-4">Consulta General</h3>
            <p className="text-gray-700 mb-5 leading-relaxed">
              Atención médica integral para toda la familia, diagnósticos precisos, prevención y manejo efectivo de enfermedades comunes.
            </p>
            <span className="inline-block bg-blue-600 text-white text-md font-semibold px-4 py-2 rounded-full shadow-md">
              30 min | $50
            </span>
          </div>

          {/* Servicio 2: Pediatría */}
          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 border border-blue-100 service-card">
            <h3 className="text-3xl font-bold text-blue-700 mb-4">Pediatría</h3>
            <p className="text-gray-700 mb-5 leading-relaxed">
              Cuidado especializado y cariñoso para niños desde el nacimiento hasta la adolescencia, incluyendo vacunas y controles de desarrollo.
            </p>
            <span className="inline-block bg-blue-600 text-white text-md font-semibold px-4 py-2 rounded-full shadow-md">
              45 min | $65
            </span>
          </div>

          {/* Servicio 3: Cardiología */}
          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 border border-blue-100 service-card">
            <h3 className="text-3xl font-bold text-blue-700 mb-4">Cardiología</h3>
            <p className="text-gray-700 mb-5 leading-relaxed">
              Diagnóstico avanzado y tratamiento de enfermedades del corazón y del sistema circulatorio, con tecnología de punta.
            </p>
            <span className="inline-block bg-blue-600 text-white text-md font-semibold px-4 py-2 rounded-full shadow-md">
              60 min | $120
            </span>
          </div>

          {/* Servicio 4: Dermatología */}
          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 border border-blue-100 service-card">
            <h3 className="text-3xl font-bold text-blue-700 mb-4">Dermatología</h3>
            <p className="text-gray-700 mb-5 leading-relaxed">
              Cuidado integral de la piel, cabello y uñas. Tratamiento de afecciones dermatológicas y soluciones estéticas.
            </p>
            <span className="inline-block bg-blue-600 text-white text-md font-semibold px-4 py-2 rounded-full shadow-md">
              40 min | $80
            </span>
          </div>

          {/* Servicio 5: Nutrición */}
          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 hover:-scale-105 border border-blue-100 service-card">
            <h3 className="text-3xl font-bold text-blue-700 mb-4">Nutrición</h3>
            <p className="text-gray-700 mb-5 leading-relaxed">
              Asesoramiento personalizado para una alimentación saludable, control de peso y manejo de condiciones dietéticas específicas.
            </p>
            <span className="inline-block bg-blue-600 text-white text-md font-semibold px-4 py-2 rounded-full shadow-md">
              45 min | $70
            </span>
          </div>

          {/* Servicio 6: Fisioterapia */}
          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 border border-blue-100 service-card">
            <h3 className="text-3xl font-bold text-blue-700 mb-4">Fisioterapia</h3>
            <p className="text-gray-700 mb-5 leading-relaxed">
              Rehabilitación y terapia física avanzada para recuperar la movilidad, reducir el dolor y mejorar tu calidad de vida.
            </p>
            <span className="inline-block bg-blue-600 text-white text-md font-semibold px-4 py-2 rounded-full shadow-md">
              60 min | $95
            </span>
          </div>
        </div>

        <p className="text-lg text-gray-600 mt-12 max-w-2xl mx-auto">
          Para más información detallada o para agendar una cita, por favor, visita nuestra sección de <span className="font-semibold text-blue-700">Contacto</span>. ¡Estamos listos para atenderte!
        </p>
      </div>

      {/* Estilos para animaciones */}
      <style>{`
        @keyframes fadeInFromBottom {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInFromBottom 0.8s ease-out forwards;
        }
        .service-card {
          opacity: 0; /* Inicialmente oculto */
          animation: fadeInFromBottom 0.6s ease-out forwards;
        }
        /* Retrasos para cada tarjeta */
        .service-card:nth-child(1) { animation-delay: 0.2s; }
        .service-card:nth-child(2) { animation-delay: 0.3s; }
        .service-card:nth-child(3) { animation-delay: 0.4s; }
        .service-card:nth-child(4) { animation-delay: 0.5s; }
        .service-card:nth-child(5) { animation-delay: 0.6s; }
        .service-card:nth-child(6) { animation-delay: 0.7s; }
      `}</style>
    </div>
  );
};

export default ServiciosView;
