import React, { useState } from 'react';
import { X } from 'lucide-react';

const TestInvitationForm = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedTests, setSelectedTests] = useState({
    personalidad: true,
    dones: true,
    habilidades: true,
    pasion: true,
    experiencia: true
  });

  const tests = [
    { id: 'personalidad', name: 'Test de Personalidad' },
    { id: 'dones', name: 'Test de Dones Espirituales' },
    { id: 'habilidades', name: 'Test de Habilidades' },
    { id: 'pasion', name: 'Test de Pasión' },
    { id: 'experiencia', name: 'Test de Experiencia' }
  ];

  const handleTestToggle = (testId) => {
    setSelectedTests(prev => ({
      ...prev,
      [testId]: !prev[testId]
    }));
  };

  const handleSendInvite = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // Validate email
    if (!email || !email.includes('@')) {
      setMessage('Por favor ingrese un correo electrónico válido');
      setIsLoading(false);
      return;
    }

    // Get selected tests
    const testsToInclude = Object.entries(selectedTests)
      .filter(([_, isSelected]) => isSelected)
      .map(([testId]) => testId);

    if (testsToInclude.length === 0) {
      setMessage('Por favor seleccione al menos un test');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/invite-to-tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          tests: testsToInclude 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Invitación enviada exitosamente');
        setEmail('');
      } else {
        setMessage(data.error || 'Error al enviar la invitación');
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
      setMessage('Ocurrió un error al enviar la invitación');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[#8B2332]">
          Invitar a Tomar Tests
        </h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-200 rounded-full"
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>
      </div>
      
      <form onSubmit={handleSendInvite} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 bg-white border focus:border-[#8B2332] focus:ring-[#8B2332]"
            placeholder="Ingrese el correo electrónico"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tests a Incluir
          </label>
          <div className="space-y-2">
            {tests.map((test) => (
              <div key={test.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`test-${test.id}`}
                  checked={selectedTests[test.id]}
                  onChange={() => handleTestToggle(test.id)}
                  className="rounded text-[#8B2332] focus:ring-[#8B2332] h-4 w-4"
                />
                <label 
                  htmlFor={`test-${test.id}`} 
                  className="ml-2 text-sm text-gray-700"
                >
                  {test.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-xs text-gray-600">
            Esta invitación permitirá al usuario tomar únicamente los tests seleccionados, 
            sin acceso a otras partes de la plataforma.
          </p>
        </div>

        {message && (
          <div className={`p-3 rounded-md ${
            message.includes('exitosa') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#8B2332] hover:bg-[#7a1e2b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B2332] disabled:bg-[#d0929a] disabled:cursor-not-allowed"
        >
          {isLoading ? 'Enviando...' : 'Enviar Invitación'}
        </button>
      </form>
    </div>
  );
};

export default TestInvitationForm;