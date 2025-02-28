// src/pages/tests.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import PersonalityTest from '@/components/PersonalityTest';
import DonesTest from '@/components/DonesTest';
import SkillsTest from '@/components/SkillsTest';
import PassionTest from '@/components/PassionTest';
import ExperienceTest from '@/components/ExperienceTest';
import PersonalityResults from '@/components/test/results/PersonalityResults';
import DonesResults from '@/components/test/results/DonesResults';
import SkillsResults from '@/components/test/results/SkillsResults';
import PassionResults from '@/components/test/results/PassionResults';
import ExperienceResults from '@/components/test/results/ExperienceResults';

export default function TestsPage() {
  const router = useRouter();
  const { token } = router.query;
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [invitation, setInvitation] = useState(null);
  const [testResults, setTestResults] = useState({});
  const [currentTest, setCurrentTest] = useState(null);
  const [availableTests, setAvailableTests] = useState([]);
  const [userData, setUserData] = useState({
    id: null,
    name: 'Guest User',
    email: ''
  });

  // Verify token and load available tests
  useEffect(() => {
    if (!token) return;

    // Get user info from session storage (set in welcome page)
    const getUserInfo = () => {
      if (typeof window !== 'undefined') {
        const storedUserInfo = sessionStorage.getItem('guestUserInfo');
        if (storedUserInfo) {
          try {
            return JSON.parse(storedUserInfo);
          } catch (error) {
            console.error('Error parsing user info from session storage:', error);
          }
        }
        // If no user info found, redirect to welcome page
        router.push(`/tests-welcome?token=${token}`);
        return null;
      }
      return null;
    };

    const userInfo = getUserInfo();
    if (!userInfo) return;

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
          setAvailableTests(data.invitation.tests || []);
          setUserData({
            id: data.invitation._id,
            name: `${userInfo.firstName} ${userInfo.lastName}`,
            email: data.invitation.email
          });
          
          // Load existing results if any
          if (data.results) {
            // Make sure to set proper structure for the results
            // This will make sure we have the right fields for each test type
            setTestResults({
              personalidad: data.results.personalidad || null,
              dones: data.results.dones || null,
              habilidades: data.results.habilidades || null,
              pasion: data.results.pasion || null,
              experiencia: data.results.experiencia || null
            });
            
            // Debug the results
            console.log("Loaded test results:", data.results);
          }
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
  }, [token, router]);

  const handleStartTest = (testType) => {
    setCurrentTest(testType);
  };

  const handleTestComplete = async (results) => {
    try {
      // Get user info from session storage
      const userInfo = sessionStorage.getItem('guestUserInfo');
      let firstName = '';
      let lastName = '';
      
      if (userInfo) {
        try {
          const parsedInfo = JSON.parse(userInfo);
          firstName = parsedInfo.firstName || '';
          lastName = parsedInfo.lastName || '';
          console.log('Using user info for test completion:', { firstName, lastName });
        } catch (error) {
          console.error('Error parsing user info from session storage:', error);
        }
      }
      
      // Save the test results
      const response = await fetch('/api/save-test-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          testType: currentTest,
          results,
          firstName,
          lastName
        }),
      });

      const responseData = await response.json();
      console.log('Save test results response:', responseData);

      if (response.ok) {
        // Update local state with new results
        setTestResults(prev => ({
          ...prev,
          [currentTest]: results
        }));
      } else {
        console.error('Failed to save test results:', responseData.error);
      }
    } catch (error) {
      console.error('Error saving test results:', error);
    }

    // Close the test
    setCurrentTest(null);
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

  // Define test labels and components
  const testDetails = {
    personalidad: {
      label: 'Test de Personalidad',
      description: 'Descubre tu tipo de personalidad y cómo influye en tu ministerio.',
      component: PersonalityTest,
      resultsComponent: PersonalityResults
    },
    dones: {
      label: 'Test de Dones Espirituales',
      description: 'Identifica los dones que el Espíritu Santo te ha dado.',
      component: DonesTest,
      resultsComponent: DonesResults
    },
    habilidades: {
      label: 'Test de Habilidades',
      description: 'Reconoce tus habilidades naturales y cómo puedes usarlas.',
      component: SkillsTest,
      resultsComponent: SkillsResults
    },
    pasion: {
      label: 'Test de Pasión',
      description: 'Descubre qué grupos y ministerios te apasionan más.',
      component: PassionTest,
      resultsComponent: PassionResults
    },
    experiencia: {
      label: 'Test de Experiencia',
      description: 'Reflexiona sobre tus experiencias de vida y cómo han moldeado tu ministerio.',
      component: ExperienceTest,
      resultsComponent: ExperienceResults
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
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
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{userData.name}</p>
            <p className="text-xs text-gray-600">{userData.email}</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Bienvenido(a) a tu jornada de descubrimiento</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Has sido invitado(a) a completar los siguientes tests que te ayudarán a descubrir 
            tus dones espirituales, personalidad, habilidades y pasiones.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableTests.map((testType) => {
            const test = testDetails[testType];
            const hasCompleted = !!testResults[testType];
            
            if (!test) return null;
            
            return (
              <div key={testType} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{test.label}</h3>
                  <p className="text-gray-600 mb-6">{test.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      hasCompleted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {hasCompleted ? 'Completado' : 'Pendiente'}
                    </span>
                    
                    <button
                      onClick={() => handleStartTest(testType)}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        hasCompleted
                          ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          : 'bg-[#8B2332] text-white hover:bg-[#7a1e2b]'
                      }`}
                    >
                      {hasCompleted ? 'Ver Resultados' : 'Comenzar Test'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Test Modals */}
        {currentTest && testDetails[currentTest] && (() => {
          const TestComponent = testDetails[currentTest].component;
          const ResultsComponent = testDetails[currentTest].resultsComponent;
          const hasResults = !!testResults[currentTest];
          
          if (hasResults) {
            // Show results if test is already completed
            return (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
                <div className="min-h-screen px-4 text-center">
                  <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>
                  <div className="inline-block w-full max-w-4xl my-8 text-left align-middle">
                    <div className="bg-white rounded-lg shadow-xl">
                      <div className="flex justify-between items-center p-4 border-b">
                        <h2 className="text-xl font-semibold text-[#8B2332]">
                          Resultados: {testDetails[currentTest].label}
                        </h2>
                        <button
                          onClick={() => setCurrentTest(null)}
                          className="p-2 rounded-full hover:bg-gray-200"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="p-4">
                        {currentTest === 'dones' ? (
                          <DonesResults 
                            giftResults={testResults.dones} 
                            personalityResults={testResults.personalidad || {}}
                          />
                        ) : currentTest === 'habilidades' ? (
                          <SkillsResults 
                            skillResults={testResults.habilidades} 
                          />
                        ) : (
                          <ResultsComponent 
                            results={testResults[currentTest]} 
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          } else {
            // Show test component if not completed
            return (
              <TestComponent
                isOpen={true}
                onClose={() => setCurrentTest(null)}
                onComplete={handleTestComplete}
                user={userData}
              />
            );
          }
        })()}
      </main>

      <footer className="bg-white border-t mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2024 | Centro Bíblico El Camino</p>
        </div>
      </footer>
    </div>
  );
}