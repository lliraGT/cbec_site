import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  LineChart,  // Add this
  Line,       // Add this
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const SkillsResults = ({ skillResults }) => {
  const [expandedCategory, setExpandedCategory] = useState(null);

  if (!skillResults || Object.keys(skillResults).length === 0) {
    return <div className="text-center p-4">No hay resultados de habilidades disponibles.</div>;
  }

  const categoryInfo = {
    R: {
      name: 'Realista',
      description: 'Soy práctico, activo y tengo buenas habilidades físicas. Me gusta trabajar en exteriores y crear cosas con mis manos. Prefiero trabajar con objetos tangibles que con ideas o gente. A veces se me dificulta expresarme oralmente y comunicar mis sentimientos a los demás. Mis ideas sobre política y economía son muy convencionales. Me describiría como duro, robusto, práctico y físicamente fuerte.',
      careers: [
        'Ingeniería mecánica',
        'Agricultura',
        'Construcción',
        'Carpintería',
        'Mecánica',
        'Electricidad',
        'Plomería',
        'Técnico en computación'
      ]
    },
    I: {
      name: 'Investigador',
      description: 'Prefiero resolver problemas abstractos y entender el mundo físico más que actuar en él. Disfruto los problemas complicados y los desafíos intelectuales. No me gustan las situaciones estructuradas con muchas reglas, ni trabajar rodeado de mucha gente. Mis valores y actitudes no son convencionales, y me gustaría ser original y creativo, especialmente en áreas científicas. Me describiría como analítico, curioso, reservado e independiente.',
      careers: [
        'Científico',
        'Investigador',
        'Matemático',
        'Profesor universitario',
        'Médico',
        'Químico',
        'Biólogo',
        'Técnico de laboratorio'
      ]
    },
    A: {
      name: 'Artístico',
      description: 'Prefiero las situaciones no estructuradas donde pueda tratar problemas mediante la expresión personal en un medio artístico. Prefiero trabajar solo, o con poca gente. Siento una gran necesidad de expresarme individualmente. Soy sensible y emotivo. Me describiría como independiente, original, poco convencional y expresivo.',
      careers: [
        'Artista',
        'Músico',
        'Escritor',
        'Diseñador gráfico',
        'Arquitecto',
        'Fotógrafo',
        'Actor',
        'Diseñador de interiores'
      ]
    },
    S: {
      name: 'Sociable',
      description: 'Soy sociable, responsable y me importa el bienestar de los demás. Me expreso bien y me llevo bien con los demás. Me gusta estar en medio de un grupo y prefiero resolver problemas discutiéndolos con los demás. Me veo a mí mismo como alegre, amistoso, popular, eficiente y buen líder.',
      careers: [
        'Profesor',
        'Trabajador social',
        'Consejero',
        'Psicólogo',
        'Enfermero',
        'Terapeuta',
        'Recursos humanos',
        'Servicio al cliente'
      ]
    },
    E: {
      name: 'Emprendedor',
      description: 'Tengo mucha facilidad de palabra, la cual puedo utilizar eficazmente como vendedor o líder. Disfruto persuadiendo a los demás de mis puntos de vista y soy paciente en trabajos que requieren precisión o largos períodos de concentración. Me veo a mí mismo como enérgico, entusiasta, aventurero, confiado y dominante.',
      careers: [
        'Empresario',
        'Vendedor',
        'Gerente',
        'Ejecutivo',
        'Político',
        'Abogado',
        'Representante comercial',
        'Director de proyectos'
      ]
    },
    C: {
      name: 'Convencional',
      description: 'Prefiero las actividades ordenadas. No me gusta ser líder, pero me gusta trabajar donde haya una línea de mando bien definida. Me gusta saber qué se espera exactamente de mí y me siento incómodo cuando no conozco las "reglas". Me considero tradicionalista, convencional, estable, bien controlado y confiable.',
      careers: [
        'Contador',
        'Administrador',
        'Secretario',
        'Analista financiero',
        'Bibliotecario',
        'Asistente administrativo',
        'Editor',
        'Auditor'
      ]
    }
  };

  // Replace the existing chartData transformation with this:
    const categoryOrder = ['R', 'I', 'A', 'S', 'E', 'C']; // Define the correct order

    // Transform results for chart
    const chartData = categoryOrder.map(category => ({
        name: categoryInfo[category].name,
        value: skillResults[category],
        category
    }));

  // Get top 3 categories
  const topCategories = chartData.slice(0, 3);

  return (
    <div className="max-w-[90rem] mx-auto space-y-8 px-4">
      {/* Summary Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-[#8B2332] mb-4">
          Tus Habilidades Predominantes
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {topCategories.map((category, index) => (
            <div 
              key={category.category}
              className="p-6 border rounded-lg bg-gray-50"
            >
              <div className="flex items-center gap-4 mb-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#8B2332] text-white font-bold">
                  {index + 1}
                </span>
                <h3 className="text-lg font-semibold text-[#8B2332]">
                  {category.name}
                </h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {categoryInfo[category.category].description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-[#8B2332] mb-4">
            Distribución de tus habilidades
        </h3>
        <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                dataKey="name" 
                tick={{ fill: '#8B2332' }}
                />
                <YAxis 
                domain={[0, 35]} 
                ticks={[0, 5, 10, 15, 20, 25, 30, 35]}
                />
                <Tooltip 
                    contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        padding: '10px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                    formatter={(value) => [`${value}`, 'Puntuación']}
                    labelStyle={{
                        color: '#8B2332',
                        fontWeight: 'bold',
                        marginBottom: '4px'
                    }}
                    itemStyle={{
                        color: '#8B2332',
                        padding: '4px 0'
                    }}
                    labelFormatter={(label) => label}
                    wrapperStyle={{
                        outline: 'none'
                    }}
                />
                <Line
                type="monotone"
                dataKey="value"
                stroke="#8B2332"
                strokeWidth={2}
                dot={{ 
                    fill: "#8B2332",
                    r: 6 
                }}
                activeDot={{
                    r: 8,
                    fill: "#8B2332"
                }}
                />
            </LineChart>
            </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="bg-white rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-[#8B2332] p-6 border-b">
          Análisis Detallado de tus Habilidades
        </h3>
        <div className="divide-y">
          {chartData.map((category) => (
            <div key={category.category} className="p-6">
              <button
                onClick={() => setExpandedCategory(expandedCategory === category.category ? null : category.category)}
                className="w-full"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <h4 className="text-lg font-semibold text-gray-900">{category.name}</h4>
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-900">
                      Puntuación: {category.value}
                    </span>
                  </div>
                  {expandedCategory === category.category ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </button>
              
              {expandedCategory === category.category && (
                <div className="mt-6 space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="text-[#8B2332] font-semibold mb-3">Descripción:</h5>
                    <p className="text-gray-800 leading-relaxed">
                      {categoryInfo[category.category].description}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="text-[#8B2332] font-semibold mb-3">Carreras y ocupaciones relacionadas:</h5>
                    <div className="flex flex-wrap gap-2">
                      {categoryInfo[category.category].careers.map((career) => (
                        <span 
                          key={career}
                          className="px-3 py-1 bg-white rounded-full text-sm text-gray-800 border"
                        >
                          {career}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-[#8B2332] mb-4">
          Nota Importante
        </h3>
        <p className="text-gray-700 leading-relaxed">
          Este análisis muestra tus tendencias naturales hacia ciertos tipos de actividades y entornos de trabajo.
          Recuerda que:
        </p>
        <ul className="list-disc list-inside mt-4 text-gray-700 space-y-2">
          <li>No hay perfiles "buenos" o "malos" - cada uno tiene sus fortalezas únicas</li>
          <li>Las habilidades pueden desarrollarse y mejorarse con práctica y dedicación</li>
          <li>Tu combinación única de habilidades te hace especialmente valioso en ciertos roles</li>
          <li>Considera estas tendencias al elegir tu carrera o área de servicio</li>
        </ul>
      </div>
    </div>
  );
};

export default SkillsResults;