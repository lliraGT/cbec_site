// src/pages/dashboard/descubre/resultados.js
import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import TopBar from '@/components/TopBar';
import Sidebar from '@/components/Sidebar';
import { Search, Filter, Users, UserCheck } from 'lucide-react';
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
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
        }

        const data = await response.json();
        setResults(data);
      } catch (err) {
        console.error('Detailed error fetching results:', err);
        setError(`Failed to fetch results: ${err.message}`);
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
        result.email.toLowerCase().includes(searchTermLower)
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
          result.completedTests.includes(test)
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
    setSelectedTest(null);
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
    return completedTests.map(test => (
      <span
        key={test}
        className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 mr-1"
      >
        {TEST_TYPES[test]}
      </span>
    ));
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
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-semibold text-burgundy-700 mb-8">Resultados de Tests</h1>
            
            {/* Search and Filter Bar */}
            <div className="mb-6 flex space-x-4">
              <div className="flex-grow relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar por nombre o email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-[#8B2332] focus:border-[#8B2332] sm:text-sm"
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

            {/* Results Table */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo de Usuario</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tests Completados</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {processedResults.map((result) => (
                    <tr 
                      key={result._id} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleResultSelect(result)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {result.firstName} {result.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {result.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          result.userType === 'application' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {result.userType === 'application' ? 'Aplicación' : 'Invitado'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderTestBadges(result.completedTests)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}