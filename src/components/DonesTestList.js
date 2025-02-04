import React from 'react';
import { ClipboardCheck, ArrowRight } from "lucide-react";

const DonesTestList = ({ userTests = [], onStartTest }) => {
  const tests = [
    {
      slug: "personalidad",
      name: "Tu Personalidad",
      status: "pendiente",
      completionDate: null
    },
    {
      slug: "dones",
      name: "Tus Dones",
      status: "pendiente",
      completionDate: null
    },
    {
      slug: "habilidades",
      name: "Tus Habilidades",
      status: "pendiente",
      completionDate: null
    },
    {
      slug: "experiencia",
      name: "Tu Experiencia",
      status: "pendiente",
      completionDate: null
    },
    {
      slug: "pasion",
      name: "Tu Pasión",
      status: "pendiente",
      completionDate: null
    }
  ];

  // Merge default tests with any completed tests from userTests
  const mergedTests = tests.map(defaultTest => {
    const userTest = userTests.find(test => test.slug === defaultTest.slug);
    return userTest || defaultTest;
  });

  const completedTests = mergedTests.filter(test => test.status === 'completado').length;

  return (
    <div>
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-sm text-gray-600">{completedTests}/5 completados</span>
        <ClipboardCheck className={`w-5 h-5 ${
          completedTests === 5 ? 'text-green-500' : 'text-gray-400'
        }`} />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#8B2332] uppercase tracking-wider">
                Nombre del Test
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#8B2332] uppercase tracking-wider">
                Estado
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#8B2332] uppercase tracking-wider">
                Fecha de Completación
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-[#8B2332] uppercase tracking-wider">
                Acción
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mergedTests.map((test) => (
              <tr key={test.slug}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">{test.name}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    test.status === 'completado'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {test.status === 'completado' ? 'Completado' : 'Pendiente'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {test.completionDate 
                    ? new Date(test.completionDate).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })
                    : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => onStartTest(test.slug)}
                    className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium ${
                      test.status === 'completado'
                        ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                        : 'bg-blue-600 text-white hover:bg-blue-700 border-transparent'
                    }`}
                  >
                    {test.status === 'completado' ? 'Ver Resultados' : 'Comenzar Test'}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonesTestList;