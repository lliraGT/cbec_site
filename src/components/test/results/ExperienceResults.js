import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const ExperienceResults = ({ results }) => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [processedResults, setProcessedResults] = useState(null);

  // Process and normalize results on mount
  useEffect(() => {
    console.log('Processing experience results:', results);
    
    // Create a normalized version of results with fallbacks for missing data
    const normalized = {
      experienceTypes: results?.experienceTypes || [],
      significantEvents: results?.significantEvents || [],
      positiveExperiences: results?.positiveExperiences || [],
      painfulExperiences: results?.painfulExperiences || [],
      lessonsLearned: results?.lessonsLearned || '',
      impactOnMinistry: results?.impactOnMinistry || '',
      topTwoExperiences: results?.topTwoExperiences || []
    };
    
    setProcessedResults(normalized);
  }, [results]);

  if (!processedResults) {
    return <div className="text-center p-4">Cargando resultados...</div>;
  }

  // Experience type labels
  const experienceTypeLabels = {
    spiritual: 'Espirituales',
    religious: 'Religiosas Educativas',
    painful: 'Dolorosas',
    failure: 'De Fracaso',
    victory: 'De Victoria'
  };

  // Experience type descriptions
  const experienceTypeDescriptions = {
    spiritual: 'Estas experiencias ocurren principalmente dentro del corazón, la mente, y el espíritu. Son personales e íntimas y se alinean con las Escrituras.',
    religious: 'Estas experiencias ofrecen oportunidades para influenciar y proveen credibilidad con los demás. Pueden ser educativas y formativas tanto para ti como para otros.',
    painful: 'Estas experiencias difíciles te permiten identificarte y consolar a otros que pasan por situaciones similares, creando empatía y comprensión profunda.',
    failure: 'Experiencias donde las cosas no salieron como esperabas, pero que pueden ser el punto de partida de nuevos comienzos y crecimiento personal.',
    victory: 'Experiencias gratificantes y agradables que proveen motivación para enfrentar desafíos futuros con confianza y esperanza.'
  };

  // Biblical references for each experience type
  const biblicalReferences = {
    spiritual: {
      reference: '1 Samuel 3:1-21, Hechos 9:1-18',
      figures: 'Samuel y Pablo',
      lesson: 'La experiencia de Samuel revela que no siempre es inmediatamente evidente lo que Dios desea que uno haga; mientras que la experiencia de Pablo con Dios fue de rápida dirección.'
    },
    religious: {
      reference: 'Hechos 26:4-5, Hechos 17:16-34',
      figures: 'Pablo',
      lesson: 'La educación religiosa de Pablo le permitió enseñar a los judíos cristianos el plan de salvación de Dios para los gentiles. También pudo dirigirse a personas profesantes de otras religiones y razonar con ellas porque entendía cómo pensaban.'
    },
    painful: {
      reference: '2 Corintios 1:3-5, Hebreos 2:17-18, Hebreos 5:8',
      figures: 'Cristo',
      lesson: 'Las dificultades de Jesús y Sus experiencias dolorosas le permitieron compadecerse de otros y demostrar Su obediencia al Padre.'
    },
    failure: {
      reference: 'Mateo 26:69-75, Hechos 2:36',
      figures: 'Pedro',
      lesson: 'La experiencia de fracaso de Pedro muy probablemente fue producto del miedo. Él se sobrepuso a su fracaso y le hizo más atrevido y confiado a medida que proclamaba a Jesús el Hijo de Dios.'
    },
    victory: {
      reference: 'Génesis 32:28',
      figures: 'Jacob',
      lesson: 'La experiencia de Jacob no fue agradable, pero tuvo un tremendo impacto en toda una nación que fue bautizada con su nombre debido a su experiencia con Dios.'
    }
  };

  // Check if we have top experiences
  const hasTopExperiences = processedResults.topTwoExperiences && 
                            Array.isArray(processedResults.topTwoExperiences) && 
                            processedResults.topTwoExperiences.length > 0;
  
  return (
    <div className="max-w-[90rem] mx-auto space-y-8 px-4">
      {/* Summary Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-[#8B2332] mb-4">
          Resumen de tus Experiencias
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Las experiencias de vida son eventos significativos que Dios utiliza para moldearnos y prepararnos 
          para su servicio. Como dice Romanos 8:28, "Dios dispone todas las cosas para el bien de quienes 
          lo aman, los que han sido llamados de acuerdo con su propósito."
        </p>
        
        {hasTopExperiences ? (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-[#8B2332] mb-3">
              Tus experiencias más significativas:
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {processedResults.topTwoExperiences.map((experience, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg border">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#8B2332] text-white font-bold">
                      {index + 1}
                    </span>
                    <h4 className="text-lg font-semibold text-gray-900">{experience}</h4>
                  </div>
                  <p className="text-gray-700">
                    {index === 0 ? (
                      'Esta experiencia fundamental ha moldeado significativamente tu visión del mundo y tu acercamiento al ministerio.'
                    ) : (
                      'Esta experiencia crucial ha contribuido a formar tu carácter y perspectiva única para el servicio.'
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-100">
            <p className="text-amber-800">
              No se encontraron experiencias significativas. Si ya completaste el test, intenta reiniciarlo para seleccionar tus dos experiencias más importantes.
            </p>
          </div>
        )}
      </div>

      {/* Experience Types Section */}
      <div className="bg-white rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-[#8B2332] p-6 border-b">
          Tipos de Experiencias que te han Formado
        </h3>
        <div className="divide-y">
          {processedResults.experienceTypes && processedResults.experienceTypes.length > 0 ? (
            processedResults.experienceTypes.map(type => (
              <div key={type} className="p-6">
                <button
                  onClick={() => setExpandedSection(expandedSection === type ? null : type)}
                  className="w-full"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-gray-900">{experienceTypeLabels[type] || type}</h4>
                    {expandedSection === type ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </button>
                
                {expandedSection === type && (
                  <div className="mt-4 space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="text-[#8B2332] font-semibold mb-2">Descripción:</h5>
                      <p className="text-gray-700">
                        {experienceTypeDescriptions[type] || 'Descripción no disponible'}
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="text-[#8B2332] font-semibold mb-2">Ejemplo Bíblico:</h5>
                      {biblicalReferences[type] ? (
                        <>
                          <p className="text-gray-700">
                            <span className="font-medium">{biblicalReferences[type].figures}</span> - {biblicalReferences[type].reference}
                          </p>
                          <p className="text-gray-700 mt-2">
                            {biblicalReferences[type].lesson}
                          </p>
                        </>
                      ) : (
                        <p className="text-gray-700">Ejemplo bíblico no disponible</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-6 text-gray-500 italic text-center">
              No se han seleccionado tipos de experiencias.
            </div>
          )}
        </div>
      </div>

      {/* Lessons Learned Section */}
      {processedResults.lessonsLearned ? (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-[#8B2332] mb-4">
            Lecciones Aprendidas
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 italic">"{processedResults.lessonsLearned}"</p>
          </div>
          <div className="mt-4">
            <p className="text-gray-700">
              Estas lecciones que has identificado son valiosas no solo para tu crecimiento personal, sino 
              también como herramientas para ministrar a otros que atraviesan circunstancias similares.
            </p>
            <p className="text-gray-700 mt-2">
              "...para que con el mismo consuelo que de Dios hemos recibido, también nosotros 
              podamos consolar a todos los que sufren." (2 Corintios 1:4)
            </p>
          </div>
        </div>
      ) : null}

      {/* Ministry Impact Section */}
      {processedResults.impactOnMinistry ? (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-[#8B2332] mb-4">
            Impacto en tu Ministerio
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 italic">"{processedResults.impactOnMinistry}"</p>
          </div>
          <div className="mt-4">
            <p className="text-gray-700">
              El modo en que tus experiencias han moldeado tu pasión por ciertos ministerios o personas 
              es una clara indicación de cómo Dios está obrando en tu vida para equiparte específicamente 
              para su obra.
            </p>
          </div>
        </div>
      ) : null}

      {/* Application Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-[#8B2332] mb-4">
          Pasos para Maximizar tus Experiencias
        </h3>
        <ul className="space-y-4">
          <li className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-[#8B2332] text-white rounded-full flex items-center justify-center mr-3 mt-0.5">1</span>
            <div>
              <p className="font-medium">Sé honesto y objetivo</p>
              <p className="text-gray-600 text-sm">Evalúa tus experiencias con sinceridad, reconociendo tanto los éxitos como los fracasos.</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-[#8B2332] text-white rounded-full flex items-center justify-center mr-3 mt-0.5">2</span>
            <div>
              <p className="font-medium">Celebra que sobreviviste y creciste</p>
              <p className="text-gray-600 text-sm">Reconoce el valor de haber superado circunstancias difíciles y el crecimiento que obtuviste.</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-[#8B2332] text-white rounded-full flex items-center justify-center mr-3 mt-0.5">3</span>
            <div>
              <p className="font-medium">Identifica cualquier lección aprendida</p>
              <p className="text-gray-600 text-sm">Reflexiona sobre las enseñanzas específicas que cada experiencia te ha dejado.</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-[#8B2332] text-white rounded-full flex items-center justify-center mr-3 mt-0.5">4</span>
            <div>
              <p className="font-medium">Convierte el desorden en éxito</p>
              <p className="text-gray-600 text-sm">Transforma incluso las experiencias caóticas o negativas en oportunidades de crecimiento.</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-[#8B2332] text-white rounded-full flex items-center justify-center mr-3 mt-0.5">5</span>
            <div>
              <p className="font-medium">Comparte tu historia</p>
              <p className="text-gray-600 text-sm">Tu testimonio puede ser poderoso para ayudar, inspirar y guiar a otros en situaciones similares.</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-[#8B2332] text-white rounded-full flex items-center justify-center mr-3 mt-0.5">6</span>
            <div>
              <p className="font-medium">Fija una nueva meta y sigue adelante</p>
              <p className="text-gray-600 text-sm">Utiliza el conocimiento adquirido para establecer objetivos futuros en tu camino de servicio.</p>
            </div>
          </li>
        </ul>
      </div>

      {/* Quote Section */}
      <div className="bg-gray-50 p-8 rounded-lg shadow-sm text-center italic">
        <p className="text-lg text-gray-700">
          "Dios, ¿cómo pudiste permitir que me sucediera esto? [...] Ahora lo entiendo! Sé que me has preparado para un ministerio muy especial, uno que me lleva a los heridos, los necesitados y avergonzados de lo que sus vidas se han vuelto."
        </p>
        <p className="mt-2 text-[#8B2332] font-medium">– Jeri Todaro</p>
      </div>
    </div>
  );
};

export default ExperienceResults;