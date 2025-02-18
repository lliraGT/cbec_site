// src/components/DonesTest.js
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { updateDonesTest } from '@/utils/userProgress';

const DonesTest = ({ isOpen, onClose, onComplete, user }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Questions per page - we'll show 8 questions per page for better UX
  const questionsPerPage = 8;
  const totalPages = Math.ceil(112 / questionsPerPage);

  const scoreLabels = {
    1: 'Casi nunca',
    2: 'Pocas veces',
    3: 'Algunas veces',
    4: 'Con frecuencia',
    5: 'Casi siempre'
  };

  // Map spiritual gifts to their corresponding questions based on the grid
  const giftQuestions = {
    evangelismo: [1, 17, 33, 49, 65, 81, 97],
    liderazgo: [2, 18, 34, 50, 66, 82, 98],
    misericordia: [3, 19, 35, 51, 67, 83, 99],
    administracion: [4, 20, 36, 52, 68, 84, 100],
    profecia: [5, 21, 37, 53, 69, 85, 101],
    dar: [6, 22, 38, 54, 70, 86, 102],
    ensenanza: [7, 23, 39, 55, 71, 87, 103],
    pastoreo: [8, 24, 40, 56, 72, 88, 104],
    fe: [9, 25, 41, 57, 73, 89, 105],
    exhortacion: [10, 26, 42, 58, 74, 90, 106],
    servicio: [11, 27, 43, 59, 75, 91, 107],
    ayuda: [12, 28, 44, 60, 76, 92, 108],
    sabiduria: [13, 29, 45, 61, 77, 93, 109],
    conocimiento: [14, 30, 46, 62, 78, 94, 110],
    hospitalidad: [15, 31, 47, 63, 79, 95, 111],
    discernimiento: [16, 32, 48, 64, 80, 96, 112]
  };

  // All questions from the test
  const questions = {
    1: "Siempre que escucho mensajes evangelísticos, oro con fervor por la gente presente que no conoce a Cristo.",
    2: "Me encantan las oportunidades de dirigir un grupo personas.",
    3: "Cuando otros me cuentan sus problemas, puedo sentir profundamente su dolor e identificarme con ellos.",
    4: "Tengo el don de organizar pasos de forma sistemática.",
    5: "Cuando veo una injusticia, no me puedo quedar callado.",
    6: "Disfruto regalar recursos económicos y materiales sin que el destinatario sepa quién se los dio.",
    7: "Puedo explicar eficaz y efectivamente las verdades de la Palabra de Dios.",
    8: "Me preocupan mucho los creyentes que se desvían de la fe, y trato activamente de traerlos de regreso.",
    9: "Para mí es fácil confiarle a Dios las cosas imposibles.",
    10: "Con frecuencia me descubro animando a quienes tienen problemas, consolando a los afligidos y apoyando a quienes dudan.",
    11: "Cuando alguien me pide hacer un trabajo, me emociono aunque no sea un trabajo muy visible a los demás.",
    12: "Acompañar a la gente y apoyarla en su ministerio me produce una gran satisfacción.",
    13: "Cuando descubro realidades bíblicas, las aplico de manera práctica y hábil a mis situaciones de vida.",
    14: "Percibo y entiendo muy fácilmente las verdades de la Palabra de Dios.",
    15: "Soy muy feliz entreteniendo invitados en la iglesia o en mi casa.",
    16: "La gente me dice que puedo percibir el engaño en una persona antes que los demás.",
    17: "Disfruto entablando relaciones y pasando tiempo con no cristianos.",
    18: "Los problemas de grupo me parecen más interesantes que los problemas individuales.",
    19: "Tiendo a ser compasivo con quienes son rechazados por otras personas.",
    20: "Planifico minuciosa, analítica y más que oportunamente los detalles de un evento.",
    21: "Cuando las personas o grupos se alejan de la Palabra de Dios, puedo sentir el peligro que se avecina, y estoy dispuesto a hacérselos saber.",
    22: "Estaría dispuesto a sacrificarme en lo material para que una mayor parte de mis recursos fueran a causas cristianas.",
    23: "Me molesta que un orador utilice un versículo de la Biblia fuera de contexto.",
    24: "Disfruto al relacionarme con un mismo grupo de creyentes durante un largo periodo.",
    25: "Puedo ver claramente la dirección de Dios en circunstancias insólitas, y esforzarme para lograr lo que creo que es su voluntad.",
    26: "Me gusta sugerir medidas prácticas para que la gente venza retos, pero me concentro en dedicar tiempo y esfuerzo a quienes actúan para seguir mis consejos.",
    27: "Disfruto haciendo tareas que los demás tienden a rechazar.",
    28: "Me ofrezco de voluntario para realizar tareas que parecen rutinarias, pero las hago con gusto porque sé que ayudan a otros a dirigir con mayor eficacia.",
    29: "Conozco, entiendo y aplico la Palabra de Dios al comunicarme con los demás.",
    30: "Disfruto estudiando la Biblia, investigando el significado profundo de un texto y explorando el contexto de palabras y frases específicas.",
    31: "Me han dicho que hago sentir bienvenidos a los invitados en mi casa, en la iglesia y en otros lugares.",
    32: "Al leer un libro, puedo detectar desvíos rotundos de la verdad bíblica.",
    33: "Contar a otras personas cómo llegué a aceptar a Cristo es una parte normal de mi estilo de vida.",
    34: "Dios me utiliza para motivar a los demás a ver Su visión para el grupo.",
    35: "La gente afligida y necesitada atrae mi atención y ocupa mi tiempo.",
    36: "Realizar varias tareas al mismo tiempo es algo que hago muy bien.",
    37: "Soy capaz de sacar a la luz el pecado aunque me vuelva impopular o nadie apoye mi convicción.",
    38: "Para mí es fácil hacer donativos más allá del diezmo para apoyar la obra de Dios.",
    39: "La gente me felicita por aclarar los temas difíciles y hacerlos fáciles de entender.",
    40: "Las tareas donde se me da la responsabilidad de asumir la supervisión espiritual de un grupo de gente atraen mi atención y ocupan mi tiempo.",
    41: "Confío a Dios en oración los obstáculos difíciles, y nunca me siento ansioso de que Él responda a mis oraciones.",
    42: "Mi forma favorita de enseñar y aprender es mediante la aplicación práctica y los ejemplos bíblicos.",
    43: "En un grupo, evalúo rápidamente las necesidades y no dudo en ayudar a satisfacerlas.",
    44: "Si sé que estamos ayudando a otras personas, disfruto lo que estoy haciendo aunque nadie más me dé reconocimiento.",
    45: "Capto las verdades de la Palabra de Dios, las organizo y las relaciono con necesidades y problemas prácticos de la vida.",
    46: "Cuando un orador da detalles sobre palabras, estudios o arqueología bíblica, suelo escuchar con muchísima atención.",
    47: "Creo que la casa de un cristiano debe ser un refugio para los necesitados.",
    48: "Puedo detectar cuando el ambiente de un servicio de adoración es pura emoción, en lugar de emoción dirigida por el Espíritu Santo.",
    49: "Puedo comunicar el evangelio de forma clara, concisa y eficaz a los no cristianos.",
    50: "Tengo la habilidad de inspirar y animar a otros a dar lo mejor de sí.",
    51: "No trato de decir a la gente lo que debe hacer para resolver sus problemas; sólo quiero estar disponible en sus momentos de necesidad.",
    52: "Puedo organizar y dirigir a la gente hacia metas específicas de una manera ordenada.",
    53: "La gente me dice que soy directo y aferrado a mis opiniones, especialmente en temas doctrinales.",
    54: "El reconocimiento público por hacer un donativo económico no es algo que disfrute.",
    55: "Investigo a fondo un tema antes de hablar de él.",
    56: "Me descubro trabajando arduamente para ayudar a otros a crecer espiritualmente.",
    57: "Por lo regular trato de motivar a los demás a creer en Dios en situaciones difíciles o imposibles.",
    58: "Realmente me identifico con los oradores que dan medidas prácticas para la aplicación de principios cristianos.",
    59: "Para ayudar a un ministerio, prefiero participar en proyectos orientados a la realización de tareas que trabajar con individuos.",
    60: "Prefiero servir en ministerios donde trabaje directamente con la gente que en proyectos orientados a tareas.",
    61: "Por lo regular pongo a trabajar mi conocimiento bíblico en mi vida diaria.",
    62: "La gente me dice que le ayudo a entender hechos importantes de las Escrituras.",
    63: "La gente me felicita porque reconozco a los invitados en la iglesia y permito que otras personas se queden en mi casa.",
    64: "Puedo detectar inmediatamente reuniones de iglesias que mezclan algunas verdades con muchas falsas enseñanzas.",
    65: "Creo que la mayoría de las iglesias no enfatizan el evangelismo tanto como deberían.",
    66: "Cuando se trata de metas, puedo combinar a la gente y los recursos adecuados para lograr el éxito.",
    67: "Es difícil para mí decir «no» a quienes sufren y están necesitados.",
    68: "Las oportunidades de servicio voluntario que yo busco tienen que ver con la organización del panorama general y su desglose en partes pequeñas con las que se pueda trabajar.",
    69: "Considero que la participación de los cristianos en muchas actividades es una cuestión de blanco o negro, bueno o malo.",
    70: "Prefiero donar recursos económicos que mi tiempo a la obra del Señor.",
    71: "Disfruto enseñando verdades bíblicas a los demás para que las apliquen.",
    72: "Dios me ha usado para traer a los cristianos desviados de vuelta al Señor y a una relación creciente con Él y con su pueblo.",
    73: "Me considero optimista aún en situaciones negativas.",
    74: "Lograr la participación de la gente en el ministerio mediante una motivación positiva es algo que hago con eficacia.",
    75: "Necesito sentirme apreciado por mi contribución a un ministerio.",
    76: "Prefiero trabajar detrás de escena, sin reconocimiento público.",
    77: "Utilizar el discernimiento espiritual para conocer lo bueno o malo de situaciones complicadas es algo que hago bien.",
    78: "Ayudo a los demás a estudiar la Biblia compartiéndoles mis descubrimientos sobre cómo varios detalles (por ejemplo, palabras y frases) se relacionan con la idea principal del pasaje.",
    79: "Considero un privilegio entretener invitados en la iglesia o en mi casa, y me gusta ocuparme de satisfacer sus necesidades (por ejemplo, proveerles alimentación y transporte).",
    80: "Generalmente me doy cuenta cuando los demás son deshonestos en sus acciones o motivaciones.",
    81: "Me emociono muchísimo cuando alguien llega a conocer a Cristo.",
    82: "La gente suele venir a mí en busca de dirección cuando no hay un líder claramente definido en el grupo.",
    83: "Cuando me entero de que alguien tiene una necesidad me siento impulsado a hacer algo al respecto.",
    84: "Me esfuerzo por fomentar la armonía cuando estoy a cargo de la planeación de un evento.",
    85: "Quienes hablan francamente atraen mi atención y ocupan mi tiempo.",
    86: "Creo que la transparencia en el uso de los recursos financieros es de vital importancia.",
    87: "No importa que otros compromisos tenga, siempre me doy tiempo para estudiar la Biblia.",
    88: "Cuando se trata de ocuparse de las necesidades de los demás, sacrifico sin pensarlo dos veces mis propias necesidades y deseos.",
    89: "Con frecuencia le llamo la atención a otros cristianos por su falta de fe.",
    90: "Quienes necesitan aliento después de una decepción atraen mi atención y ocupan mi tiempo.",
    91: "Cuando es evidente que la gente ve una necesidad y no se ofrece a ayudar a satisfacerla, me enojo.",
    92: "Me parece gratificante asumir las responsabilidades de otras personas para que puedan concentrarse libremente en otros aspectos del ministerio.",
    93: "Me parece fácil discernir cosas a partir de mi propio estudio de las Escrituras y de los estudios de los expertos en la Biblia.",
    94: "La gente suele buscarme porque comprendo los pasajes bíblicos que le interesan.",
    95: "Yo sería el primero en apoyar a una iglesia que ofreciera alojamiento a grupos que estuvieran provisionalmente en la ciudad y necesitaran un lugar donde quedarse durante una o dos noches.",
    96: "Reconozco rápidamente las incongruencias y errores en la enseñanza bíblica.",
    97: "Me siento con mucha energía después de compartir a Cristo con un no cristiano.",
    98: "Me gustan lanzar nuevos proyectos pero me aburre darles seguimiento detallado.",
    99: "Yo trabajo como voluntario para ayudar a los pobres y desfavorecidos.",
    100: "Puedo detectar y eliminar detalles innecesarios en la organización de gente o proyectos.",
    101: "Tiendo a desconfiar de la cultura contemporánea y a criticarla.",
    102: "No tengo motivos ocultos ni agenda secreta para donar dinero.",
    103: "Me inclino más por explicar las verdades bíblicas que por aplicarlas.",
    104: "Siempre que tengo cristianos bajo mi cuidado e influencia, los protejo contra las falsas enseñanzas.",
    105: "Cuando creo firmemente que Dios quiere lograr grandes cosas en un grupo, suelo ser quien anima a la gente a dar un salto de fe y a no ser tan precavida.",
    106: "Considero las pruebas como oportunidades mandadas por Dios para mi crecimiento espiritual.",
    107: "No me siento a gusto dirigiendo o delegando tareas dentro de un ministerio.",
    108: "Varios líderes me han reclutado porque identifican que les seré de gran apoyo y lo disfruto mucho.",
    109: "La gente me busca para buscar consejo y guía cuando se les presenta un dilema.",
    110: "Si alguien tiene una pregunta sobre un pasaje de la Biblia y no tengo la respuesta, lo investigo a fondo aunque no sea mi responsabilidad.",
    111: "Mi casa está bien acondicionada para recibir visitas y mi familia o mis amigos siempre la escogen como el lugar central de reunión.",
    112: "Soy bueno al escoger la persona correcta para el puesto ideal. Juzgo bien el carácter de las personas."
  };

  const getQuestionsForPage = (page) => {
    const startIndex = (page - 1) * questionsPerPage;
    const endIndex = startIndex + questionsPerPage;
    const questions = [];
    
    for (let i = startIndex + 1; i <= endIndex && i <= 112; i++) {
      questions.push(i);
    }
    
    return questions;
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
    const scores = {};
    
    // Initialize scores for each gift
    Object.keys(giftQuestions).forEach(gift => {
      scores[gift] = 0;
    });

    // Calculate total score for each gift
    Object.entries(answers).forEach(([question, score]) => {
      Object.entries(giftQuestions).forEach(([gift, questions]) => {
        if (questions.includes(Number(question))) {
          scores[gift] += score;
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
      const response = await updateDonesTest(user.id, results);

      if (response.error) {
        setError(response.error);
        return;
      }

      if (onComplete) {
        onComplete();
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
        <h2 className="text-lg font-bold text-[#8B2332]">Test de Dones Espirituales</h2>
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
                A cada persona se le da uno o varios dones espirituales al momento de aceptar a Cristo. Esta 
                evaluación puede guiarte en el proceso de identificarlos. Responde a cada pregunta usando la 
                escala provista, <span className="font-medium">evitando lo más posible la respuesta "Algunas veces"</span>.
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
                if (currentStep === totalPages && isStepComplete(totalPages)) {
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

DonesTest.defaultProps = {
  onComplete: () => {},
};

export default DonesTest;