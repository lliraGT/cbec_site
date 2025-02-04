// src/components/tests/results/PersonalityResults.jsx
import React from 'react';
import DiscChart from './DiscChart';

const PersonalityResults = ({ results }) => {
  if (!results) {
    return (
      <div className="text-center p-4">
        <p>No hay resultados disponibles.</p>
      </div>
    );
  }

  // Define the order for DISC values
  const discOrder = ['D', 'I', 'S', 'C'];

  return (
    <div className="max-w-4xl mx-auto pt-8">
      {/* DISC Chart */}
      <div className="mb-8 bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Perfil DISC
        </h3>
        <DiscChart results={results} />
      </div>

      {/* Results Summary */}
      <div className="mb-8 bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Resumen de Resultados
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {discOrder.map((type) => (
            <div 
              key={type} 
              className="p-4 rounded-lg bg-gray-50"
            >
              <div className="text-2xl font-bold text-[#8B2332]">{type}</div>
              <div className="text-xl text-gray-700">{results[type]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* DISC Type Descriptions */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Descripción de Tipos DISC
        </h3>
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-gray-50">
            <h4 className="font-semibold text-[#8B2332] mb-2">D - Dominante</h4>
            <p className="text-gray-700">
              Enfocado en resultados, directo, fuerte, voluntarioso. Prioriza aceptar desafíos, tomar acción y lograr resultados inmediatos.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-gray-50">
            <h4 className="font-semibold text-[#8B2332] mb-2">I - Influyente</h4>
            <p className="text-gray-700">
              Optimista, sociable, entusiasta, persuasivo. Se enfoca en influenciar a otros, compartir ideas y generar entusiasmo.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-gray-50">
            <h4 className="font-semibold text-[#8B2332] mb-2">S - Estable</h4>
            <p className="text-gray-700">
              Paciente, buen oyente, trabajador en equipo. Se concentra en la cooperación, ser sincero y brindar apoyo confiable.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-gray-50">
            <h4 className="font-semibold text-[#8B2332] mb-2">C - Concienzudo</h4>
            <p className="text-gray-700">
              Preciso, analítico, sistemático. Se enfoca en trabajar con precisión, calidad y competencia dentro de circunstancias existentes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalityResults;