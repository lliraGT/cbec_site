// src/components/PersonalityTest.js
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { updatePersonalityTest } from '@/utils/userProgress';

const PersonalityTest = ({ isOpen, onClose, onComplete, user }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const questionGroups = {
    1: [1, 2],
    2: [3, 4],
    3: [5, 6],
    4: [7, 8],
    5: [9, 10],
    6: [11, 12],
    7: [13, 14],
    8: [15, 16],
    9: [17, 18],
    10: [19, 20],
    11: [21, 22],
    12: [23, 24],
    13: [25, 26],
    14: [27, 28]
  };

  const questions = {
    1: {
      words: [
        { text: 'Entusiasta', type: 'I' },
        { text: 'Rápido', type: 'D' },
        { text: 'Lógico', type: 'C' },
        { text: 'Apacible', type: 'S' }
      ]
    },
    2: {
      words: [
        { text: 'Cauteloso', type: 'C' },
        { text: 'Decidido', type: 'D' },
        { text: 'Receptivo', type: 'I' },
        { text: 'Bondadoso', type: 'S' }
      ]
    },
    3: {
      words: [
        { text: 'Amigable', type: 'I' },
        { text: 'Preciso', type: 'C' },
        { text: 'Franco', type: 'D' },
        { text: 'Tranquilo', type: 'S' }
      ]
    },
    4: {
      words: [
        { text: 'Elocuente', type: 'I' },
        { text: 'Controlado', type: 'C' },
        { text: 'Tolerante', type: 'S' },
        { text: 'Decisivo', type: 'D' }
      ]
    },
    5: {
      words: [
        { text: 'Atrevido', type: 'D' },
        { text: 'Concienzudo', type: 'C' },
        { text: 'Comunicativo', type: 'I' },
        { text: 'Moderado', type: 'S' }
      ]
    },
    6: {
      words: [
        { text: 'Ameno', type: 'S' },
        { text: 'Ingenioso', type: 'I' },
        { text: 'Investigador', type: 'C' },
        { text: 'Acepta riesgos', type: 'D' }
      ]
    },
    7: {
      words: [
        { text: 'Expresivo', type: 'I' },
        { text: 'Cuidadoso', type: 'C' },
        { text: 'Dominante', type: 'D' },
        { text: 'Sensible', type: 'S' }
      ]
    },
    8: {
      words: [
        { text: 'Extrovertido', type: 'I' },
        { text: 'Precavido', type: 'C' },
        { text: 'Constante', type: 'S' },
        { text: 'Impaciente', type: 'D' }
      ]
    },
    9: {
      words: [
        { text: 'Discreto', type: 'C' },
        { text: 'Complaciente', type: 'S' },
        { text: 'Encantador', type: 'I' },
        { text: 'Insistente', type: 'D' }
      ]
    },
    10: {
      words: [
        { text: 'Valeroso', type: 'D' },
        { text: 'Anima a los demás', type: 'I' },
        { text: 'Pacífico', type: 'S' },
        { text: 'Perfeccionista', type: 'C' }
      ]
    },
    11: {
      words: [
        { text: 'Reservado', type: 'C' },
        { text: 'Atento', type: 'S' },
        { text: 'Osado', type: 'D' },
        { text: 'Alegre', type: 'I' }
      ]
    },
    12: {
      words: [
        { text: 'Estimulante', type: 'I' },
        { text: 'Gentil', type: 'S' },
        { text: 'Perceptivo', type: 'C' },
        { text: 'Independiente', type: 'D' }
      ]
    },
    13: {
      words: [
        { text: 'Competitivo', type: 'D' },
        { text: 'Considerado', type: 'S' },
        { text: 'Alegre', type: 'I' },
        { text: 'Sagaz', type: 'C' }
      ]
    },
    14: {
      words: [
        { text: 'Meticuloso', type: 'C' },
        { text: 'Obediente', type: 'S' },
        { text: 'Ideas firmes', type: 'D' },
        { text: 'Alentador', type: 'I' }
      ]
    },
    15: {
      words: [
        { text: 'Popular', type: 'I' },
        { text: 'Reflexivo', type: 'C' },
        { text: 'Tenaz', type: 'D' },
        { text: 'Calmado', type: 'S' }
      ]
    },
    16: {
      words: [
        { text: 'Analítico', type: 'C' },
        { text: 'Audaz', type: 'D' },
        { text: 'Leal', type: 'S' },
        { text: 'Promotor', type: 'I' }
      ]
    },
    17: {
      words: [
        { text: 'Sociable', type: 'I' },
        { text: 'Paciente', type: 'S' },
        { text: 'Autosuficiente', type: 'D' },
        { text: 'Certero', type: 'C' }
      ]
    },
    18: {
      words: [
        { text: 'Adaptable', type: 'S' },
        { text: 'Resuelto', type: 'D' },
        { text: 'Prevenido', type: 'C' },
        { text: 'Vivaz', type: 'I' }
      ]
    },
    19: {
      words: [
        { text: 'Agresivo', type: 'D' },
        { text: 'Impetuoso', type: 'I' },
        { text: 'Amistoso', type: 'S' },
        { text: 'Discerniente', type: 'C' }
      ]
    },
    20: {
      words: [
        { text: 'De trato fácil', type: 'I' },
        { text: 'Compasivo', type: 'S' },
        { text: 'Cauto', type: 'C' },
        { text: 'Habla directo', type: 'D' }
      ]
    },
    21: {
      words: [
        { text: 'Evaluador', type: 'C' },
        { text: 'Generoso', type: 'S' },
        { text: 'Animado', type: 'I' },
        { text: 'Persistente', type: 'D' }
      ]
    },
    22: {
      words: [
        { text: 'Impulsivo', type: 'I' },
        { text: 'Cuida los detalles', type: 'C' },
        { text: 'Enérgico', type: 'D' },
        { text: 'Tranquilo', type: 'S' }
      ]
    },
    23: {
      words: [
        { text: 'Sociable', type: 'I' },
        { text: 'Sistemático', type: 'C' },
        { text: 'Vigoroso', type: 'D' },
        { text: 'Tolerante', type: 'S' }
      ]
    },
    24: {
      words: [
        { text: 'Cautivador', type: 'I' },
        { text: 'Contento', type: 'S' },
        { text: 'Exigente', type: 'D' },
        { text: 'Apegado a las normas', type: 'C' }
      ]
    },
    25: {
      words: [
        { text: 'Le agrada discutir', type: 'D' },
        { text: 'Metódico', type: 'C' },
        { text: 'Comedido', type: 'S' },
        { text: 'Desenvuelto', type: 'I' }
      ]
    },
    26: {
      words: [
        { text: 'Jovial', type: 'I' },
        { text: 'Preciso', type: 'C' },
        { text: 'Directo', type: 'D' },
        { text: 'Ecuánime', type: 'S' }
      ]
    },
    27: {
      words: [
        { text: 'Inquieto', type: 'D' },
        { text: 'Amable', type: 'S' },
        { text: 'Elocuente', type: 'I' },
        { text: 'Cuidadoso', type: 'C' }
      ]
    },
    28: {
      words: [
        { text: 'Prudente', type: 'C' },
        { text: 'Pionero', type: 'D' },
        { text: 'Espontáneo', type: 'I' },
        { text: 'Colaborador', type: 'S' }
      ]
    },
    // ... More groups with similar pattern
  };

  const handleAnswer = (groupNumber, type, word) => {
    console.log('Setting answer:', { groupNumber, type, word });
    setAnswers(prev => {
      const newAnswers = {
        ...prev,
        [groupNumber]: {
          ...prev[groupNumber],
          [type]: word
        }
      };
      console.log('New answers state:', newAnswers);
      return newAnswers;
    });
  };

  const isStepComplete = (step) => {
    return questionGroups[step].every(groupNum => 
      answers[groupNum]?.mas && answers[groupNum]?.menos
    );
  };

  const calculateResults = () => {
    const scores = {
      D: { plus: 0, minus: 0 },
      I: { plus: 0, minus: 0 },
      S: { plus: 0, minus: 0 },
      C: { plus: 0, minus: 0 }
    };

    Object.entries(answers).forEach(([groupNum, groupAnswers]) => {
      const question = questions[groupNum];
      if (!question) return;

      const masWord = question.words.find(w => w.text === groupAnswers.mas);
      if (masWord) {
        scores[masWord.type].plus += 1;
      }

      const menosWord = question.words.find(w => w.text === groupAnswers.menos);
      if (menosWord) {
        scores[menosWord.type].minus += 1;
      }
    });

    return {
      D: scores.D.plus - scores.D.minus || 0,
      I: scores.I.plus - scores.I.minus || 0,
      S: scores.S.plus - scores.S.minus || 0,
      C: scores.C.plus - scores.C.minus || 0
    };
  };

  const handleTestCompletion = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
  
      // Debug log the user object
      console.log('PersonalityTest user prop:', user);
  
      // Validate user object
      if (!user?.id) {
        console.error('Invalid user object:', user);
        throw new Error('User ID is required');
      }
  
      const results = calculateResults();
      console.log('Test results:', results);
      
      const response = await updatePersonalityTest(user.id, results);
  
      if (!response.error) {
        if (onComplete) {
          onComplete();
        }
        onClose();
      } else {
        setError(response.error);
      }
    } catch (error) {
      console.error('Error in handleTestCompletion:', error);
      setError('Hubo un error al guardar los resultados. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-y-auto pt-16">
      <div className="bg-white rounded-lg max-w-3xl w-full mx-4 my-2">
        <div className="flex justify-between items-center px-4 py-2 border-b">
          <h2 className="text-lg font-bold text-[#8B2332]">Test de Personalidad</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-full"
            disabled={isSubmitting}
          >
            <X className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        <div className="p-3">
          <div className="mb-3">
            <div className="flex items-center justify-center mb-2">
              <div className="w-full max-w-md bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#8B2332] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / 14) * 100}%` }}
                />
              </div>
            </div>
            <p className="text-center text-xs text-gray-600">
              Paso {currentStep} de 14
            </p>
          </div>

          {error && (
            <div className="mb-3 p-2 border border-red-300 rounded bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-3">
            {questionGroups[currentStep].map(groupNumber => (
              <div key={groupNumber} className="mb-3 p-3 border rounded-lg bg-white shadow-sm">
                <h3 className="text-sm font-semibold mb-2 text-[#8B2332]">Grupo {groupNumber}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border-r pr-4">
                    <h4 className="text-xs font-semibold mb-2 text-[#8B2332] uppercase">MÁS</h4>
                    <div className="space-y-1 bg-gray-50 p-2 rounded-lg">
                      {questions[groupNumber].words.map((word, idx) => (
                        <button
                          key={`mas-${idx}`}
                          onClick={() => handleAnswer(groupNumber, 'mas', word.text)}
                          className={`w-full text-left px-3 py-2 rounded transition-colors text-sm ${
                            answers[groupNumber]?.mas === word.text
                              ? 'bg-[#8B2332] text-white'
                              : 'text-gray-800 hover:bg-gray-100 active:bg-gray-200'
                          } ${answers[groupNumber]?.menos === word.text ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={answers[groupNumber]?.menos === word.text}
                        >
                          {word.text}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="pl-4">
                    <h4 className="text-xs font-semibold mb-2 text-[#8B2332] uppercase">MENOS</h4>
                    <div className="space-y-1 bg-gray-50 p-2 rounded-lg">
                      {questions[groupNumber].words.map((word, idx) => (
                        <button
                          key={`menos-${idx}`}
                          onClick={() => handleAnswer(groupNumber, 'menos', word.text)}
                          className={`w-full text-left px-3 py-2 rounded transition-colors text-sm ${
                            answers[groupNumber]?.menos === word.text
                              ? 'bg-[#8B2332] text-white'
                              : 'text-gray-800 hover:bg-gray-100 active:bg-gray-200'
                          } ${answers[groupNumber]?.mas === word.text ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={answers[groupNumber]?.mas === word.text}
                        >
                          {word.text}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-4">
            <button
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              className={`px-3 py-1.5 rounded text-sm ${
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
                if (currentStep === 14 && isStepComplete(14)) {
                  handleTestCompletion();
                } else if (isStepComplete(currentStep)) {
                  setCurrentStep(prev => Math.min(14, prev + 1));
                }
              }}
              className={`px-3 py-1.5 rounded text-sm ${
                isStepComplete(currentStep)
                  ? 'bg-[#8B2332] hover:bg-[#7a1e2b] text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!isStepComplete(currentStep) || isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : currentStep === 14 ? 'Completar' : 'Siguiente'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

PersonalityTest.defaultProps = {
  onComplete: () => {},
};

export default PersonalityTest;