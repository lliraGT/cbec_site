import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Download, Share, Printer } from 'lucide-react';
import PrintableResultsSheet from './PrintableResultsSheet';

const GlobalResultsOverview = ({ userTests }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPrintViewOpen, setIsPrintViewOpen] = useState(false);

  // Check if user has completed any tests
  const hasCompletedTests = userTests.some(test => test.status === 'completado');
  
  // Get personality results
  const personalityTest = userTests.find(test => test.slug === 'personalidad');
  const personalityResults = personalityTest?.results || {};
  
  // Get top personality traits (sorted by highest score)
  const personalityTraits = personalityResults && Object.keys(personalityResults).length > 0
    ? Object.entries(personalityResults)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 2)
        .map(([type]) => type)
    : [];

  // Get spiritual gifts results
  const donesTest = userTests.find(test => test.slug === 'dones');
  const donesResults = donesTest?.results || {};
  
  // Get top spiritual gifts (sorted by highest score)
  const topDones = donesResults && Object.keys(donesResults).length > 0
    ? Object.entries(donesResults)
        .sort(([, a], [, b]) => b - a)
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
  const skillsTest = userTests.find(test => test.slug === 'habilidades');
  const skillsResults = skillsTest?.results || {};
  
  // Get top skills (sorted by highest score)
  const topSkills = skillsResults && Object.keys(skillsResults).length > 0
    ? Object.entries(skillsResults)
        .sort(([, a], [, b]) => b - a)
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
  const passionTest = userTests.find(test => test.slug === 'pasion');
  const passionResults = passionTest?.results || {};
  
  // Get passion groups and types
  const passionGroups = passionResults?.topFiveGroups || [];
  const passionTypes = passionResults?.topThreePassions || [];

  // Calculate completion percentage
  const completedTests = userTests.filter(test => test.status === 'completado').length;
  const completionPercentage = (completedTests / userTests.length) * 100;

  if (!hasCompletedTests) {
    return (
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-[#8B2332] mb-4">Resumen de Resultados</h2>
        <p className="text-gray-600">Complete al menos un test para ver su resumen de resultados.</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      {/* Printable View Modal */}
      {isPrintViewOpen && (
        <PrintableResultsSheet 
          userTests={userTests}
          onClose={() => setIsPrintViewOpen(false)}
        />
      )}
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <button 
          className="w-full flex justify-between items-center p-6 text-left" 
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div>
            <h2 className="text-xl font-bold text-[#8B2332]">Cuadro de Resultados</h2>
            <p className="text-sm text-gray-600 mt-1">Progreso: {Math.round(completionPercentage)}% completado</p>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setIsPrintViewOpen(true)}
              className="p-2 text-gray-500 hover:text-[#8B2332] hover:bg-gray-100 rounded-full"
              title="Imprimir o descargar"
            >
              <Download size={20} />
            </button>
            <button 
              className="p-2 text-gray-500 hover:text-[#8B2332] hover:bg-gray-100 rounded-full"
              title="Compartir"
            >
              <Share size={20} />
            </button>
            {isExpanded ? (
              <ChevronUp className="h-6 w-6 text-gray-500" />
            ) : (
              <ChevronDown className="h-6 w-6 text-gray-500" />
            )}
          </div>
        </button>

        {isExpanded && (
          <div className="p-6 border-t">
            {/* Framework Grid Layout similar to PDF */}
            <div className="grid md:grid-cols-5 gap-4 text-center">
              {/* Personality Column */}
              <div className="bg-gray-50 rounded-lg p-4 border">
                <h3 className="font-bold text-[#8B2332] mb-3">Personalidad</h3>
                {personalityTest?.status === 'completado' ? (
                  <div className="space-y-2">
                    {personalityTraits.map((type, index) => (
                      <div key={index} className="bg-white p-2 rounded shadow-sm">
                        <span className="font-semibold">{type}</span>
                      </div>
                    ))}
                    <div className="text-xs text-gray-500 mt-2">
                      Primaria: {personalityTraits[0] || ''}
                      <br />
                      Secundaria: {personalityTraits[1] || ''}
                      <br />
                      Terciaria (opcional): {personalityTraits[2] || ''}
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-400 italic">Pendiente</div>
                )}
              </div>

              {/* Spiritual Gifts Column */}
              <div className="bg-gray-50 rounded-lg p-4 border">
                <h3 className="font-bold text-[#8B2332] mb-3">Dones espirituales</h3>
                {donesTest?.status === 'completado' ? (
                  <div className="space-y-2">
                    {topDones.map((gift, index) => (
                      <div key={index} className="bg-white p-2 rounded shadow-sm">
                        <span className="font-semibold">{index + 1}. {gift}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400 italic">Pendiente</div>
                )}
              </div>

              {/* Skills Column */}
              <div className="bg-gray-50 rounded-lg p-4 border">
                <h3 className="font-bold text-[#8B2332] mb-3">Habilidades</h3>
                {skillsTest?.status === 'completado' ? (
                  <div className="space-y-2">
                    {topSkills.map((skill, index) => (
                      <div key={index} className="bg-white p-2 rounded shadow-sm">
                        <span className="font-semibold">{index + 1}. {skill}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400 italic">Pendiente</div>
                )}
              </div>

              {/* Passion Column */}
              <div className="bg-gray-50 rounded-lg p-4 border">
                <h3 className="font-bold text-[#8B2332] mb-3">Pasión</h3>
                {passionTest?.status === 'completado' ? (
                  <div className="space-y-2">
                    <div className="bg-white p-2 rounded shadow-sm">
                      <span className="font-semibold">Grupos que me apasionan:</span>
                      <div className="text-xs mt-1">
                        {passionGroups.slice(0, 2).map((group, i) => (
                          <div key={i} className="mb-1">{i + 1}. {group}</div>
                        ))}
                        {passionGroups.length > 2 && (
                          <div className="text-gray-500">+{passionGroups.length - 2} más</div>
                        )}
                      </div>
                    </div>
                    <div className="bg-white p-2 rounded shadow-sm">
                      <span className="font-semibold">Formas de expresión:</span>
                      <div className="text-xs mt-1">
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
              <div className="bg-gray-50 rounded-lg p-4 border">
                <h3 className="font-bold text-[#8B2332] mb-3">Experiencia</h3>
                <div className="text-gray-400 italic">Pendiente</div>
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
                    Con una personalidad {personalityTraits.join('/')} predominante, 
                    sus dones espirituales principales de {topDones.slice(0, 2).join(' y ')}, 
                    y habilidades {topSkills.join(', ')}, usted tiene una inclinación natural 
                    hacia roles de servicio que combinan {passionTypes[0] || ''} y {passionTypes[1] || ''}.
                    <br/><br/>
                    Su pasión por grupos como {passionGroups[0] || ''} y {passionGroups[1] || ''} 
                    indica áreas donde su ministerio puede tener mayor impacto.
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