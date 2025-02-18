import React, { useState } from 'react';
import { X } from 'lucide-react';

const groups = [
  'Ejecutivos y profesionales',
  'Comerciantes',
  'Trabajadores del campo',
  'Obreros',
  'Artistas: músicos, actores, escritores',
  'Deportistas',
  'Parejas en su etapa de prometidos',
  'Matrimonios jóvenes sin hijos',
  'Matrimonios jóvenes con hijos',
  'Matrimonios con hijos adolecentes',
  'Matrimonios con hijos adultos',
  'Creyentes casados con no creyentes',
  'Adultos de la tercera edad',
  'Discapacitados',
  'Cristianos desilusionados',
  'Divorciados',
  'Grupos indígenas',
  'Extranjeros',
  'Prisioneros',
  'Ex convictos',
  'Familiares de prisioneros',
  'Personas que han escapado de su casa',
  'Indigentes',
  'Analfabetas',
  'Bebés',
  'Preescolares',
  'Niños de edad escolar',
  'Adolecentes',
  'Jóvenes',
  'Estudiantes universitarios',
  'Adultos solteros',
  'Hijos de pastores',
  'Hijos de padres solteros',
  'Ministros',
  'Esposas de ministros',
  'Misioneros',
  'Vecinos',
  'Nuevos cristianos',
  'Nuevos miembros de la iglesia',
  'Cristianos nominales',
  'No cristianos',
  'Padres de familia',
  'Gente involucrada en la pornografía',
  'Gente en pobreza extrema',
  'Abusados sexualmente',
  'Hospitalizados',
  'Enfermos terminales',
  'Familiares de enfermos terminales',
  'Homosexuales y lesbianas',
  'Pacientes con SIDA',
  'Adictos al alcohol o a las drogas',
  'Desempleados',
  'Amas de casa',
  'Mujeres solteras embarazadas',
  'Madres solteras',
  'Madres casadas que trabajan',
  'Madres de adolescentes',
  'Mujeres que abortaron'
];

const passionTypes = [
  {
    name: 'Desafiando',
    description: 'Me apasionan las situaciones que requieren nuevos pensamientos e ideas que no han sido implementadas.'
  },
  {
    name: 'Defendiendo',
    description: 'Me apasiona mantener una postura firme por lo que es correcto y oponerme a lo que está mal, aun si estoy enfrentando adversidad.'
  },
  {
    name: 'Delegando',
    description: 'Me apasiona empoderar a otros para que completen sus tareas.'
  },
  {
    name: 'Creando',
    description: 'Me apasiona crear algo que no existía antes.'
  },
  {
    name: 'Mejorando',
    description: 'Me apasiona tomar algo que ha sido creado previamente y hacerlo mejor y más eficiente'
  },
  {
    name: 'Influyendo',
    description: 'Me apasiona cuando es aparente que he influenciado a otros en una forma de pensar o actuar.'
  },
  {
    name: 'Liderando',
    description: 'Me apasiona dirigir a los grupos para que se muevan hacia cierta dirección. Disfruto determinar qué se hará y cómo se hará.'
  },
  {
    name: 'Administrando',
    description: 'Me apasiona mantener de forma eficiente algo que funciona.'
  },
  {
    name: 'Organizando',
    description: 'Me apasiona organizar los recursos en una estructura sistemática'
  },
  {
    name: 'Perfeccionando',
    description: 'Me apasiona hacer las labores con excelencia.'
  },
  {
    name: 'Protagonizando',
    description: 'Me apasiona estar frente a la gente con su atención puesta en mí.'
  },
  {
    name: 'Innovando',
    description: 'Me apasiona lanzar nuevos conceptos que no han sido previamente probados en ningún escenario. No me desalienta el fracaso'
  },
  {
    name: 'Reparando',
    description: 'Me apasiona arreglar lo que está descompuesto (incluyendo las vidas de las personas).'
  },
  {
    name: 'Sirviendo',
    description: 'Me apasiona ayudar a que otros sean exitosos.'
  },
  {
    name: 'Socializando',
    description: 'Me apasiona proveer y planear oportunidades para los individuos o los grupos, para que éstos se unan en una causa común.'
  },
  {
    name: 'Enseñando',
    description: 'Me apasiona enseñar a otros cómo entender o desempeñar una tarea que antes no entendían o no podían desarrollar.'
  }
];

