import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Download, Share } from 'lucide-react';

const GlobalResultsOverview = ({ userTests = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Check if user has completed any tests
  const hasCompletedTests = Array.isArray(userTests) 
    ? userTests.some(test => test?.status === 'completado')
    : false;
  
  // Safely get test data with fallback to empty object
  const getTestData = (slug) => {
    if (!Array.isArray(userTests)) return { status: 'pendiente', results: {} };
    const test = userTests.find(t => t?.slug === slug) || { status: 'pendiente', results: {} };
    return test;
  };

  // Get personality results
  const personalityTest = getTestData('personalidad');
  const personalityResults = personalityTest.results || {};
  
  // Get top personality traits (sorted by highest score)
  const personalityTraits = personalityResults && Object.keys(personalityResults).length > 0
    ? Object.entries(personalityResults)
        .sort(([, a], [, b]) => (b || 0) - (a || 0))
        .slice(0, 3)
        .map(([type]) => type)
    : [];

  // Get spiritual gifts results
  const donesTest = getTestData('dones');
  const donesResults = donesTest.results || {};
  
  // Get top spiritual gifts (sorted by highest score)
  const topDones = donesResults && Object.keys(donesResults).length > 0
    ? Object.entries(donesResults)
        .sort(([, a], [, b]) => (b || 0) - (a || 0))
        .slice(0, 5)
        .map(([gift]) => {
          const giftLabels = {
            evangelismo: 'Evangelismo',
            liderazgo: 'Liderazgo',
            misericordia: 'Misericordia',
            administracion: 'Administración',
            profecia: 'Profecía',
            dar: 'Dar',
            ensenanza: 'Enseñanza',
            pastoreo: 'Pastoreo',
            fe: 'Fe',
            exhortacion: 'Exhortación',
            servicio: 'Servicio',
            ayuda: 'Ayuda',
            sabiduria: 'Sabiduría',
            conocimiento: 'Conocimiento',
            hospitalidad: 'Hospitalidad',
            discernimiento: 'Discernimiento'
          };
          return giftLabels[gift] || gift;
        })
    : [];

  // Get skills results
  const skillsTest = getTestData('habilidades');
  const skillsResults = skillsTest.results || {};
  
  // Get top skills (sorted by highest score)
  const topSkills = skillsResults && Object.keys(skillsResults).length > 0
    ? Object.entries(skillsResults)
        .sort(([, a], [, b]) => (b || 0) - (a || 0))
        .slice(0, 3)
        .map(([category]) => {
          const categoryLabels = {
            R: 'Realista',
            I: 'Investigador',
            A: 'Artístico',
            S: 'Sociable',
            E: 'Emprendedor',
            C: 'Convencional'
          };
          return categoryLabels[category] || category;
        })
    : [];

  // Get passion results
  const passionTest = getTestData('pasion');
  const passionResults = passionTest.results || {};
  
  // Get passion groups and types
  const passionGroups = passionResults?.topFiveGroups || [];
  const passionTypes = passionResults?.topThreePassions || [];
  
  // Get experience results
  const experienceTest = getTestData('experiencia');
  const experienceResults = experienceTest.results || {};
  
  // Get top experiences and lessons
  const topExperiences = experienceResults?.topTwoExperiences || [];
  const lessonsLearned = experienceResults?.lessonsLearned || '';
  const impactOnMinistry = experienceResults?.impactOnMinistry || '';

  // Calculate completion percentage
  const completedTests = Array.isArray(userTests) 
    ? userTests.filter(test => test?.status === 'completado').length 
    : 0;
  const completionPercentage = Array.isArray(userTests) 
    ? (completedTests / userTests.length) * 100 
    : 0;

  // Render loading or empty state if no tests
  if (!Array.isArray(userTests) || userTests.length === 0) {
    return (
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-[#8B2332] mb-4">Resumen de Resultados</h2>
        <p className="text-gray-600">No hay tests disponibles. Por favor, complete los tests para ver su resumen de resultados.</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div 
          className="w-full flex justify-between items-center p-6 text-left cursor-pointer" 
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div>
            <h2 className="text-xl font-bold text-[#8B2332]">Cuadro de Resultados</h2>
            <p className="text-sm text-gray-600 mt-1">Progreso: {Math.round(completionPercentage)}% completado</p>
          </div>
          <div className="flex items-center space-x-2">
            <div 
              onClick={(e) => {
                e.stopPropagation();
                alert('Función de descarga próximamente disponible');
              }} 
              className="p-2 text-gray-500 hover:text-[#8B2332] hover:bg-gray-100 rounded-full cursor-pointer"
              title="Descargar"
            >
              <Download size={20} />
            </div>
            <div 
              onClick={(e) => {
                e.stopPropagation();
                alert('Función de compartir próximamente disponible');
              }} 
              className="p-2 text-gray-500 hover:text-[#8B2332] hover:bg-gray-100 rounded-full cursor-pointer"
              title="Compartir"
            >
              <Share size={20} />
            </div>
            {isExpanded ? (
              <ChevronUp className="h-6 w-6 text-gray-500" />
            ) : (
              <ChevronDown className="h-6 w-6 text-gray-500" />
            )}
          </div>
        </div>

        {isExpanded && (
          <div className="p-6 border-t">
            <div className="grid md:grid-cols-5 gap-4 text-center">
              {/* Personality Column */}
              <div className="bg-gradient-to-b from-[#f0f4f8] to-[#e6eef5] rounded-lg p-4 border border-[#d1e0ec] shadow-sm">
                <h3 className="font-bold text-[#8B2332] mb-3">Personalidad</h3>
                {personalityTest.status === 'completado' ? (
                  <div className="space-y-2">
                    {personalityTraits.map((type, index) => (
                      <div 
                        key={index} 
                        className="bg-white p-2 rounded shadow-sm border border-[#b8c6d6] text-[#2c3e50]"
                      >
                        <span className="font-semibold">{type}</span>
                      </div>
                    ))}
                    <div className="text-xs text-gray-600 mt-2">
                      Primaria: {personalityTraits[0] || ''}
                      <br />
                      Secundaria: {personalityTraits[1] || ''}
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-400 italic">Pendiente</div>
                )}
              </div>

              {/* Spiritual Gifts Column */}
              <div className="bg-gradient-to-b from-[#f0f4f8] to-[#e6eef5] rounded-lg p-4 border border-[#d1e0ec] shadow-sm">
                <h3 className="font-bold text-[#8B2332] mb-3">Dones espirituales</h3>
                {donesTest.status === 'completado' ? (
                  <div className="space-y-2">
                    {topDones.map((gift, index) => (
                      <div 
                        key={index} 
                        className="bg-white p-2 rounded shadow-sm border border-[#b8c6d6] text-[#2c3e50]"
                      >
                        <span className="font-semibold">{index + 1}. {gift}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400 italic">Pendiente</div>
                )}
              </div>

              {/* Skills Column */}
              <div className="bg-gradient-to-b from-[#f0f4f8] to-[#e6eef5] rounded-lg p-4 border border-[#d1e0ec] shadow-sm">
                <h3 className="font-bold text-[#8B2332] mb-3">Habilidades</h3>
                {skillsTest.status === 'completado' ? (
                  <div className="space-y-2">
                    {topSkills.map((skill, index) => (
                      <div 
                        key={index} 
                        className="bg-white p-2 rounded shadow-sm border border-[#b8c6d6] text-[#2c3e50]"
                      >
                        <span className="font-semibold">{index + 1}. {skill}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400 italic">Pendiente</div>
                )}
              </div>

              {/* Passion Column */}
              <div className="bg-gradient-to-b from-[#f0f4f8] to-[#e6eef5] rounded-lg p-4 border border-[#d1e0ec] shadow-sm">
                <h3 className="font-bold text-[#8B2332] mb-3">Pasión</h3>
                {passionTest.status === 'completado' ? (
                  <div className="space-y-2">
                    <div className="bg-white p-2 rounded shadow-sm border border-[#b8c6d6]">
                      <span className="font-semibold text-[#2c3e50]">Grupos que me apasionan:</span>
                      <div className="text-xs mt-1 text-[#4a5568]">
                        {passionGroups.slice(0, 2).map((group, i) => (
                          <div key={i} className="mb-1">{i + 1}. {group}</div>
                        ))}
                        {passionGroups.length > 2 && (
                          <div className="text-gray-500">+{passionGroups.length - 2} más</div>
                        )}
                      </div>
                    </div>
                    <div className="bg-white p-2 rounded shadow-sm border border-[#b8c6d6]">
                      <span className="font-semibold text-[#2c3e50]">Formas de expresión:</span>
                      <div className="text-xs mt-1 text-[#4a5568]">
                        {passionTypes.map((type, i) => (
                          <div key={i} className="mb-1">{i + 1}. {type}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-400 italic">Pendiente</div>
                )}
              </div>

              {/* Experience Column */}
              <div className="bg-gradient-to-b from-[#f0f4f8] to-[#e6eef5] rounded-lg p-4 border border-[#d1e0ec] shadow-sm">
                <h3 className="font-bold text-[#8B2332] mb-3">Experiencia</h3>
                {experienceTest.status === 'completado' ? (
                  <div className="space-y-2">
                    <div className="bg-white p-2 rounded shadow-sm border border-[#b8c6d6]">
                      <span className="font-semibold text-[#2c3e50]">Lecciones Aprendidas:</span>
                      <div className="text-xs mt-1 text-[#4a5568]">
                        {lessonsLearned ? (
                          <div className="italic">"{lessonsLearned.substring(0, 80)}..."</div>
                        ) : (
                          <div className="text-gray-500">No definidas</div>
                        )}
                      </div>
                    </div>
                    <div className="bg-white p-2 rounded shadow-sm border border-[#b8c6d6]">
                      <span className="font-semibold text-[#2c3e50]">Impacto en Ministerio:</span>
                      <div className="text-xs mt-1 text-[#4a5568]">
                        {impactOnMinistry ? (
                          <div className="italic">"{impactOnMinistry.substring(0, 80)}..."</div>
                        ) : (
                          <div className="text-gray-500">No definido</div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-400 italic">Pendiente</div>
                )}
              </div>
            </div>

            {/* Summary Box */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
              <h3 className="font-bold text-[#8B2332] mb-2">Mi forma de servir</h3>
              <p className="text-sm text-gray-700">
                {completedTests < 3 ? (
                  "Complete más tests para obtener un análisis completo de su forma de servir."
                ) : (
                  <>
                    Con una personalidad {personalityTraits.slice(0,2).join('/')} predominante, 
                    sus dones espirituales principales de {topDones.slice(0, 2).join(' y ')}, 
                    y habilidades {topSkills.join(', ')}, usted tiene una inclinación natural 
                    hacia roles de servicio que combinan {passionTypes[0] || ''} y {passionTypes[1] || ''}.
                    <br/><br/>
                    Su pasión por grupos como {passionGroups[0] || ''} y {passionGroups[1] || ''} 
                    &nbsp;indica áreas donde su ministerio puede tener mayor impacto.
                    {experienceTest.status === 'completado' && topExperiences.length > 0 && (
                      <>
                        <br/><br/>
                        Sus experiencias significativas como {topExperiences[0] || ''} 
                        {topExperiences[1] ? ` y ${topExperiences[1]}` : ''} 
                        le han proporcionado una perspectiva única que enriquece su ministerio.
                      </>
                    )}
                  </>
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalResultsOverview;