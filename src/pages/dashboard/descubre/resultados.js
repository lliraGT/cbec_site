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
import GlobalResultsOverview from '@/components/GlobalResultsOverview';

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
    completedTests: [],
    personalityTraits: [],
    spiritualGifts: [],
    skillCategories: [],
    passionGroups: [],
    passionTypes: []
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

  // Get predominant personality traits (D, I, S, C)
  const getTopPersonalityTraits = (personalityResults) => {
    if (!personalityResults) return [];
    
    return Object.entries(personalityResults)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2)
      .map(([type]) => type);
  };

  // Get top 5 spiritual gifts
  const getTopDones = (donesResults) => {
    if (!donesResults) return [];
    
    return Object.entries(donesResults)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([gift]) => gift);
  };  

  // Get top 3 skill categories
  const getTopSkills = (skillsResults) => {
    if (!skillsResults) return [];
    
    return Object.entries(skillsResults)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category);
  };

  // Personality traits
  const PERSONALITY_TRAITS = [
    { value: 'D', label: 'D (Dominante)' },
    { value: 'I', label: 'I (Influyente)' },
    { value: 'S', label: 'S (Estable)' },
    { value: 'C', label: 'C (Concienzudo)' }
  ];

  // Spiritual gifts
  const SPIRITUAL_GIFTS = [
    { value: 'evangelismo', label: 'Evangelismo' },
    { value: 'liderazgo', label: 'Liderazgo' },
    { value: 'misericordia', label: 'Misericordia' },
    { value: 'administracion', label: 'Administración' },
    { value: 'profecia', label: 'Profecía' },
    { value: 'dar', label: 'Dar' },
    { value: 'ensenanza', label: 'Enseñanza' },
    { value: 'pastoreo', label: 'Pastoreo' },
    { value: 'fe', label: 'Fe' },
    { value: 'exhortacion', label: 'Exhortación' },
    { value: 'servicio', label: 'Servicio' },
    { value: 'ayuda', label: 'Ayuda' },
    { value: 'sabiduria', label: 'Sabiduría' },
    { value: 'conocimiento', label: 'Conocimiento' },
    { value: 'hospitalidad', label: 'Hospitalidad' },
    { value: 'discernimiento', label: 'Discernimiento' }
  ];

  // Skills categories
  const SKILL_CATEGORIES = [
    { value: 'R', label: 'R (Realista)' },
    { value: 'I', label: 'I (Investigador)' },
    { value: 'A', label: 'A (Artístico)' },
    { value: 'S', label: 'S (Social)' },
    { value: 'E', label: 'E (Emprendedor)' },
    { value: 'C', label: 'C (Convencional)' }
  ];

  // Passion groups (sample - you'll need to determine the most common ones)
  const PASSION_GROUPS = [
    { value: 'Niños', label: 'Niños' },
    { value: 'Jóvenes', label: 'Jóvenes' },
    { value: 'Familias', label: 'Familias' },
    { value: 'Ancianos', label: 'Ancianos' },
    { value: 'Adictos', label: 'Personas con adicciones' },
    { value: 'Indigentes', label: 'Personas sin hogar' },
    { value: 'Extranjeros', label: 'Extranjeros' },
    { value: 'Prisioneros', label: 'Prisioneros' }
  ];

  // Passion types
  const PASSION_TYPES = [
    { value: 'Desafiando', label: 'Desafiando' },
    { value: 'Defendiendo', label: 'Defendiendo' },
    { value: 'Delegando', label: 'Delegando' },
    { value: 'Creando', label: 'Creando' },
    { value: 'Mejorando', label: 'Mejorando' },
    { value: 'Influyendo', label: 'Influyendo' },
    { value: 'Liderando', label: 'Liderando' },
    { value: 'Administrando', label: 'Administrando' },
    { value: 'Organizando', label: 'Organizando' },
    { value: 'Perfeccionando', label: 'Perfeccionando' },
    { value: 'Protagonizando', label: 'Protagonizando' },
    { value: 'Innovando', label: 'Innovando' },
    { value: 'Reparando', label: 'Reparando' },
    { value: 'Sirviendo', label: 'Sirviendo' },
    { value: 'Socializando', label: 'Socializando' },
    { value: 'Enseñando', label: 'Enseñando' }
  ];

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
  
    // Personality Traits filter
    if (filters.personalityTraits.length > 0) {
      filtered = filtered.filter(result => {
        if (!result.personalityResults) return false;
        const topTraits = getTopPersonalityTraits(result.personalityResults);
        return filters.personalityTraits.some(trait => topTraits.includes(trait));
      });
    }
  
    // Spiritual Gifts filter
    if (filters.spiritualGifts.length > 0) {
      filtered = filtered.filter(result => {
        if (!result.donesResults) return false;
        const topGifts = getTopDones(result.donesResults);
        return filters.spiritualGifts.some(gift => topGifts.includes(gift));
      });
    }
  
    // Skills Categories filter
    if (filters.skillCategories.length > 0) {
      filtered = filtered.filter(result => {
        if (!result.skillsResults) return false;
        const topSkills = getTopSkills(result.skillsResults);
        return filters.skillCategories.some(category => topSkills.includes(category));
      });
    }
  
    // Passion Groups filter
    if (filters.passionGroups.length > 0) {
      filtered = filtered.filter(result => {
        if (!result.passionResults?.topFiveGroups) return false;
        return filters.passionGroups.some(group => 
          result.passionResults.topFiveGroups.includes(group)
        );
      });
    }
  
    // Passion Types filter
    if (filters.passionTypes.length > 0) {
      filtered = filtered.filter(result => {
        if (!result.passionResults?.topThreePassions) return false;
        return filters.passionTypes.some(type => 
          result.passionResults.topThreePassions.includes(type)
        );
      });
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
      
      // Clear other test-specific filters if they're incompatible with current selection
      const updatedFilters = { ...prev, [filterType]: newFilter };
      
      // Auto-filter compatibility logic:
      // When a specific test trait is selected, ensure the corresponding test is in completedTests
      if (filterType === 'personalityTraits' && newFilter.length > 0) {
        // Make sure 'personalidad' is in completedTests
        if (!updatedFilters.completedTests.includes('personalidad')) {
          updatedFilters.completedTests = [...updatedFilters.completedTests, 'personalidad'];
        }
      } else if (filterType === 'spiritualGifts' && newFilter.length > 0) {
        // Make sure 'dones' is in completedTests
        if (!updatedFilters.completedTests.includes('dones')) {
          updatedFilters.completedTests = [...updatedFilters.completedTests, 'dones'];
        }
      } else if (filterType === 'skillCategories' && newFilter.length > 0) {
        // Make sure 'habilidades' is in completedTests
        if (!updatedFilters.completedTests.includes('habilidades')) {
          updatedFilters.completedTests = [...updatedFilters.completedTests, 'habilidades'];
        }
      } else if ((filterType === 'passionGroups' || filterType === 'passionTypes') && newFilter.length > 0) {
        // Make sure 'pasion' is in completedTests
        if (!updatedFilters.completedTests.includes('pasion')) {
          updatedFilters.completedTests = [...updatedFilters.completedTests, 'pasion'];
        }
      }
      
      return updatedFilters;
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
    
    // Special case for summary which doesn't use getResultDataForTest
    if (selectedTest === 'summary') {
      const userTests = transformResultsToUserTests(selectedResult);
      
      // Check if we have valid data for at least one test
      const hasValidData = userTests.some(test => 
        test.status === 'completado' && Object.keys(test.results || {}).length > 0
      );
      
      if (!hasValidData) {
        return (
          <div className="p-8 text-center">
            <p className="text-gray-500">No hay datos válidos disponibles para mostrar un resumen completo.</p>
          </div>
        );
      }
      
      return <GlobalResultsOverview userTests={userTests} />;
    }
    
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
      // This case is now handled earlier in the function
      default:
        return null;
    }
  };

  // Function to transform selectedResult to userTests format for GlobalResultsOverview
  const transformResultsToUserTests = (result) => {
    if (!result) return [];
    
    const { personalityResults, donesResults, skillsResults, passionResults, experienceResults, completedTests } = result;
    
    return [
      {
        slug: 'personalidad',
        name: 'Test de Personalidad',
        // Only mark as completed if both in completedTests AND data exists
        status: completedTests?.includes('personalidad') && personalityResults ? 'completado' : 'pendiente',
        results: personalityResults || {}
      },
      {
        slug: 'dones',
        name: 'Test de Dones',
        status: completedTests?.includes('dones') && donesResults ? 'completado' : 'pendiente',
        results: donesResults || {}
      },
      {
        slug: 'habilidades',
        name: 'Test de Habilidades',
        status: completedTests?.includes('habilidades') && skillsResults ? 'completado' : 'pendiente',
        results: skillsResults || {}
      },
      {
        slug: 'pasion',
        name: 'Test de Pasión',
        status: completedTests?.includes('pasion') && passionResults ? 'completado' : 'pendiente',
        results: passionResults || {}
      },
      {
        slug: 'experiencia',
        name: 'Test de Experiencia',
        status: completedTests?.includes('experiencia') && experienceResults ? 'completado' : 'pendiente',
        results: experienceResults || {}
      }
    ];
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
                
                {/* Enhanced Filter UI - Replace the existing filter panel with this */}
                {isFilterOpen && (
                  <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-md shadow-lg p-4 z-10 max-h-[80vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-bold text-gray-800">Filtros</h3>
                      <button 
                        onClick={() => setFilters({
                          userType: [],
                          completedTests: [],
                          personalityTraits: [],
                          spiritualGifts: [],
                          skillCategories: [],
                          passionGroups: [],
                          passionTypes: []
                        })}
                        className="text-xs text-[#8B2332] hover:underline"
                      >
                        Limpiar filtros
                      </button>
                    </div>

                    {/* User Type Filter */}
                    <div className="mb-4 border-b pb-3">
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

                    {/* Tests Completados Filter */}
                    <div className="mb-4 border-b pb-3">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Tests Completados</h3>
                      <div className="grid grid-cols-2 gap-2">
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

                    {/* Personality Traits Filter */}
                    <div className="mb-4 border-b pb-3">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Tipo de Personalidad</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {PERSONALITY_TRAITS.map((trait) => (
                          <label key={trait.value} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={filters.personalityTraits.includes(trait.value)}
                              onChange={() => toggleFilter('personalityTraits', trait.value)}
                              className="mr-2 text-[#8B2332] focus:ring-[#8B2332]"
                              disabled={!filters.completedTests.includes('personalidad')}
                            />
                            <span className={`text-sm ${!filters.completedTests.includes('personalidad') ? 'text-gray-400' : 'text-gray-700'}`}>
                              {trait.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Spiritual Gifts Filter */}
                    <div className="mb-4 border-b pb-3">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Dones Espirituales</h3>
                      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                        {SPIRITUAL_GIFTS.map((gift) => (
                          <label key={gift.value} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={filters.spiritualGifts.includes(gift.value)}
                              onChange={() => toggleFilter('spiritualGifts', gift.value)}
                              className="mr-2 text-[#8B2332] focus:ring-[#8B2332]"
                              disabled={!filters.completedTests.includes('dones')}
                            />
                            <span className={`text-sm ${!filters.completedTests.includes('dones') ? 'text-gray-400' : 'text-gray-700'}`}>
                              {gift.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Skills Categories Filter */}
                    <div className="mb-4 border-b pb-3">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Habilidades</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {SKILL_CATEGORIES.map((skill) => (
                          <label key={skill.value} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={filters.skillCategories.includes(skill.value)}
                              onChange={() => toggleFilter('skillCategories', skill.value)}
                              className="mr-2 text-[#8B2332] focus:ring-[#8B2332]"
                              disabled={!filters.completedTests.includes('habilidades')}
                            />
                            <span className={`text-sm ${!filters.completedTests.includes('habilidades') ? 'text-gray-400' : 'text-gray-700'}`}>
                              {skill.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Passion Groups Filter */}
                    <div className="mb-4 border-b pb-3">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Grupos de Pasión</h3>
                      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                        {PASSION_GROUPS.map((group) => (
                          <label key={group.value} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={filters.passionGroups.includes(group.value)}
                              onChange={() => toggleFilter('passionGroups', group.value)}
                              className="mr-2 text-[#8B2332] focus:ring-[#8B2332]"
                              disabled={!filters.completedTests.includes('pasion')}
                            />
                            <span className={`text-sm ${!filters.completedTests.includes('pasion') ? 'text-gray-400' : 'text-gray-700'}`}>
                              {group.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Passion Types Filter */}
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Formas de Expresar Pasión</h3>
                      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                        {PASSION_TYPES.map((type) => (
                          <label key={type.value} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={filters.passionTypes.includes(type.value)}
                              onChange={() => toggleFilter('passionTypes', type.value)}
                              className="mr-2 text-[#8B2332] focus:ring-[#8B2332]"
                              disabled={!filters.completedTests.includes('pasion')}
                            />
                            <span className={`text-sm ${!filters.completedTests.includes('pasion') ? 'text-gray-400' : 'text-gray-700'}`}>
                              {type.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            
              {/* Active Filters */}
              {(filters.userType.length > 0 || 
                filters.completedTests.length > 0 || 
                filters.personalityTraits.length > 0 ||
                filters.spiritualGifts.length > 0 ||
                filters.skillCategories.length > 0 ||
                filters.passionGroups.length > 0 ||
                filters.passionTypes.length > 0) && (
                <div className="mb-4 flex flex-wrap gap-2 items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <span className="text-sm font-medium text-gray-700 mr-1">Filtros activos:</span>
                  
                  {/* User Type Filters */}
                  {filters.userType.map(type => (
                    <span 
                      key={`type-${type}`}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center"
                    >
                      {type === 'application' ? 'Aplicación' : 'Invitado'}
                      <X 
                        className="ml-1 h-3 w-3 cursor-pointer" 
                        onClick={() => toggleFilter('userType', type)}
                      />
                    </span>
                  ))}
                  
                  {/* Completed Tests Filters */}
                  {filters.completedTests.map(test => (
                    <span 
                      key={`test-${test}`}
                      className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs flex items-center"
                    >
                      {TEST_TYPES[test]}
                      <X 
                        className="ml-1 h-3 w-3 cursor-pointer" 
                        onClick={() => toggleFilter('completedTests', test)}
                      />
                    </span>
                  ))}
                  
                  {/* Personality Traits Filters */}
                  {filters.personalityTraits.map(trait => {
                    const traitData = PERSONALITY_TRAITS.find(t => t.value === trait);
                    return (
                      <span 
                        key={`trait-${trait}`}
                        className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs flex items-center"
                      >
                        {traitData?.label || trait}
                        <X 
                          className="ml-1 h-3 w-3 cursor-pointer" 
                          onClick={() => toggleFilter('personalityTraits', trait)}
                        />
                      </span>
                    );
                  })}
                  
                  {/* Spiritual Gifts Filters */}
                  {filters.spiritualGifts.map(gift => {
                    const giftData = SPIRITUAL_GIFTS.find(g => g.value === gift);
                    return (
                      <span 
                        key={`gift-${gift}`}
                        className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs flex items-center"
                      >
                        {giftData?.label || gift}
                        <X 
                          className="ml-1 h-3 w-3 cursor-pointer" 
                          onClick={() => toggleFilter('spiritualGifts', gift)}
                        />
                      </span>
                    );
                  })}
                  
                  {/* Skill Categories Filters */}
                  {filters.skillCategories.map(skill => {
                    const skillData = SKILL_CATEGORIES.find(s => s.value === skill);
                    return (
                      <span 
                        key={`skill-${skill}`}
                        className="px-2 py-1 bg-teal-100 text-teal-800 rounded-full text-xs flex items-center"
                      >
                        {skillData?.label || skill}
                        <X 
                          className="ml-1 h-3 w-3 cursor-pointer" 
                          onClick={() => toggleFilter('skillCategories', skill)}
                        />
                      </span>
                    );
                  })}
                  
                  {/* Passion Groups Filters */}
                  {filters.passionGroups.map(group => {
                    const groupData = PASSION_GROUPS.find(g => g.value === group);
                    return (
                      <span 
                        key={`group-${group}`}
                        className="px-2 py-1 bg-pink-100 text-pink-800 rounded-full text-xs flex items-center"
                      >
                        {groupData?.label || group}
                        <X 
                          className="ml-1 h-3 w-3 cursor-pointer" 
                          onClick={() => toggleFilter('passionGroups', group)}
                        />
                      </span>
                    );
                  })}
                  
                  {/* Passion Types Filters */}
                  {filters.passionTypes.map(type => {
                    const typeData = PASSION_TYPES.find(t => t.value === type);
                    return (
                      <span 
                        key={`ptype-${type}`}
                        className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs flex items-center"
                      >
                        {typeData?.label || type}
                        <X 
                          className="ml-1 h-3 w-3 cursor-pointer" 
                          onClick={() => toggleFilter('passionTypes', type)}
                        />
                      </span>
                    );
                  })}
                  
                  <button 
                    onClick={() => setFilters({
                      userType: [],
                      completedTests: [],
                      personalityTraits: [],
                      spiritualGifts: [],
                      skillCategories: [],
                      passionGroups: [],
                      passionTypes: []
                    })}
                    className="ml-auto text-xs text-[#8B2332] hover:underline"
                  >
                    Limpiar todos
                  </button>
                </div>
              )}
              
              {/* Results Table (Full width) */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-6">
                <div className="p-4 border-b bg-gray-50">
                  <h2 className="text-lg font-medium text-gray-900">
                    Usuarios ({processedResults.length})
                  </h2>
                </div>
                <div className="overflow-auto max-h-[calc(100vh-500px)]">
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
                          {/* Add Summary option at the beginning */}
                          <button 
                            onClick={() => handleTestSelect('summary')}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                              selectedTest === 'summary'
                                ? 'bg-[#8B2332] text-white'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                          >
                            Resumen
                          </button>
                          
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
        
      </main>
    </div>
  );
}