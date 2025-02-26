import React, { useRef } from 'react';
import { Printer, X } from 'lucide-react';

const PrintableResultsSheet = ({ userTests, onClose }) => {
  const printRef = useRef(null);

  // Get personality results
  const personalityTest = userTests.find(test => test.slug === 'personalidad');
  const personalityResults = personalityTest?.results || {};
  
  // Get top personality traits (sorted by highest score)
  const personalityTraits = personalityResults && Object.keys(personalityResults).length > 0
    ? Object.entries(personalityResults)
        .sort(([, a], [, b]) => b - a)
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
          return { key: gift, label: giftLabels[gift] || gift };
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

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Generate PDF download
  const handleDownloadPDF = async () => {
    const element = printRef.current;
    const html2pdf = (await import('html2pdf.js')).default;

    const opt = {
      margin: 10,
      filename: 'cuadro-de-resultados.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait' 
      }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg max-w-5xl w-full mx-4 my-8">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-[#8B2332]">Cuadro de Resultados</h2>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleDownloadPDF}
              className="px-4 py-2 bg-[#8B2332] text-white rounded-md flex items-center space-x-2 hover:bg-[#7a1e2b]"
            >
              <span>Descargar PDF</span>
            </button>
            <button
              onClick={handlePrint}
              className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full"
            >
              <Printer size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="p-6" ref={printRef}>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#8B2332] mb-2">CUADRO DE RESULTADOS</h1>
            <p className="text-gray-600">Descubre el llamado que el Señor te ha dado</p>
          </div>

          {/* Framework Grid Layout similar to PDF */}
          <div className="grid grid-cols-5 gap-4">
            {/* Personality Column */}
            <div className="border border-gray-300 p-4">
              <h3 className="font-bold text-[#8B2332] mb-3 text-center border-b pb-2">Personalidad</h3>
              <div className="space-y-4">
                {personalityTest?.status === 'completado' ? (
                  <div>
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold">Primaria:</h4>
                      <p className="text-center font-bold text-lg">{personalityTraits[0] || '-'}</p>
                    </div>
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold">Secundaria:</h4>
                      <p className="text-center font-bold text-lg">{personalityTraits[1] || '-'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">Terciaria:</h4>
                      <p className="text-center font-bold text-lg">{personalityTraits[2] || 'N/A'}</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-48 flex items-center justify-center">
                    <span className="text-gray-400 italic">Pendiente</span>
                  </div>
                )}
              </div>
            </div>

            {/* Spiritual Gifts Column */}
            <div className="border border-gray-300 p-4">
              <h3 className="font-bold text-[#8B2332] mb-3 text-center border-b pb-2">Dones Espirituales</h3>
              <div className="space-y-2">
                {donesTest?.status === 'completado' ? (
                  <>
                    {topDones.map((gift, index) => (
                      <div key={index} className="mb-2">
                        <p className="text-center py-1">
                          <span className="font-semibold">{index + 1}.</span> {gift.label}
                        </p>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="h-48 flex items-center justify-center">
                    <span className="text-gray-400 italic">Pendiente</span>
                  </div>
                )}
              </div>
            </div>

            {/* Skills Column */}
            <div className="border border-gray-300 p-4">
              <h3 className="font-bold text-[#8B2332] mb-3 text-center border-b pb-2">Habilidades</h3>
              <div className="space-y-2">
                {skillsTest?.status === 'completado' ? (
                  <>
                    {topSkills.map((skill, index) => (
                      <div key={index} className="mb-2">
                        <p className="text-center font-bold text-lg">
                          <span>{index + 1}.</span> {skill}
                        </p>
                      </div>
                    ))}
                    {/* Add extra space if less than 3 skills */}
                    {topSkills.length < 3 && (
                      <div className="h-20"></div>
                    )}
                  </>
                ) : (
                  <div className="h-48 flex items-center justify-center">
                    <span className="text-gray-400 italic">Pendiente</span>
                  </div>
                )}
              </div>
            </div>

            {/* Passion Column */}
            <div className="border border-gray-300 p-4">
              <h3 className="font-bold text-[#8B2332] mb-3 text-center border-b pb-2">Pasión</h3>
              <div className="space-y-2">
                {passionTest?.status === 'completado' ? (
                  <>
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold">Por quién:</h4>
                      <div className="space-y-1 mt-2">
                        {passionGroups.slice(0, 3).map((group, i) => (
                          <p key={i} className="text-center">
                            <span className="font-semibold">{i + 1}.</span> {group}
                          </p>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold">Expresión:</h4>
                      <div className="space-y-1 mt-2">
                        {passionTypes.map((type, i) => (
                          <p key={i} className="text-center">
                            <span className="font-semibold">{i + 1}.</span> {type}
                          </p>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="h-48 flex items-center justify-center">
                    <span className="text-gray-400 italic">Pendiente</span>
                  </div>
                )}
              </div>
            </div>

            {/* Experience Column */}
            <div className="border border-gray-300 p-4">
              <h3 className="font-bold text-[#8B2332] mb-3 text-center border-b pb-2">Experiencia</h3>
              <div className="h-48 flex items-center justify-center">
                <span className="text-gray-400 italic">Pendiente</span>
              </div>
            </div>
          </div>

          {/* Summary Box */}
          <div className="mt-8 p-4 border border-gray-300">
            <h3 className="text-center font-bold text-[#8B2332] mb-6">DONDE SERVIR</h3>

            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2 bg-gray-50">Ministerio</th>
                  <th className="border border-gray-300 p-2 bg-gray-50">Potencial</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2"></td>
                  <td className="border border-gray-300 p-2"></td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2"></td>
                  <td className="border border-gray-300 p-2"></td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2"></td>
                  <td className="border border-gray-300 p-2"></td>
                </tr>
              </tbody>
            </table>

            <div className="mt-8">
              <h4 className="font-semibold mb-2">Comentarios del asesor:</h4>
              <div className="border border-gray-300 p-2 h-32"></div>
            </div>

            <div className="mt-6 flex justify-between">
              <div>
                <p className="font-semibold">Cita para asesoría</p>
                <p>Fecha: ____________________</p>
                <p>Hora: _____________________</p>
                <p>Lugar: ____________________</p>
              </div>
              <div>
                <p className="font-semibold">Ministerio</p>
                <p>______________________________</p>
                <p>______________________________</p>
                <p>______________________________</p>
              </div>
              <div>
                <p className="font-semibold">Eventos especiales:</p>
                <p>______________________________</p>
                <p>______________________________</p>
                <p>______________________________</p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">© Centro Bíblico El Camino - {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintableResultsSheet;