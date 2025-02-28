import React, { useState } from 'react';
import { X } from 'lucide-react';
import { updateSkillsTest } from '@/utils/userProgress';

const SkillsTest = ({ isOpen, onClose, onComplete, user }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Questions per page - showing 8 questions per page for consistency with DonesTest
  const questionsPerPage = 8;
  const totalQuestions = 42;
  const totalPages = Math.ceil(totalQuestions / questionsPerPage);

  const scoreLabels = {
    1: 'Casi nunca',
    2: 'Rara vez',
    3: 'A veces',
    4: 'Con frecuencia',
    5: 'Casi siempre'
  };

  // Skills categories mapping
  const skillCategories = {
    R: {
      name: 'Realista',
      questions: [1, 7, 13, 19, 25, 31, 37]
    },
    I: {
      name: 'Investigador',
      questions: [2, 8, 14, 20, 26, 32, 38]
    },
    A: {
      name: 'Artístico',
      questions: [3, 9, 15, 21, 27, 33, 39]
    },
    S: {
      name: 'Sociable',
      questions: [4, 10, 16, 22, 28, 34, 40]
    },
    E: {
      name: 'Emprendedor',
      questions: [5, 11, 17, 23, 29, 35, 41]
    },
    C: {
      name: 'Convencional',
      questions: [6, 12, 18, 24, 30, 36, 42]
    }
  };

  // All questions from the test
  const questions = {
    1: "Prefiero trabajar con cosas en vez de trabajar con personas.",
    2: "Soy capaz de reconocer la naturaleza del problema a resolver, y luego encontrar soluciones.",
    3: "Prefiero las ocupaciones y pasatiempos relacionados con el arte, la música, la escritura, la publicidad, el diseño gráfico, la administración, etc.",
    4: "Soy capaz de manipular a la gente e influir en el resultado de las situaciones.",
    5: "Puedo dirigir el comportamiento de los demás y ser visto como el líder.",
    6: "Soy capaz de enseñar y capacitar a otras personas de forma muy metódica y paciente.",
    7: "Generalmente prefiero trabajar con las manos.",
    8: "Disfruto formulando y desarrollando ideas abstractas que requieran razonamiento analítico y creativo.",
    9: "Puedo crear ideas de la nada o recrearlas a partir del trabajo de otras personas y hacerlas funcionar.",
    10: "Tengo olfato para saber qué hacer y cómo hacerlo.",
    11: "Soy capaz de ver y desarrollar soluciones creativas a los problemas.",
    12: "Prefiero las oportunidades o tareas relacionadas con la contabilidad, las computadoras, el trabajo de oficina y el manejo de datos.",
    13: "Me atraen las actividades difíciles, prácticas y que requieran el uso de la fuerza.",
    14: "Prefiero trabajar en situaciones desestructuradas y sin muchas reglas.",
    15: "Soy capaz de comunicarme con claridad y creatividad tanto oralmente como por escrito.",
    16: "Prefiero estar en el centro de un grupo, no en la periferia y prefiero resolver problemas discutiéndolos con los demás.",
    17: "Con frecuencia prefiero sacrificar mis necesidades personales o individuales por el bien del grupo.",
    18: "Puedo lograr altos niveles de concentración y competencia para detectar los cambios necesarios.",
    19: "Encuentro mi mejor lugar donde puedo hacer tareas físicas o mecánicas.",
    20: "Soy más productivo en tareas que requieran poca dirección de parte de otras personas.",
    21: "Soy experto en el uso de la imaginación y la percepción precisa para la solución de problemas.",
    22: "Soy capaz de percibir que una situación o tarea requiere la participación de otras personas.",
    23: "Estoy dispuesto a tomar decisiones y riesgos, aunque pueda fallar en lo personal.",
    24: "Prefiero las tareas y oportunidades donde se valore mucho la confiabilidad y la precisión.",
    25: "Puedo mantener equilibradas mis emociones y manejar los problemas con pragmatismo.",
    26: "Me atraen las oportunidades de investigar asuntos complejos y ponerlos en términos entendibles para su aplicación.",
    27: "Me desempeño mejor en ambientes no estructurados donde se validen y retroalimenten las contribuciones.",
    28: "Estoy consciente de los sentimientos de los demás, entiendo sus comportamientos y reacciono adecuadamente.",
    29: "Prefiero estar en puestos de liderazgo muy visibles y competitivos.",
    30: "Prefiero las actividades muy ordenadas y donde haya una cadena de mando bien definida.",
    31: "Tiendo a ser muy predecible.",
    32: "Puedo ser analítico, reflexivo y flexible a la hora de descubrir nuevos enfoques para métodos ineficaces.",
    33: "Prefiero trabajar solo o con poca compañía.",
    34: "Tengo habilidad para presentarme tanto con expresiones no verbales como oralmente.",
    35: "Soy capaz de aceptar a las autoridades, así como de convertirme en una de ellas.",
    36: "Puedo trabajar con números y datos y organizarlos de forma estructurada.",
    37: "Soy capaz de entender cómo funcionan las cosas y luego traducirlas en acciones prácticas y concretas.",
    38: "Soy experto en crear sistemas que funcionen de maravilla y sean fáciles de entender y utilizar.",
    39: "Puedo expresarme artísticamente con una estética atractiva y una combinación de colores y modelos de buen gusto.",
    40: "Soy capaz de mostrar empatía y compasión con palabras y hechos.",
    41: "Puedo mezclar gente y proyectos mediante una planeación eficaz y un diagnóstico experto.",
    42: "Prefiero las tareas convencionales, estables, bien controladas donde todos los involucrados sigan las reglas."
  };

  const getQuestionsForPage = (page) => {
    const startIndex = (page - 1) * questionsPerPage;
    const endIndex = startIndex + questionsPerPage;
    const pageQuestions = [];
    
    for (let i = startIndex + 1; i <= endIndex && i <= totalQuestions; i++) {
      pageQuestions.push(i);
    }
    
    return pageQuestions;
  };

  const handleAnswer = (questionNumber, score) => {
    setAnswers(prev => ({
      ...prev,
      [questionNumber]: score
    }));
  };

  const isStepComplete = (step) => {
    const questions = getQuestionsForPage(step);
    return questions.every(q => answers[q] !== undefined);
  };

  const calculateResults = () => {
    const scores = {
      R: 0, // Realista
      I: 0, // Investigador
      A: 0, // Artístico
      S: 0, // Sociable
      E: 0, // Emprendedor
      C: 0  // Convencional
    };
    
    Object.entries(answers).forEach(([question, score]) => {
      const questionNum = parseInt(question);
      Object.entries(skillCategories).forEach(([category, data]) => {
        if (data.questions.includes(questionNum)) {
          scores[category] += score;
        }
      });
    });

    return scores;
  };

  const handleTestCompletion = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
  
      if (!user?.id) {
        setError('User ID is required');
        return;
      }
  
      const results = calculateResults();
      
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
            testType: 'habilidades',
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
  
      // Regular user path
      const response = await updateSkillsTest(user.id, results);
  
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-start justify-center overflow-y-auto">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 my-24">
        <div className="flex justify-between items-center px-4 py-2 border-b">
          <h2 className="text-lg font-bold text-[#8B2332]">Evaluación de Habilidades</h2>
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
                  style={{ width: `${(currentStep / totalPages) * 100}%` }}
                />
              </div>
            </div>
            <p className="text-center text-xs text-gray-600">
              Página {currentStep} de {totalPages}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-2 border border-red-300 rounded bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Instructions (only on first page) */}
          {currentStep === 1 && (
            <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-xl font-bold text-[#8B2332] mb-4">INSTRUCCIONES:</h3>
              <p className="text-md leading-relaxed text-gray-700">
                Cada persona tiene cierto tipo de habilidades naturales que le hacen tender hacia ciertas áreas
                en sus pasatiempos, carrera y ministerio. Esta evaluación puede ayudarte a identificar tus habilidades.
                Responde a cada pregunta usando la escala provista, <span className="font-medium">evitando lo más posible
                la respuesta "A veces"</span>.
              </p>
            </div>
          )}

          {/* Questions */}
          <div className="space-y-6">
            {getQuestionsForPage(currentStep).map(questionNumber => (
              <div key={questionNumber} className="p-4 border rounded-lg bg-white shadow-sm">
                <h3 className="text-sm font-semibold mb-3 text-[#8B2332]">
                  {questionNumber}. {questions[questionNumber]}
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  {Object.entries(scoreLabels).map(([score, label]) => (
                    <button
                      key={score}
                      onClick={() => handleAnswer(questionNumber, Number(score))}
                      className={`p-2 text-sm rounded transition-colors ${
                        answers[questionNumber] === Number(score)
                          ? 'bg-[#8B2332] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

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
                if (currentStep === totalPages && isStepComplete(currentStep)) {
                  handleTestCompletion();
                } else if (isStepComplete(currentStep)) {
                  setCurrentStep(prev => Math.min(totalPages, prev + 1));
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
                : currentStep === totalPages 
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

SkillsTest.defaultProps = {
  onComplete: () => {},
};

export default SkillsTest;