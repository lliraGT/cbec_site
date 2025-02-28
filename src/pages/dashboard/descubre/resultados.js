// src/pages/dashboard/descubre/resultados.js
import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import TopBar from '@/components/TopBar';
import Sidebar from '@/components/Sidebar';
import { Search, Filter, Users, UserCheck, X } from 'lucide-react';
import PersonalityResults from '@/components/test/results/PersonalityResults';
import DonesResults from '@/components/test/results/DonesResults';
import SkillsResults from '@/components/test/results/SkillsResults';
import PassionResults from '@/components/test/results/PassionResults';
import ExperienceResults from '@/components/test/results/ExperienceResults';

export default function ResultadosPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    userType: [],
    completedTests: []
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();

  const AUTHORIZED_ROLES = ['admin', 'elder', 'staff'];
  const TEST_TYPES = {
    personalidad: 'Personalidad',
    dones: 'Dones Espirituales',
    habilidades: 'Habilidades',
    pasion: 'Pasión',
    experiencia: 'Experiencia'
  };

  useEffect(() => {
    const fetchResults = async () => {
      if (!session?.user?.role || !AUTHORIZED_ROLES.includes(session.user.role.toLowerCase())) {
        router.push('/dashboard');
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch('/api/test-results', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        // Try to parse the response even if it's not ok
        const data = await response.json().catch(e => {
          console.error('Error parsing JSON:', e);
          return [];
        });
        
        if (Array.isArray(data)) {
          setResults(data);
          setError(null);
        } else if (data.error) {
          console.warn('API returned error:', data.error);
          // Don't set error if we still have data
          if (!data.length) {
            setError(data.error);
          }
        }
      } catch (err) {
        console.error('Detailed error fetching results:', err);
        // Don't update error state if we already have results displayed
        if (results.length === 0) {
          setError(`Failed to fetch results: ${err.message}`);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchResults();
    }
  }, [session, router]);

  // Filtered and processed results
  const processedResults = useMemo(() => {
    let filtered = results;

    // Search filter
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      filtered = filtered.filter(result => 
        `${result.firstName} ${result.lastName}`.toLowerCase().includes(searchTermLower) ||
        result.email?.toLowerCase().includes(searchTermLower)
      );
    }

    // User Type filter
    if (filters.userType.length > 0) {
      filtered = filtered.filter(result => 
        filters.userType.includes(result.userType || 'guest')
      );
    }

    // Completed Tests filter
    if (filters.completedTests.length > 0) {
      filtered = filtered.filter(result => 
        filters.completedTests.every(test => 
          result.completedTests?.includes(test)
        )
      );
    }

    return filtered;
  }, [results, searchTerm, filters]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleResultSelect = (result) => {
    setSelectedResult(result);
    // If the result has completed tests, select the first one by default
    if (result.completedTests && result.completedTests.length > 0) {
      setSelectedTest(result.completedTests[0]);
    } else {
      setSelectedTest(null);
    }
  };

  const handleTestSelect = (testType) => {
    setSelectedTest(testType);
  };

  const toggleFilter = (filterType, value) => {
    setFilters(prev => {
      const currentFilter = prev[filterType];
      const newFilter = currentFilter.includes(value)
        ? currentFilter.filter(f => f !== value)
        : [...currentFilter, value];
      
      return {
        ...prev,
        [filterType]: newFilter
      };
    });
  };

  const renderTestBadges = (completedTests) => {
    if (!completedTests || !Array.isArray(completedTests)) return null;
    
    return completedTests.map(test => (
      <span
        key={test}
        className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 mr-1"
      >
        {TEST_TYPES[test] || test}
      </span>
    ));
  };

  // Function to get the appropriate result data based on the test type
  const getResultDataForTest = (result, testType) => {
    if (!result) return null;
    
    switch (testType) {
      case 'personalidad':
        return result.personalityResults;
      case 'dones':
        return result.donesResults;
      case 'habilidades':
        return result.skillsResults;
      case 'pasion':
        return result.passionResults;
      case 'experiencia':
        return result.experienceResults;
      default:
        return null;
    }
  };

  // Function to render the appropriate test results component
  const renderTestResults = () => {
    if (!selectedResult || !selectedTest) return null;
    
    const resultData = getResultDataForTest(selectedResult, selectedTest);
    
    if (!resultData) {
      return (
        <div className="p-8 text-center">
          <p className="text-gray-500">No hay datos disponibles para este test.</p>
        </div>
      );
    }
    
    switch (selectedTest) {
      case 'personalidad':
        return <PersonalityResults results={resultData} />;
      case 'dones':
        // Pass both dones results and personality results if available
        return (
          <DonesResults 
            giftResults={resultData || {}} 
            personalityResults={selectedResult.personalityResults || {}}
          />
        );
      case 'habilidades':
        return <SkillsResults skillResults={resultData} />;
      case 'pasion':
        return <PassionResults results={resultData} />;
      case 'experiencia':
        return <ExperienceResults results={resultData} />;
      default:
        return null;
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando resultados...</p>
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
            <h1 className="text-2xl font-semibold text-burgundy-700 mb-8">Resultados de Tests</h1>
            
            {error && results.length === 0 && (
              <div className="mb-4 bg-red-50 border border-red-300 text-red-700 p-4 rounded-md">
                {error}
              </div>
            )}
            
            {/* Search and Filter Bar */}
            <div className="mb-6 flex flex-wrap gap-4">
              <div className="flex-grow relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar por nombre o email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-[#8B2332] focus:border-[#8B2332] sm:text-sm"
                />
              </div>
              
              <div className="relative">
                <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  <Filter className="h-5 w-5 mr-2" />
                  Filtros
                  {(filters.userType.length + filters.completedTests.length) > 0 && (
                    <span className="ml-2 bg-[#8B2332] text-white rounded-full px-2 py-0.5 text-xs">
                      {filters.userType.length + filters.completedTests.length}
                    </span>
                  )}
                </button>
                
                {isFilterOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-md shadow-lg p-4 z-10">
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Tipo de Usuario</h3>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.userType.includes('application')}
                            onChange={() => toggleFilter('userType', 'application')}
                            className="mr-2 text-[#8B2332] focus:ring-[#8B2332]"
                          />
                          <Users className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm text-gray-700">Usuarios de Aplicación</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.userType.includes('guest')}
                            onChange={() => toggleFilter('userType', 'guest')}
                            className="mr-2 text-[#8B2332] focus:ring-[#8B2332]"
                          />
                          <UserCheck className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm text-gray-700">Usuarios Invitados</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Tests Completados</h3>
                      <div className="space-y-2">
                        {Object.entries(TEST_TYPES).map(([type, label]) => (
                          <label key={type} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={filters.completedTests.includes(type)}
                              onChange={() => toggleFilter('completedTests', type)}
                              className="mr-2 text-[#8B2332] focus:ring-[#8B2332]"
                            />
                            <span className="text-sm text-gray-700">{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Results Table */}
              <div className="lg:col-span-1 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b bg-gray-50">
                  <h2 className="text-lg font-medium text-gray-900">
                    Usuarios ({processedResults.length})
                  </h2>
                </div>
                <div className="overflow-auto max-h-[calc(100vh-280px)]">
                  {processedResults.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      {searchTerm || filters.userType.length > 0 || filters.completedTests.length > 0
                        ? 'No se encontraron resultados con los filtros actuales.'
                        : 'No hay resultados disponibles.'}
                    </div>
                  ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tests</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {processedResults.map((result) => (
                          <tr 
                            key={result._id} 
                            className={`hover:bg-gray-50 cursor-pointer ${selectedResult?._id === result._id ? 'bg-gray-100' : ''}`}
                            onClick={() => handleResultSelect(result)}
                          >
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {result.firstName} {result.lastName}
                              </div>
                              <div className="text-xs text-gray-500">{result.email}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                result.userType === 'application' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {result.userType === 'application' ? 'Aplicación' : 'Invitado'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-1">
                                {renderTestBadges(result.completedTests)}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
              
              {/* Test Results */}
              <div className="lg:col-span-2">
                {selectedResult ? (
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm h-full">
                    <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                      <div>
                        <h2 className="text-lg font-medium text-gray-900">
                          {selectedResult.firstName} {selectedResult.lastName}
                        </h2>
                        <p className="text-sm text-gray-500">{selectedResult.email}</p>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex flex-wrap gap-1">
                          {selectedResult.completedTests?.map(testType => (
                            <button 
                              key={testType}
                              onClick={() => handleTestSelect(testType)}
                              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                selectedTest === testType
                                  ? 'bg-[#8B2332] text-white'
                                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                              }`}
                            >
                              {TEST_TYPES[testType]}
                            </button>
                          ))}
                        </div>
                        
                        <button 
                          onClick={() => setSelectedResult(null)}
                          className="p-1 hover:bg-gray-200 rounded-full"
                        >
                          <X className="h-5 w-5 text-gray-500" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-4 overflow-auto max-h-[calc(100vh-280px)]">
                      {selectedTest ? (
                        renderTestResults()
                      ) : (
                        <div className="p-8 text-center">
                          <p className="text-gray-500">
                            {selectedResult.completedTests?.length > 0
                              ? 'Selecciona un test para ver los resultados.'
                              : 'No hay tests completados para este usuario.'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-center h-full">
                    <div className="p-8 text-center">
                      <p className="text-gray-500">Selecciona un usuario para ver sus resultados.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}