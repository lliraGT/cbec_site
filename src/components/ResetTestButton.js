import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';

const ResetTestButton = ({ testSlug, userId, onReset }) => {
  const [isResetting, setIsResetting] = useState(false);
  const [error, setError] = useState(null);

  const handleResetTest = async () => {
    if (!confirm('¿Estás seguro de que quieres reiniciar este test? Todos los resultados se perderán.')) {
      return;
    }

    setIsResetting(true);
    setError(null);

    // Map Spanish slugs to English API expected values
    const testTypeMapping = {
      'personalidad': 'personality',
      'dones': 'dones',
      'habilidades': 'skills',
      'experiencia': 'experience',
      'pasion': 'passion'
    };

    const apiTestType = testTypeMapping[testSlug] || testSlug;
    console.log('Resetting test type:', apiTestType, 'from slug:', testSlug);

    try {
      const response = await fetch('/api/user-progress/reset-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          testType: apiTestType,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error resetting test');
      }

      // Call the onReset callback to refresh the UI
      if (onReset) {
        onReset();
      }
    } catch (error) {
      console.error('Error resetting test:', error);
      setError(error.message);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <button
      onClick={handleResetTest}
      disabled={isResetting}
      className="inline-flex items-center px-3 py-1 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
      title="Reiniciar test"
    >
      <RefreshCw className="h-3.5 w-3.5 mr-1" />
      {isResetting ? 'Reiniciando...' : 'Reiniciar'}
    </button>
  );
};

export default ResetTestButton;