import React, { useRef } from 'react';
import { Printer, X } from 'lucide-react';

const PrintableResultsSheet = ({ userTests, onClose }) => {
  const printRef = useRef(null);

  // ... existing code ...

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg max-w-5xl w-full mx-4 my-8">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-[#8B2332]">Cuadro de Resultados</h2>
          <div className="flex items-center space-x-2">
            {/* Use separate clickable divs instead of nested buttons */}
            <div 
              onClick={handleDownloadPDF}
              className="px-4 py-2 bg-[#8B2332] text-white rounded-md flex items-center space-x-2 hover:bg-[#7a1e2b] cursor-pointer"
            >
              <span>Descargar PDF</span>
            </div>
            
            <div 
              onClick={handlePrint}
              className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full cursor-pointer"
            >
              <Printer size={20} />
            </div>
            
            <div 
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full cursor-pointer"
            >
              <X size={20} />
            </div>
          </div>
        </div>

        {/* Rest of the component remains the same */}
      </div>
    </div>
  );
};

export default PrintableResultsSheet;