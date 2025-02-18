import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const PassionResults = ({ results }) => {
  const [expandedSection, setExpandedSection] = useState(null);

  if (!results || !results.topFiveGroups || !results.topThreePassions) {
    return <div className="text-center p-4">No hay resultados de pasión disponibles.</div>;
  }

  const passionTypesDescriptions = {
    'Desafiando': 'Me apasionan las situaciones que requieren nuevos pensamientos e ideas que no han sido implementadas.',
    'Defendiendo': 'Me apasiona mantener una postura firme por lo que es correcto y oponerme a lo que está mal, aun si estoy enfrentando adversidad.',
    'Delegando': 'Me apasiona empoderar a otros para que completen sus tareas.',
    'Creando': 'Me apasiona crear algo que no existía antes.',
    'Mejorando': 'Me apasiona tomar algo que ha sido creado previamente y hacerlo mejor y más eficiente',
    'Influyendo': 'Me apasiona cuando es aparente que he influenciado a otros en una forma de pensar o actuar.',
    'Liderando': 'Me apasiona dirigir a los grupos para que se muevan hacia cierta dirección. Disfruto determinar qué se hará y cómo se hará.',
    'Administrando': 'Me apasiona mantener de forma eficiente algo que funciona.',
    'Organizando': 'Me apasiona organizar los recursos en una estructura sistemática',
    'Perfeccionando': 'Me apasiona hacer las labores con excelencia.',
    'Protagonizando': 'Me apasiona estar frente a la gente con su atención puesta en mí.',
    'Innovando': 'Me apasiona lanzar nuevos conceptos que no han sido previamente probados en ningún escenario. No me desalienta el fracaso',
    'Reparando': 'Me apasiona arreglar lo que está descompuesto (incluyendo las vidas de las personas).',
    'Sirviendo': 'Me apasiona ayudar a que otros sean exitosos.',
    'Socializando': 'Me apasiona proveer y planear oportunidades para los individuos o los grupos, para que éstos se unan en una causa común.',
    'Enseñando': 'Me apasiona enseñar a otros cómo entender o desempeñar una tarea que antes no entendían o no podían desarrollar.'
  };

  return (
    <div className="max-w-[90rem] mx-auto space-y-8 px-4">
      {/* Summary Section */}
      <div className="bg-white rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-[#8B2332] p-6 border-b">
          Resumen de tu Pasión
        </h2>
        <div className="p-6">
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-[#8B2332] mb-4">
              Grupos que más te apasionan
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {results.topFiveGroups.map((group, index) => (
                <div 
                  key={group}
                  className="p-4 border rounded-lg bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#8B2332] text-white font-bold">
                      {index + 1}
                    </span>
                    <span className="text-gray-800 font-medium">{group}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#8B2332] mb-4">
              Tus formas de expresar pasión
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {results.topThreePassions.map((passion, index) => (
                <div 
                  key={passion}
                  className="p-4 border rounded-lg bg-gray-50"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#8B2332] text-white font-bold">
                      {index + 1}
                    </span>
                    <span className="text-gray-800 font-medium">{passion}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {passionTypesDescriptions[passion]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="bg-white rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-[#8B2332] p-6 border-b">
          Análisis Detallado
        </h3>
        <div className="divide-y">
          {/* Groups Analysis */}
          <div className="p-6">
            <button
              onClick={() => setExpandedSection(expandedSection === 'groups' ? null : 'groups')}
              className="w-full flex justify-between items-center"
            >
              <h4 className="text-lg font-semibold text-gray-900">Grupos Seleccionados</h4>
              {expandedSection === 'groups' ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>
            
            {expandedSection === 'groups' && (
              <div className="mt-4 space-y-4">
                <p className="text-gray-900">
                  Has seleccionado {results.selectedGroups.length} grupos en total, 
                  de los cuales estos 5 son los que más te apasionan:
                </p>
                <div className="space-y-2">
                  {results.topFiveGroups.map((group, index) => (
                    <div key={group} className="p-3 bg-gray-50 rounded-lg flex items-center gap-3">
                      <span className="font-bold text-[#8B2332]">{index + 1}.</span>
                      <span className="text-gray-900">{group}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Passion Types Analysis */}
          <div className="p-6">
            <button
              onClick={() => setExpandedSection(expandedSection === 'passions' ? null : 'passions')}
              className="w-full flex justify-between items-center"
            >
              <h4 className="text-lg font-semibold text-gray-900">Formas de Expresar Pasión</h4>
              {expandedSection === 'passions' ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>
            
            {expandedSection === 'passions' && (
              <div className="mt-4 space-y-4">
                <p className="text-gray-700">
                  De las diferentes formas de expresar pasión, estas son tus 3 principales:
                </p>
                <div className="space-y-2">
                  {results.topThreePassions.map((passion, index) => (
                    <div key={passion} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold text-[#8B2332]">{index + 1}.</span>
                        <span className="font-medium text-gray-900">{passion}</span>
                      </div>
                      <p className="text-sm text-gray-600 ml-7">
                        {passionTypesDescriptions[passion]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-[#8B2332] mb-4">
          Recomendaciones
        </h3>
        <div className="space-y-4 text-gray-700">
          <p>
            Basado en tus resultados, aquí hay algunas recomendaciones para canalizar tu pasión de manera efectiva:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Busca oportunidades de servicio que involucren a los grupos que más te apasionan</li>
            <li>Utiliza tus formas naturales de expresar pasión para maximizar tu impacto</li>
            <li>Considera formar equipos con personas que tengan pasiones complementarias</li>
            <li>Mantén un balance entre tu entusiasmo y la necesidad de descanso</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PassionResults;