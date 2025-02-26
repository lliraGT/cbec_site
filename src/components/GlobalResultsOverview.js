import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Download, Share, Printer } from 'lucide-react';
import PrintableResultsSheet from './PrintableResultsSheet';

const GlobalResultsOverview = ({ userTests }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPrintViewOpen, setIsPrintViewOpen] = useState(false);

  // Check if user has completed any tests
  const hasCompletedTests = userTests.some(test => test.status === 'completado');
  
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
        <div 
          className="w-full flex justify-between items-center p-6 text-left cursor-pointer" 
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div>
            <h2 className="text-xl font-bold text-[#8B2332]">Cuadro de Resultados</h2>
            <p className="text-sm text-gray-600 mt-1">Progreso: {Math.round(completionPercentage)}% completado</p>
          </div>
          <div className="flex items-center space-x-2">
            {/* Separate clickable elements instead of nested buttons */}
            <div 
              onClick={(e) => {
                e.stopPropagation();
                setIsPrintViewOpen(true);
              }} 
              className="p-2 text-gray-500 hover:text-[#8B2332] hover:bg-gray-100 rounded-full cursor-pointer"
              title="Imprimir o descargar"
            >
              <Download size={20} />
            </div>
            <div 
              onClick={(e) => {
                e.stopPropagation();
                // Add share functionality if needed
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

        {/* Rest of the component remains the same */}
      </div>
    </div>
  );
};

export default GlobalResultsOverview;