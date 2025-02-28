import React, { useState } from 'react';
import { X } from 'lucide-react';
import { updateExperienceTest } from '@/utils/userProgress';

const ExperienceTest = ({ isOpen, onClose, onComplete, user }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState({
    experienceTypes: [],
    significantEvents: [],
    positiveExperiences: [],
    painfulExperiences: [],
    lessonsLearned: '',
    impactOnMinistry: '',
    topTwoExperiences: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Experience type categories with descriptions
  const experienceTypes = [
    {
      type: 'spiritual',
      name: 'Espirituales',
      description: 'Experiencias que ocurren en el corazón, la mente y el espíritu. Son personales e íntimas y se alinean con las Escrituras.'
    },
    {
      type: 'religious',
      name: 'Religiosas Educativas',
      description: 'Experiencias que ofrecen oportunidades para influenciar y proveen credibilidad con los demás.'
    },
    {
      type: 'painful',
      name: 'Dolorosas',
      description: 'Experiencias difíciles que permiten identificarse y consolar a otros que pasan por situaciones similares.'
    },
    {
      type: 'failure',
      name: 'De Fracaso',
      description: 'Experiencias donde las cosas no salieron bien pero que pueden ser el punto de partida de nuevos comienzos.'
    },
    {
      type: 'victory',
      name: 'De Victoria',
      description: 'Experiencias gratificantes y agradables que proveen motivación para experiencias futuras.'
    }
  ];

  // Significant life events examples
  const significantEvents = [
    'La pérdida de un ser querido',
    'Abuso físico',
    'Abuso sexual',
    'Calumnias',
    'Discriminación',
    'Adicciones',
    'Rechazo',
    'Persecución',
    'Humillación',
    'Enfermedad grave',
    'Divorcio o separación',
    'Crisis financiera',
    'Cambio de carrera',
    'Migración'
  ];

  // Positive experience examples
  const positiveExperienceExamples = [
    'Coordinar de forma exitosa un evento',
    'Hacerte cargo de un grupo débil y fortalecerlo',
    'Ayudar a que otra persona supere una dificultad',
    'Aprender sobre la tolerancia y aceptación',
    'Obtener un ascenso laboral por tus habilidades',
    'Construir algo para tu casa o comunidad',
    'Aprender un nuevo deporte o habilidad',
    'Cambiar un hábito negativo',
    'Impactar positivamente en la vida de alguien',
    'Superar un miedo personal'
  ];

  const handleExperienceTypeSelection = (type) => {
    setAnswers(prev => {
      // Toggle selection
      if (prev.experienceTypes.includes(type)) {
        return {
          ...prev,
          experienceTypes: prev.experienceTypes.filter(t => t !== type)
        };
      } else {
        return {
          ...prev,
          experienceTypes: [...prev.experienceTypes, type]
        };
      }
    });
  };

  const handleSignificantEventSelection = (event) => {
    setAnswers(prev => {
      // Toggle selection
      if (prev.significantEvents.includes(event)) {
        return {
          ...prev,
          significantEvents: prev.significantEvents.filter(e => e !== event)
        };
      } else {
        return {
          ...prev,
          significantEvents: [...prev.significantEvents, event]
        };
      }
    });
  };

  const handlePositiveExperienceSelection = (experience) => {
    setAnswers(prev => {
      // Toggle selection
      if (prev.positiveExperiences.includes(experience)) {
        return {
          ...prev,
          positiveExperiences: prev.positiveExperiences.filter(e => e !== experience)
        };
      } else {
        return {
          ...prev,
          positiveExperiences: [...prev.positiveExperiences, experience]
        };
      }
    });
  };

  const handleCustomPainfulExperience = (event) => {
    const value = event.target.value;
    setAnswers(prev => ({
      ...prev,
      painfulExperiences: [value]
    }));
  };

  const handleLessonsLearned = (event) => {
    const value = event.target.value;
    setAnswers(prev => ({
      ...prev,
      lessonsLearned: value
    }));
  };

  const handleImpactOnMinistry = (event) => {
    const value = event.target.value;
    setAnswers(prev => ({
      ...prev,
      impactOnMinistry: value
    }));
  };

  const handleTopExperienceSelection = (experience) => {
    setAnswers(prev => {
      const newTopExperiences = [...prev.topTwoExperiences];
      
      // If already selected, remove it
      if (newTopExperiences.includes(experience)) {
        return {
          ...prev,
          topTwoExperiences: newTopExperiences.filter(e => e !== experience)
        };
      }
      
      // If less than 2 are selected, add it
      if (newTopExperiences.length < 2) {
        return {
          ...prev,
          topTwoExperiences: [...newTopExperiences, experience]
        };
      }
      
      // If 2 are already selected, replace the second one
      newTopExperiences[1] = experience;
      return {
        ...prev,
        topTwoExperiences: newTopExperiences
      };
    });
  };

  const isStepComplete = (step) => {
    switch (step) {
      case 1:
        return answers.experienceTypes.length > 0;
      case 2:
        return answers.significantEvents.length > 0 || answers.positiveExperiences.length > 0;
      case 3:
        return answers.lessonsLearned.length > 0;
      case 4:
        return answers.impactOnMinistry.length > 0;
      case 5:
        return answers.topTwoExperiences.length === 2;
      default:
        return false;
    }
  };

  const handleTestCompletion = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
  
      if (!user?.id) {
        setError('User ID is required');
        return;
      }
  
      // All collected answers
      const results = {
        experienceTypes: answers.experienceTypes,
        significantEvents: answers.significantEvents,
        positiveExperiences: answers.positiveExperiences,
        painfulExperiences: answers.painfulExperiences,
        lessonsLearned: answers.lessonsLearned,
        impactOnMinistry: answers.impactOnMinistry,
        topTwoExperiences: answers.topTwoExperiences
      };
      
      // Check if we're in a guest context (testing through invitation)
      if (window.location.pathname.startsWith('/tests')) {
        // This is a guest taking a test through an invitation
        const token = new URLSearchParams(window.location.search).get('token');
        
        if (!token) {
          throw new Error('Missing invitation token');
        }
  
        console.log('Guest test completion - using save-test-results API with token:', token);
        
        const response = await fetch('/api/save-test-results', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token,
            testType: 'experiencia',
            results
          }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to save test results');
        }
        
        if (onComplete) {
          onComplete(results);
        }
        onClose();
        return;
      }
  
      // Regular user path - use the utility function from userProgress.js
      const response = await updateExperienceTest(user.id, results);
  
      if (response.error) {
        setError(response.error);
        return;
      }
  
      if (onComplete) {
        onComplete(results);
      }
      onClose();
    } catch (error) {
      console.error('Error in handleTestCompletion:', error);
      setError('Hubo un error al guardar los resultados. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Combined list of all experiences for the final step
  const getAllExperiences = () => {
    const allExperiences = [
      ...answers.significantEvents.map(event => ({ type: 'significant', name: event })),
      ...answers.positiveExperiences.map(exp => ({ type: 'positive', name: exp })),
      ...answers.painfulExperiences.map(exp => ({ type: 'painful', name: exp }))
    ];
    return allExperiences;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-start justify-center overflow-y-auto">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 my-24">
        <div className="flex justify-between items-center px-4 py-2 border-b">
          <h2 className="text-lg font-bold text-[#8B2332]">Test de Experiencia</h2>
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
                  style={{ width: `${(currentStep / 5) * 100}%` }}
                />
              </div>
            </div>
            <p className="text-center text-xs text-gray-600">
              Paso {currentStep} de 5
            </p>
          </div>

          {error && (
            <div className="mb-4 p-2 border border-red-300 rounded bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Experience Types */}
          {currentStep === 1 && (
            <div>
              <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-xl font-bold text-[#8B2332] mb-4">PASO 1: Tipos de Experiencias</h3>
                <p className="text-md leading-relaxed text-gray-700">
                  "Ahora bien, sabemos que Dios dispone todas las cosas para el bien de quienes lo aman, 
                  los que han sido llamados de acuerdo con su propósito." (Romanos 8:28)
                </p>
                <p className="text-md leading-relaxed text-gray-700 mt-4">
                  Selecciona los tipos de experiencias significativas que has tenido en tu vida.
                </p>
              </div>
              
              <div className="space-y-3">
                {experienceTypes.map((expType) => (
                  <button
                    key={expType.type}
                    onClick={() => handleExperienceTypeSelection(expType.type)}
                    className={`w-full text-left p-4 rounded-lg transition-colors ${
                      answers.experienceTypes.includes(expType.type)
                        ? 'bg-[#8B2332] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <h4 className="font-semibold">{expType.name}</h4>
                    <p className={`mt-1 text-sm ${
                      answers.experienceTypes.includes(expType.type)
                        ? 'text-gray-100'
                        : 'text-gray-600'
                    }`}>
                      {expType.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Significant Events and Positive Experiences */}
          {currentStep === 2 && (
            <div>
              <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-xl font-bold text-[#8B2332] mb-4">PASO 2: Experiencias Significativas</h3>
                <p className="text-md leading-relaxed text-gray-700">
                  Marca las experiencias significativas que has vivido. Pueden ser dolorosas o positivas.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-[#8B2332]">Experiencias Dolorosas</h4>
                  <div className="space-y-2">
                    {significantEvents.map((event) => (
                      <button
                        key={event}
                        onClick={() => handleSignificantEventSelection(event)}
                        className={`w-full text-left p-3 rounded-lg transition-colors text-sm ${
                          answers.significantEvents.includes(event)
                            ? 'bg-[#8B2332] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {event}
                      </button>
                    ))}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Otra experiencia dolorosa:
                      </label>
                      <textarea
                        value={answers.painfulExperiences[0] || ''}
                        onChange={handleCustomPainfulExperience}
                        className="mt-1 w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-[#8B2332] focus:ring-[#8B2332] text-gray-900"
                        rows="3"
                        placeholder="Describe otra experiencia dolorosa significativa..."
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-[#8B2332]">Experiencias Positivas</h4>
                  <div className="space-y-2">
                    {positiveExperienceExamples.map((exp) => (
                      <button
                        key={exp}
                        onClick={() => handlePositiveExperienceSelection(exp)}
                        className={`w-full text-left p-3 rounded-lg transition-colors text-sm ${
                          answers.positiveExperiences.includes(exp)
                            ? 'bg-[#8B2332] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {exp}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Lessons Learned */}
          {currentStep === 3 && (
            <div>
              <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-xl font-bold text-[#8B2332] mb-4">PASO 3: Lecciones Aprendidas</h3>
                <p className="text-md leading-relaxed text-gray-700">
                  "...para que con el mismo consuelo que de Dios hemos recibido, también nosotros podamos consolar a todos los que sufren." (2 Corintios 1:4)
                </p>
                <p className="text-md leading-relaxed text-gray-700 mt-4">
                  Reflexiona y comparte qué lecciones importantes has aprendido a través de tus experiencias.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h4 className="font-semibold text-[#8B2332] mb-4">¿Qué lecciones importantes has aprendido?</h4>
                <textarea
                  value={answers.lessonsLearned}
                  onChange={handleLessonsLearned}
                  className="w-full rounded-md border-gray-300 shadow-sm p-3 border focus:border-[#8B2332] focus:ring-[#8B2332] text-gray-900 font-medium"
                  rows="6"
                  placeholder="Describe las lecciones importantes que has aprendido a través de estas experiencias..."
                />
              </div>
            </div>
          )}

          {/* Step 4: Impact on Ministry */}
          {currentStep === 4 && (
            <div>
              <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-xl font-bold text-[#8B2332] mb-4">PASO 4: Impacto en tu Ministerio</h3>
                <p className="text-md leading-relaxed text-gray-700">
                  "Mis experiencias me han ayudado a formular, y en ocasiones, cambiar, mi pasión por algunos ministerios o personas."
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h4 className="font-semibold text-[#8B2332] mb-4">¿Cómo tus experiencias han influido o podrían influir en tu ministerio?</h4>
                <textarea
                  value={answers.impactOnMinistry}
                  onChange={handleImpactOnMinistry}
                  className="w-full rounded-md border-gray-300 shadow-sm p-3 border focus:border-[#8B2332] focus:ring-[#8B2332] text-gray-900 font-medium"
                  rows="6"
                  placeholder="Describe cómo estas experiencias han moldeado tu pasión por ciertos ministerios o personas..."
                />
              </div>
            </div>
          )}

          {/* Step 5: Top Two Experiences */}
          {currentStep === 5 && (
            <div>
              <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-xl font-bold text-[#8B2332] mb-4">PASO 5: Experiencias Más Significativas</h3>
                <p className="text-md leading-relaxed text-gray-700">
                  Por favor, selecciona las 2 experiencias que consideras han tenido el mayor impacto en tu vida y ministerio.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h4 className="font-semibold text-[#8B2332] mb-4">Tus Experiencias</h4>
                <div className="space-y-2">
                  {getAllExperiences().map((exp, index) => (
                    <button
                      key={index}
                      onClick={() => handleTopExperienceSelection(exp.name)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        answers.topTwoExperiences.includes(exp.name)
                          ? 'bg-[#8B2332] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{exp.name}</span>
                        {answers.topTwoExperiences.includes(exp.name) && (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white text-[#8B2332] font-bold text-xs">
                            {answers.topTwoExperiences.indexOf(exp.name) + 1}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                {answers.painfulExperiences.length > 0 && (
                  <button
                    onClick={() => handleTopExperienceSelection(answers.painfulExperiences[0])}
                    className={`w-full text-left p-3 rounded-lg transition-colors mt-2 ${
                      answers.topTwoExperiences.includes(answers.painfulExperiences[0])
                        ? 'bg-[#8B2332] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{answers.painfulExperiences[0]}</span>
                      {answers.topTwoExperiences.includes(answers.painfulExperiences[0]) && (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white text-[#8B2332] font-bold text-xs">
                          {answers.topTwoExperiences.indexOf(answers.painfulExperiences[0]) + 1}
                        </span>
                      )}
                    </div>
                  </button>
                )}
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
                if (currentStep === 5 && isStepComplete(currentStep)) {
                  handleTestCompletion();
                } else if (isStepComplete(currentStep)) {
                  setCurrentStep(prev => Math.min(5, prev + 1));
                }
              }}
              className={`px-4 py-2 rounded text-sm ${
                isStepComplete(currentStep)
                  ? 'bg-[#8B2332] hover:bg-[#7a1e2b] text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!isStepComplete(currentStep) || isSubmitting}
            >
              {isSubmitting 
                ? 'Guardando...' 
                : currentStep === 5 
                  ? 'Completar'
                  : 'Siguiente'
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ExperienceTest.defaultProps = {
  onComplete: () => {},
};

export default ExperienceTest;