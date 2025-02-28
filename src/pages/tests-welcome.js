// src/pages/tests-welcome.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

// This page serves as a landing page for guests to enter their name before taking tests
export default function TestWelcomePage() {
  const router = useRouter();
  const { token } = router.query;
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [invitation, setInvitation] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Verify token when component loads
  useEffect(() => {
    if (!token) return;

    const verifyToken = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/verify-test-invitation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setInvitation(data.invitation);
        } else {
          setError(data.error || 'Invalid or expired invitation');
        }
      } catch (error) {
        console.error('Error verifying invitation:', error);
        setError('An error occurred while verifying the invitation');
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleContinue = async (e) => {
    e.preventDefault();
    
    if (!firstName || !lastName) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Save user info to session storage for use on the tests page
      sessionStorage.setItem('guestUserInfo', JSON.stringify({
        firstName,
        lastName,
        email: invitation?.email || ''
      }));
      
      // Redirect to the tests page
      router.push(`/tests?token=${token}`);
    } catch (error) {
      console.error('Error saving user info:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B2332] mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando invitación...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error de Invitación</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <p className="text-sm text-gray-500">
              Por favor, contacta a la persona que te envió la invitación para obtener un nuevo enlace.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If no invitation found
  if (!invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No se encontró invitación</h2>
            <p className="text-gray-600">
              No se pudo encontrar una invitación válida. Por favor, asegúrate de usar el enlace correcto.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-center items-center">
          <div className="flex items-center space-x-2">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
            <h1 className="text-2xl font-bold text-[#8B2332]">Descubre</h1>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-[#8B2332] mb-2">¡Bienvenido a DESCUBRE!</h2>
              <p className="text-gray-600">
                Has sido invitado a completar pruebas que te ayudarán a descubrir tus dones, personalidad, 
                habilidades y pasiones para servir mejor en el cuerpo de Cristo.
              </p>
            </div>

            <form onSubmit={handleContinue} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-800">
                    Nombre
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8B2332] focus:ring-[#8B2332] sm:text-sm border p-2 text-gray-800"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-800">
                    Apellido
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8B2332] focus:ring-[#8B2332] sm:text-sm border p-2 text-gray-800"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-800">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={invitation?.email || ''}
                    disabled
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 sm:text-sm border p-2 text-gray-700"
                  />
                  <p className="mt-1 text-xs text-gray-600">Este es el email al que se envió la invitación</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600">
                  Para comenzar, por favor introduce tu nombre y apellido. Esta información será
                  usada para personalizar tus resultados.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !firstName || !lastName}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#8B2332] hover:bg-[#7a1e2b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B2332] disabled:bg-[#d0929a] disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Procesando...' : 'Continuar'}
              </button>
            </form>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2024 | Centro Bíblico El Camino</p>
        </div>
      </footer>
    </div>
  );
}