export default function PassionTest({ isOpen, onClose, onComplete, user }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [topFiveGroups, setTopFiveGroups] = useState([]);
  const [selectedPassions, setSelectedPassions] = useState([]);
  const [topThreePassions, setTopThreePassions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleGroupSelection = (group) => {
    setSelectedGroups(prev => 
      prev.includes(group)
        ? prev.filter(g => g !== group)
        : [...prev, group]
    );
  };

  const handleTopFiveSelection = (group) => {
    setTopFiveGroups(prev => {
      if (prev.includes(group)) {
        return prev.filter(g => g !== group);
      }
      if (prev.length >= 5) {
        return prev;
      }
      return [...prev, group];
    });
  };

  const handlePassionSelection = (passion) => {
    setSelectedPassions(prev => 
      prev.includes(passion)
        ? prev.filter(p => p !== passion)
        : [...prev, passion]
    );
  };

  const handleTopThreeSelection = (passion) => {
    setTopThreePassions(prev => {
      if (prev.includes(passion)) {
        return prev.filter(p => p !== passion);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, passion];
    });
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      const results = {
        selectedGroups,
        topFiveGroups,
        selectedPassions,
        topThreePassions
      };

      const response = await fetch('/api/user-progress/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          testType: 'passion',
          results
        }),
      });

      if (!response.ok) {
        throw new Error('Error updating test progress');
      }

      if (onComplete) {
        onComplete(results);
      }
      onClose();
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setError('Hubo un error al guardar los resultados. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedGroups.length > 0;
      case 2:
        return topFiveGroups.length === 5;
      case 3:
        return selectedPassions.length > 0;
      case 4:
        return topThreePassions.length === 3;
      default:
        return false;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-start justify-center overflow-y-auto">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 my-24">
        <div className="flex justify-between items-center px-4 py-2 border-b">
          <h2 className="text-lg font-bold text-[#8B2332]">Test de Pasión</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-full"
            disabled={isSubmitting}
          >
            <X className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        <div className="p-4">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-center mb-2">
              <div className="w-full max-w-md bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#8B2332] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                />
              </div>
            </div>
            <p className="text-center text-xs text-gray-600">
              Paso {currentStep} de 4
            </p>
          </div>

          {error && (
            <div className="mb-4 p-2 border border-red-300 rounded bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Initial Group Selection */}
          {currentStep === 1 && (
            <div>
              <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-xl font-bold text-[#8B2332] mb-4">PASO 1:</h3>
                <p className="text-md leading-relaxed text-gray-700">
                  Marca la gente o los grupos por los cuales sientes la mayor preocupación (pasión) y deseo (motivación) por ayudar.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {groups.map((group) => (
                  <button
                    key={group}
                    onClick={() => handleGroupSelection(group)}
                    className={`p-2 rounded text-sm transition-colors ${
                      selectedGroups.includes(group)
                        ? 'bg-[#8B2332] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {group}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Top 5 Selection */}
          {currentStep === 2 && (
            <div>
              <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-xl font-bold text-[#8B2332] mb-4">PASO 2:</h3>
                <p className="text-md leading-relaxed text-gray-700">
                  De tu selección anterior, elige los 5 grupos que más te apasionan.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {selectedGroups.map((group) => (
                  <button
                    key={group}
                    onClick={() => handleTopFiveSelection(group)}
                    className={`p-2 rounded text-sm transition-colors ${
                      topFiveGroups.includes(group)
                        ? 'bg-[#8B2332] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    disabled={!topFiveGroups.includes(group) && topFiveGroups.length >= 5}
                  >
                    {group}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Passion Types Selection */}
          {currentStep === 3 && (
            <div>
              <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-xl font-bold text-[#8B2332] mb-4">PASO 3:</h3>
                <p className="text-md leading-relaxed text-gray-700">
                  Marca la forma en que demuestras tu pasión.
                </p>
              </div>
              <div className="space-y-2">
                {passionTypes.map((passion) => (
                  <button
                    key={passion.name}
                    onClick={() => handlePassionSelection(passion.name)}
                    className={`w-full p-4 rounded text-left transition-colors ${
                      selectedPassions.includes(passion.name)
                        ? 'bg-[#8B2332] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <h4 className="font-semibold">{passion.name}</h4>
                    <p className="text-sm mt-1">{passion.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Top 3 Passion Types */}
          {currentStep === 4 && (
            <div>
              <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-xl font-bold text-[#8B2332] mb-4">PASO 4:</h3>
                <p className="text-md leading-relaxed text-gray-700">
                  De tu selección anterior, elige las 3 formas principales en que demuestras tu pasión.
                </p>
              </div>
              <div className="space-y-2">
                {selectedPassions.map((passionName) => {
                  const passionInfo = passionTypes.find(p => p.name === passionName);
                  return (
                    <button
                      key={passionName}
                      onClick={() => handleTopThreeSelection(passionName)}
                      className={`w-full p-4 rounded text-left transition-colors ${
                        topThreePassions.includes(passionName)
                          ? 'bg-[#8B2332] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      disabled={!topThreePassions.includes(passionName) && topThreePassions.length >= 3}
                    >
                      <h4 className="font-semibold">{passionInfo.name}</h4>
                      <p className="text-sm mt-1">{passionInfo.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <button
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              className={`px-4 py-2 rounded text-sm ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              disabled={currentStep === 1 || isSubmitting}
            >
              Anterior
            </button>
            <button
              onClick={() => {
                if (currentStep === 4 && canProceed()) {
                  handleSubmit();
                } else if (canProceed()) {
                  setCurrentStep(prev => prev + 1);
                }
              }}
              className={`px-4 py-2 rounded text-sm ${
                canProceed()
                  ? 'bg-[#8B2332] hover:bg-[#7a1e2b] text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!canProceed() || isSubmitting}
            >
              {isSubmitting 
                ? 'Guardando...' 
                : currentStep === 4 
                  ? 'Completar'
                  : 'Siguiente'
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}