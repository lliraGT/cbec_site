// pages/dones.js
import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { X } from 'lucide-react';
import TopBar from '@/components/TopBar';
import Sidebar from '@/components/Sidebar';
import PersonalityTest from '@/components/PersonalityTest';
import PersonalityResults from '@/components/test/results/PersonalityResults';
import DonesTest from '@/components/DonesTest';
import DonesResults from '@/components/test/results/DonesResults';
import SkillsTest from '@/components/SkillsTest';
import SkillsResults from '@/components/test/results/SkillsResults';
import PassionTest from '@/components/PassionTest';
import PassionResults from '@/components/test/results/PassionResults';
import ExperienceTest from '@/components/ExperienceTest';
import ExperienceResults from '@/components/test/results/ExperienceResults';
import EmailInvite from '@/components/EmailInvite';
import DonesTestList from '@/components/DonesTestList';
import GlobalResultsOverview from '@/components/GlobalResultsOverview';
import PrintableResultsSheet from '@/components/PrintableResultsSheet';

export default function DonesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isTestOpen, setIsTestOpen] = useState(false);
  const [isDonesTestOpen, setIsDonesTestOpen] = useState(false);
  const [isSkillsTestOpen, setIsSkillsTestOpen] = useState(false);
  const [isPassionTestOpen, setIsPassionTestOpen] = useState(false);
  const [isExperienceTestOpen, setIsExperienceTestOpen] = useState(false);
  const [isResultsOpen, setIsResultsOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [currentTest, setCurrentTest] = useState(null);
  const [testResults, setTestResults] = useState(null);
  const [userTests, setUserTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const resultsRef = useRef(null);

  const handleDownloadPDF = async () => {
    const element = resultsRef.current;
    const html2pdf = (await import('html2pdf.js')).default;

    const opt = {
      margin: 1,
      filename: 'resultados.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: true
      },
      jsPDF: { 
        unit: 'in', 
        format: 'letter', 
        orientation: 'portrait' 
      }
    };

    html2pdf().set(opt).from(element).save();
  };

  const fetchUserProgress = async () => {
    if (!session?.user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/user-progress?userId=${session.user.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user progress');
      }
      const data = await response.json();
      console.log('Received user progress data:', data);

      const testsData = [
        {
          slug: 'personalidad',
          name: 'Test de Personalidad',
          status: data.personalityTestCompleted ? 'completado' : 'pendiente',
          completionDate: data.personalityTestCompletionDate,
          results: data.personalityTestResults
        },
        {
          slug: 'dones',
          name: 'Test de Dones',
          status: data.donesTestCompleted ? 'completado' : 'pendiente',
          completionDate: data.donesTestCompletionDate,
          results: data.donesTestResults
        },
        {
          slug: 'habilidades',
          name: 'Test de Habilidades',
          status: data.skillsTestCompleted ? 'completado' : 'pendiente',
          completionDate: data.skillsTestCompletionDate,
          results: data.skillsTestResults
        },
        {
          slug: 'experiencia',
          name: 'Test de Experiencia',
          status: data.experienceTestCompleted ? 'completado' : 'pendiente',
          completionDate: data.experienceTestCompletionDate,
          results: data.experienceTestResults || {}
        },
        {
          slug: 'pasion',
          name: 'Test de Pasión',
          status: data.passionTestCompleted ? 'completado' : 'pendiente',
          completionDate: data.passionTestCompletionDate,
          results: data.passionTestResults
        }
      ];

      setUserTests(testsData);
    } catch (error) {
      console.error('Error fetching user progress:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserProgress();
    }
  }, [session]);

  const handleStartTest = (testSlug) => {
    console.log('handleStartTest called with:', testSlug);
    const test = userTests.find(t => t.slug === testSlug);
    console.log('Found test:', test);
    
    if (test.status === 'completado') {
      console.log('Setting test results for:', testSlug);
      console.log('Full test object:', test);
      console.log('Raw results:', test.results);
      // Extra debugging
        if (!test.results) {
          console.error('WARNING: test.results is empty or undefined');
        }
      // If test is completed, show results
      setTestResults(test.results);
      setCurrentTest(testSlug);
      setIsResultsOpen(true);
    } else {
      // If test is pending, start the test
      setCurrentTest(testSlug);
      if (testSlug === 'dones') {
        setIsDonesTestOpen(true);
      } else if (testSlug === 'personalidad') {
        setIsTestOpen(true);
      } else if (testSlug === 'habilidades') {
        setIsSkillsTestOpen(true);
      } else if (testSlug === 'pasion') {
        console.log('Setting passion test to open');
        setIsPassionTestOpen(true);
      } else if (testSlug === 'experiencia') {
        setIsExperienceTestOpen(true);
      }
      console.log('Current test state:', {
        isTestOpen,
        isDonesTestOpen,
        isSkillsTestOpen,
        isPassionTestOpen,
        currentTest
      });
    }
  };

  const handleTestComplete = async () => {
    await fetchUserProgress();
    setIsTestOpen(false);
    setIsDonesTestOpen(false);
    setIsSkillsTestOpen(false);
    setIsPassionTestOpen(false);
    setIsExperienceTestOpen(false);
    setCurrentTest(null);
  };

  const handleResetTest = async (testSlug) => {
    try {
      // Refresh user progress after reset
      await fetchUserProgress();
      
      // Show success message
      // You could add a toast notification here if you have a notification system
      console.log(`Test ${testSlug} reset successfully`);
    } catch (error) {
      console.error('Error handling test reset:', error);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    router.push('/auth/login');
    return null;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-monaco">
      <TopBar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} />

      <main className={`pt-16 min-h-screen ${sidebarOpen ? 'ml-64' : ''} transition-margin duration-300`}>
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">Descubre</h1>
              <p className="text-sm text-gray-600">Tomado del Libro: "Descubre el llamado que el Señor te ha dado" Por Jay McSwain</p>
            </div>

            <div className="flex justify-end mb-6">
              <button
                onClick={() => setIsInviteModalOpen(true)}
                className="px-4 py-2 bg-[#8B2332] text-white rounded-md hover:bg-[#7a1e2b] transition-colors"
              >
                Enviar Invitación a Descubre
              </button>
            </div>

            {/* Test List Section */}
            <DonesTestList 
              userTests={userTests}
              onStartTest={handleStartTest}
              onResetTest={handleResetTest}
              userId={session?.user?.id}
            />

            {/* Global Results Overview Section */}
            <GlobalResultsOverview userTests={userTests} />

            {/* Personality Test Modal */}
            {isTestOpen && currentTest === 'personalidad' && (
              <PersonalityTest
                isOpen={isTestOpen}
                onClose={() => {
                  setIsTestOpen(false);
                  setCurrentTest(null);
                }}
                onComplete={handleTestComplete}
                user={{
                  id: session?.user?.id
                }}
              />
            )}

            {/* Dones Test Modal */}
            {isDonesTestOpen && currentTest === 'dones' && (
              <DonesTest
                isOpen={isDonesTestOpen}
                onClose={() => {
                  setIsDonesTestOpen(false);
                  setCurrentTest(null);
                }}
                onComplete={handleTestComplete}
                user={{
                  id: session?.user?.id
                }}
              />
            )}

            {/* Skills Test Modal */}
            {isSkillsTestOpen && currentTest === 'habilidades' && (
              <SkillsTest
                isOpen={isSkillsTestOpen}
                onClose={() => {
                  setIsSkillsTestOpen(false);
                  setCurrentTest(null);
                }}
                onComplete={handleTestComplete}
                user={{
                  id: session?.user?.id
                }}
              />
            )}

            {/* Passion Test Modal */}
            {isPassionTestOpen && currentTest === 'pasion' && (
              <div className="fixed inset-0 z-50">
                <PassionTest
                  isOpen={true}
                  onClose={() => {
                    console.log('Closing passion test');
                    setIsPassionTestOpen(false);
                    setCurrentTest(null);
                  }}
                  onComplete={handleTestComplete}
                  user={{
                    id: session?.user?.id
                  }}
                />
              </div>
            )}

            {/* Experience Test Modal */}
            {isExperienceTestOpen && currentTest === 'experiencia' && (
              <ExperienceTest
                isOpen={isExperienceTestOpen}
                onClose={() => {
                  setIsExperienceTestOpen(false);
                  setCurrentTest(null);
                }}
                onComplete={handleTestComplete}
                user={{
                  id: session?.user?.id
                }}
              />
            )}

            {/* Results Modals */}
            {isResultsOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
                <div className="min-h-screen px-4 text-center">
                  <span
                    className="inline-block h-screen align-middle"
                    aria-hidden="true"
                  >
                    &#8203;
                  </span>
                  <div className="inline-block w-full max-w-4xl my-8 text-left align-middle">
                    <div className="bg-white rounded-lg shadow-xl">
                      <div className="sticky top-0 flex justify-between items-center p-4 border-b bg-white rounded-t-lg">
                        <h2 className="text-xl font-semibold text-[#8B2332]">
                          {currentTest === 'personalidad' && 'Resultados del Test de Personalidad'}
                          {currentTest === 'dones' && 'Resultados del Test de Dones Espirituales'}
                          {currentTest === 'habilidades' && 'Resultados del Test de Habilidades'}
                          {currentTest === 'pasion' && 'Resultados del Test de Pasión'}
                        </h2>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={handleDownloadPDF}
                            className="px-4 py-2 bg-[#8B2332] text-white rounded-md hover:bg-[#7a1e2b] transition-colors flex items-center space-x-1"
                          >
                            <span>Descargar PDF</span>
                          </button>
                          <button
                            onClick={() => {
                              setIsResultsOpen(false);
                              setCurrentTest(null);
                              setTestResults(null);
                            }}
                            className="p-1 hover:bg-gray-200 rounded-full"
                          >
                            <X className="h-6 w-6 text-gray-600" />
                          </button>
                        </div>
                      </div>
                      <div className="p-4" ref={resultsRef}>
                        {currentTest === 'personalidad' && (
                          <PersonalityResults results={testResults} />
                        )}
                        {currentTest === 'dones' && (
                          <DonesResults 
                            giftResults={testResults || {}}
                            personalityResults={userTests.find(t => t.slug === 'personalidad')?.results || {}}
                          />
                        )}
                        {currentTest === 'habilidades' && (
                          <SkillsResults skillResults={testResults || {}} />
                        )}
                        {currentTest === 'pasion' && (
                          <PassionResults results={testResults || {}} />
                        )}
                        {currentTest === 'experiencia' && (
                          <ExperienceResults 
                            results={testResults || {}} 
                            key={currentTest} 
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Invite Modal */}
            {isInviteModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                <div className="bg-white rounded-lg p-6 max-w-md w-full">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Send Invite
                  </h2>
                  <EmailInvite
                    onClose={() => setIsInviteModalOpen(false)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}