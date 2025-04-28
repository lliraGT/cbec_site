import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, ArrowUpDown, ChevronDown, ChevronUp, Info, Users, Star, Calendar } from 'lucide-react';
import _ from 'lodash';

// Componente de Conexión Ministerial
const MinistryMatching = ({ userTests = [], ministryOpportunities = null }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    personalityTypes: [],
    spiritualGifts: [],
    skillTypes: [],
    passionGroups: [],
    commitmentLevel: []
  });
  const [sortConfig, setSortConfig] = useState({ key: 'compatibilityScore', direction: 'desc' });
  const [expandedMinistry, setExpandedMinistry] = useState(null);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [ministries, setMinistries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Obtener datos de pruebas con valores predeterminados seguros
  const getTestData = (slug) => {
    const test = userTests.find(t => t?.slug === slug);
    return test?.status === 'completado' ? test.results || {} : {};
  };

  const personalityResults = getTestData('personalidad');
  const donesResults = getTestData('dones');
  const skillsResults = getTestData('habilidades');
  const passionResults = getTestData('pasion');
  const experienceResults = getTestData('experiencia');

  // Obtener principales rasgos de personalidad
  const personalityTraits = Object.keys(personalityResults).length > 0
    ? Object.entries(personalityResults)
        .sort(([, a], [, b]) => (b || 0) - (a || 0))
        .slice(0, 2)
        .map(([type]) => type)
    : [];

  // Obtener principales dones espirituales
  const topDones = Object.keys(donesResults).length > 0
    ? Object.entries(donesResults)
        .sort(([, a], [, b]) => (b || 0) - (a || 0))
        .slice(0, 5)
        .map(([gift]) => gift)
    : [];

  // Obtener principales habilidades
  const topSkills = Object.keys(skillsResults).length > 0
    ? Object.entries(skillsResults)
        .sort(([, a], [, b]) => (b || 0) - (a || 0))
        .slice(0, 3)
        .map(([category]) => category)
    : [];

  // Obtener áreas principales de pasión
  const passionGroups = passionResults?.topFiveGroups || [];
  const passionTypes = passionResults?.topThreePassions || [];

  // Obtener o preparar oportunidades de ministerio
  useEffect(() => {
    // Esto normalmente sería una llamada a la API
    const fetchMinistryOpportunities = async () => {
      setIsLoading(true);
      try {
        if (ministryOpportunities) {
          setMinistries(ministryOpportunities);
        } else {
          // Ministerios predeterminados si no se proporciona ninguno
          setMinistries(ministeriosPredeterminados);
        }
      } catch (error) {
        console.error('Error al cargar oportunidades de ministerio:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMinistryOpportunities();
  }, [ministryOpportunities]);

  // Calcular puntuaciones de compatibilidad para todos los ministerios
  const matchedMinistries = useMemo(() => {
    if (!ministries.length) return [];

    return ministries.map(ministry => {
      // Inicializar las razones de coincidencia para este ministerio
      const matchReasons = [];
      
      // Calcular compatibilidad de personalidad (0-100)
      let personalityScore = 0;
      if (personalityTraits.length > 0) {
        const matchingPersonalityTypes = ministry.recommendedTraits.personalityTypes.filter(
          type => personalityTraits.includes(type)
        );
        personalityScore = (matchingPersonalityTypes.length / ministry.recommendedTraits.personalityTypes.length) * 100;
        
        if (matchingPersonalityTypes.length > 0) {
          matchReasons.push({
            type: 'personality',
            description: `Tu tipo de personalidad ${matchingPersonalityTypes.join('/')} es muy adecuado para este ministerio.`
          });
        }
      }

      // Calcular compatibilidad de dones espirituales (0-100)
      let giftsScore = 0;
      if (topDones.length > 0) {
        const matchingGifts = ministry.recommendedTraits.spiritualGifts.filter(
          gift => topDones.includes(gift)
        );
        giftsScore = (matchingGifts.length / ministry.recommendedTraits.spiritualGifts.length) * 100;
        
        if (matchingGifts.length > 0) {
          const giftLabels = matchingGifts.map(gift => {
            const labels = {
              evangelismo: 'Evangelismo',
              liderazgo: 'Liderazgo',
              misericordia: 'Misericordia',
              administracion: 'Administración',
              profecia: 'Profecía',
              dar: 'Dar',
              ensenanza: 'Enseñanza',
              pastoreo: 'Pastoreo',
              fe: 'Fe',
              exhortacion: 'Exhortación',
              servicio: 'Servicio',
              ayuda: 'Ayuda',
              sabiduria: 'Sabiduría',
              conocimiento: 'Conocimiento',
              hospitalidad: 'Hospitalidad',
              discernimiento: 'Discernimiento'
            };
            return labels[gift] || gift;
          });
          
          matchReasons.push({
            type: 'gifts',
            description: `Tus dones espirituales de ${giftLabels.join(', ')} son valiosos en este ministerio.`
          });
        }
      }

      // Calcular compatibilidad de habilidades (0-100)
      let skillsScore = 0;
      if (topSkills.length > 0) {
        const matchingSkills = ministry.recommendedTraits.skillTypes.filter(
          skill => topSkills.includes(skill)
        );
        skillsScore = (matchingSkills.length / ministry.recommendedTraits.skillTypes.length) * 100;
        
        if (matchingSkills.length > 0) {
          const skillLabels = matchingSkills.map(skill => {
            const labels = {
              R: 'Práctico/Manuales', 
              I: 'Analítico/Investigación',
              A: 'Creativo/Artístico',
              S: 'Social/Ayudador',
              E: 'Emprendedor/Liderazgo',
              C: 'Detallista/Organizacional'
            };
            return labels[skill] || skill;
          });
          
          matchReasons.push({
            type: 'skills',
            description: `Tus habilidades de ${skillLabels.join(', ')} son necesarias en este ministerio.`
          });
        }
      }

      // Calcular compatibilidad de pasión (0-100)
      let passionScore = 0;
      if (passionGroups.length > 0) {
        const relevantPassionGroups = ministry.recommendedTraits.passionGroups || [];
        const matchingPassions = relevantPassionGroups.filter(
          passionGroup => passionGroups.some(pg => pg.toLowerCase().includes(passionGroup.toLowerCase()))
        );
        passionScore = relevantPassionGroups.length > 0 
          ? (matchingPassions.length / relevantPassionGroups.length) * 100 
          : 0;
        
        if (matchingPassions.length > 0) {
          const passionLabels = matchingPassions.map(passion => {
            const labels = {
              'Children': 'Niños',
              'Youth': 'Jóvenes',
              'Elderly': 'Ancianos',
              'Families': 'Familias',
              'Homeless': 'Personas sin hogar',
              'Addicts': 'Adicciones',
              'International': 'Internacional',
              'Prayer': 'Oración',
              'Worship': 'Adoración',
              'Teaching': 'Enseñanza'
            };
            return labels[passion] || passion;
          });
          
          matchReasons.push({
            type: 'passion',
            description: `Tu pasión por ${passionLabels.join(', ')} se alinea perfectamente con el enfoque de este ministerio.`
          });
        }
      }

      // Calcular relevancia de experiencia (0-100)
      let experienceScore = 0;
      const relevantExperiences = ministry.recommendedTraits.relevantExperiences || [];
      
      if (experienceResults?.topTwoExperiences?.length > 0 && relevantExperiences.length > 0) {
        const matchingExperiences = relevantExperiences.filter(
          exp => experienceResults.topTwoExperiences.some(
            userExp => userExp.toLowerCase().includes(exp.toLowerCase())
          )
        );
        experienceScore = (matchingExperiences.length / relevantExperiences.length) * 100;
        
        if (matchingExperiences.length > 0) {
          matchReasons.push({
            type: 'experience',
            description: `Tus experiencias de vida te hacen especialmente efectivo en esta área.`
          });
        }
      }

      // Calcular puntuación general de compatibilidad (promedio ponderado)
      const weights = {
        personality: 0.15,
        gifts: 0.35,
        skills: 0.20,
        passion: 0.20,
        experience: 0.10
      };
      
      const compatibilityScore = Math.round(
        (personalityScore * weights.personality) +
        (giftsScore * weights.gifts) +
        (skillsScore * weights.skills) +
        (passionScore * weights.passion) +
        (experienceScore * weights.experience)
      );

      return {
        ...ministry,
        compatibilityScore,
        matchReasons,
        componentScores: {
          personalityScore,
          giftsScore,
          skillsScore,
          passionScore,
          experienceScore
        }
      };
    });
  }, [ministries, personalityTraits, topDones, topSkills, passionGroups, experienceResults]);

  // Aplicar filtrado de búsqueda
  const filteredMinistries = useMemo(() => {
    if (!matchedMinistries.length) return [];

    return matchedMinistries.filter(ministry => {
      // Búsqueda de texto
      const matchesSearch = searchTerm === '' || 
        ministry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ministry.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtrado por filtros seleccionados
      const matchesPersonality = selectedFilters.personalityTypes.length === 0 || 
        ministry.recommendedTraits.personalityTypes.some(type => 
          selectedFilters.personalityTypes.includes(type)
        );
      
      const matchesGifts = selectedFilters.spiritualGifts.length === 0 || 
        ministry.recommendedTraits.spiritualGifts.some(gift => 
          selectedFilters.spiritualGifts.includes(gift)
        );
      
      const matchesSkills = selectedFilters.skillTypes.length === 0 || 
        ministry.recommendedTraits.skillTypes.some(skill => 
          selectedFilters.skillTypes.includes(skill)
        );
      
      const matchesPassion = selectedFilters.passionGroups.length === 0 || 
        (ministry.recommendedTraits.passionGroups && 
          ministry.recommendedTraits.passionGroups.some(group => 
            selectedFilters.passionGroups.includes(group)
          )
        );
      
      const matchesCommitment = selectedFilters.commitmentLevel.length === 0 || 
        selectedFilters.commitmentLevel.includes(ministry.commitmentLevel);
      
      return matchesSearch && matchesPersonality && matchesGifts && 
             matchesSkills && matchesPassion && matchesCommitment;
    });
  }, [matchedMinistries, searchTerm, selectedFilters]);

  // Aplicar ordenamiento
  const sortedMinistries = useMemo(() => {
    if (!filteredMinistries.length) return [];

    const sorted = [...filteredMinistries];
    
    sorted.sort((a, b) => {
      if (sortConfig.key === 'name') {
        return sortConfig.direction === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortConfig.key === 'compatibilityScore') {
        return sortConfig.direction === 'asc' 
          ? a.compatibilityScore - b.compatibilityScore
          : b.compatibilityScore - a.compatibilityScore;
      } else if (sortConfig.key === 'commitmentLevel') {
        const commitmentValues = { 'Low': 1, 'Medium': 2, 'High': 3 };
        return sortConfig.direction === 'asc' 
          ? commitmentValues[a.commitmentLevel] - commitmentValues[b.commitmentLevel]
          : commitmentValues[b.commitmentLevel] - commitmentValues[a.commitmentLevel];
      }
      return 0;
    });
    
    return sorted;
  }, [filteredMinistries, sortConfig]);

  // Manejar solicitud de ordenamiento
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Manejar cambios de filtro
  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      
      if (newFilters[filterType].includes(value)) {
        newFilters[filterType] = newFilters[filterType].filter(item => item !== value);
      } else {
        newFilters[filterType] = [...newFilters[filterType], value];
      }
      
      return newFilters;
    });
  };

  // Limpiar todos los filtros
  const clearFilters = () => {
    setSelectedFilters({
      personalityTypes: [],
      spiritualGifts: [],
      skillTypes: [],
      passionGroups: [],
      commitmentLevel: []
    });
    setSearchTerm('');
  };

  // Obtener etiqueta de compatibilidad basada en la puntuación
  const getCompatibilityLabel = (score) => {
    if (score >= 80) return { text: 'Excelente Coincidencia', color: 'bg-green-500' };
    if (score >= 60) return { text: 'Buena Coincidencia', color: 'bg-blue-500' };
    if (score >= 40) return { text: 'Coincidencia Moderada', color: 'bg-yellow-500' };
    return { text: 'Considerar Explorar', color: 'bg-gray-500' };
  };

  // Obtener elemento de nivel de compromiso con estilo apropiado
  const getCommitmentLevel = (level) => {
    const styles = {
      'Low': 'bg-green-100 text-green-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'High': 'bg-red-100 text-red-800'
    };
    
    const commitmentLabels = {
      'Low': 'Compromiso Bajo',
      'Medium': 'Compromiso Medio', 
      'High': 'Compromiso Alto'
    };

    return (
      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${styles[level]}`}>
        {commitmentLabels[level]}
      </span>
    );
  };

  // Definir todas las opciones de filtros disponibles
  const filterOptions = {
    personalityTypes: [
      { value: 'D', label: 'D (Dominante)' },
      { value: 'I', label: 'I (Influyente)' },
      { value: 'S', label: 'S (Estable)' },
      { value: 'C', label: 'C (Concienzudo)' }
    ],
    spiritualGifts: [
      { value: 'administracion', label: 'Administración' },
      { value: 'ayuda', label: 'Ayuda' },
      { value: 'conocimiento', label: 'Conocimiento' },
      { value: 'dar', label: 'Dar' },
      { value: 'discernimiento', label: 'Discernimiento' },
      { value: 'ensenanza', label: 'Enseñanza' },
      { value: 'evangelismo', label: 'Evangelismo' },
      { value: 'exhortacion', label: 'Exhortación' },
      { value: 'fe', label: 'Fe' },
      { value: 'hospitalidad', label: 'Hospitalidad' },
      { value: 'liderazgo', label: 'Liderazgo' },
      { value: 'misericordia', label: 'Misericordia' },
      { value: 'pastoreo', label: 'Pastoreo' },
      { value: 'profecia', label: 'Profecía' },
      { value: 'sabiduria', label: 'Sabiduría' },
      { value: 'servicio', label: 'Servicio' }
    ],
    skillTypes: [
      { value: 'R', label: 'Realista (Práctico)' },
      { value: 'I', label: 'Investigador (Analítico)' },
      { value: 'A', label: 'Artístico (Creativo)' },
      { value: 'S', label: 'Social (Ayudador)' },
      { value: 'E', label: 'Emprendedor (Líder)' },
      { value: 'C', label: 'Convencional (Organizado)' }
    ],
    passionGroups: [
      { value: 'Children', label: 'Niños' },
      { value: 'Youth', label: 'Jóvenes' },
      { value: 'Elderly', label: 'Ancianos' },
      { value: 'Families', label: 'Familias' },
      { value: 'Homeless', label: 'Personas sin hogar' },
      { value: 'Addicts', label: 'Recuperación de adicciones' },
      { value: 'International', label: 'Internacional' },
      { value: 'Prayer', label: 'Oración' },
      { value: 'Worship', label: 'Adoración' },
      { value: 'Teaching', label: 'Enseñanza' }
    ],
    commitmentLevel: [
      { value: 'Low', label: 'Compromiso Bajo' },
      { value: 'Medium', label: 'Compromiso Medio' },
      { value: 'High', label: 'Compromiso Alto' }
    ]
  };

  // Verificar si se ha completado alguna prueba
  const hasCompletedTests = userTests.some(test => test?.status === 'completado');

  // Si no se han completado pruebas, mostrar un mensaje apropiado
  if (!hasCompletedTests) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <h2 className="text-xl font-bold text-[#8B2332] mb-4">Conexión Ministerial</h2>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-6">
          <p className="text-amber-800">
            Por favor completa al menos una evaluación de personalidad para ver recomendaciones de ministerios.
          </p>
        </div>
        <button 
          onClick={() => window.location.href = '/dashboard/dones'}
          className="px-4 py-2 bg-[#8B2332] text-white rounded hover:bg-[#7a1e2b] transition-colors"
        >
          Ir a Evaluaciones
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-[#8B2332]">Conexión Ministerial</h2>
        <p className="text-gray-600 mt-1">Encuentra oportunidades de ministerio que se alineen con tus dones y llamado único</p>
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div className="p-4 md:p-6 border-b bg-gray-50">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Campo de Búsqueda */}
          <div className="relative w-full md:w-1/3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar ministerios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B2332] focus:border-[#8B2332]"
            />
          </div>

          {/* Botón de Alternar Filtros */}
          <button
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
          >
            <Filter className="h-5 w-5 mr-2 text-gray-600" />
            <span className="text-gray-700">Filtros</span>
            {Object.values(selectedFilters).flat().length > 0 && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#8B2332] text-white">
                {Object.values(selectedFilters).flat().length}
              </span>
            )}
          </button>

          {/* Menú Desplegable de Ordenación */}
          <div className="relative">
            <button
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
            >
              <ArrowUpDown className="h-5 w-5 mr-2 text-gray-600" />
              <span className="text-gray-700">Ordenar</span>
              <ChevronDown className="h-4 w-4 ml-1 text-gray-600" />
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10 hidden">
              <button 
                onClick={() => requestSort('compatibilityScore')}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
              >
                Por Compatibilidad
              </button>
              <button 
                onClick={() => requestSort('name')}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
              >
                Por Nombre
              </button>
              <button 
                onClick={() => requestSort('commitmentLevel')}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
              >
                Por Nivel de Compromiso
              </button>
            </div>
          </div>

          {/* Limpiar Filtros (solo se muestra si se aplican filtros) */}
          {Object.values(selectedFilters).flat().length > 0 && (
            <button
              onClick={clearFilters}
              className="text-[#8B2332] hover:text-[#7a1e2b] transition-colors"
            >
              Limpiar todos los filtros
            </button>
          )}
        </div>

        {/* Panel de Filtros */}
        {isFilterPanelOpen && (
          <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
              {/* Filtros de Tipo de Personalidad */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Tipo de Personalidad</h3>
                <div className="space-y-2">
                  {filterOptions.personalityTypes.map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedFilters.personalityTypes.includes(option.value)}
                        onChange={() => handleFilterChange('personalityTypes', option.value)}
                        className="rounded text-[#8B2332] focus:ring-[#8B2332] h-4 w-4"
                      />
                      <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filtros de Dones Espirituales */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Dones Espirituales</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                  {filterOptions.spiritualGifts.map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedFilters.spiritualGifts.includes(option.value)}
                        onChange={() => handleFilterChange('spiritualGifts', option.value)}
                        className="rounded text-[#8B2332] focus:ring-[#8B2332] h-4 w-4"
                      />
                      <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filtros de Habilidades */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Habilidades</h3>
                <div className="space-y-2">
                  {filterOptions.skillTypes.map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedFilters.skillTypes.includes(option.value)}
                        onChange={() => handleFilterChange('skillTypes', option.value)}
                        className="rounded text-[#8B2332] focus:ring-[#8B2332] h-4 w-4"
                      />
                      <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filtros de Grupos de Pasión */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Áreas de Pasión</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                  {filterOptions.passionGroups.map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedFilters.passionGroups.includes(option.value)}
                        onChange={() => handleFilterChange('passionGroups', option.value)}
                        className="rounded text-[#8B2332] focus:ring-[#8B2332] h-4 w-4"
                      />
                      <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filtros de Nivel de Compromiso */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Nivel de Compromiso</h3>
                <div className="space-y-2">
                  {filterOptions.commitmentLevel.map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedFilters.commitmentLevel.includes(option.value)}
                        onChange={() => handleFilterChange('commitmentLevel', option.value)}
                        className="rounded text-[#8B2332] focus:ring-[#8B2332] h-4 w-4"
                      />
                      <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Estado de Carga */}
      {isLoading ? (
        <div className="p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B2332] mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando oportunidades de ministerio...</p>
        </div>
      ) : (
        <>
          {/* Recuento de Resultados */}
          <div className="px-6 py-3 border-b bg-gray-50">
            <p className="text-sm text-gray-600">
              Mostrando <span className="font-medium">{sortedMinistries.length}</span> oportunidades de ministerio
              {Object.values(selectedFilters).flat().length > 0 && ' (filtradas)'}
            </p>
          </div>

          {/* Sin Resultados */}
          {sortedMinistries.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-gray-600">No se encontraron oportunidades de ministerio que coincidan con tu búsqueda.</p>
              {Object.values(selectedFilters).flat().length > 0 && (
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 bg-[#8B2332] text-white rounded hover:bg-[#7a1e2b] transition-colors"
                >
                  Limpiar Filtros
                </button>
              )}
            </div>
          )}

          {/* Lista de Resultados */}
          <div className="divide-y">
            {sortedMinistries.map((ministry) => {
              const compatibilityLabel = getCompatibilityLabel(ministry.compatibilityScore);
              
              return (
                <div key={ministry.id} className="p-6">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{ministry.name}</h3>
                        <span className={`ml-3 px-2 py-1 rounded-full text-xs text-white font-medium ${compatibilityLabel.color}`}>
                          {compatibilityLabel.text} ({ministry.compatibilityScore}%)
                        </span>

                        <span className="ml-3 px-2 py-1 rounded-full">
                            {getCommitmentLevel(ministry.commitmentLevel)}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{ministry.description}</p>
                      
                      {/*<div className="flex flex-wrap gap-2 mb-4">
                        {getCommitmentLevel(ministry.commitmentLevel)}
                        
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <Users className="h-3 w-3 mr-1" />
                          {ministry.teamSize} Miembros
                        </span>
                        
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <Calendar className="h-3 w-3 mr-1" />
                          {ministry.schedule}
                        </span>
                      </div>*/}
                      
                      {/* Razones de Coincidencia (visibles por defecto) */}
                      {ministry.matchReasons.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {ministry.matchReasons.slice(0, 2).map((reason, index) => (
                            <div key={index} className="flex items-center text-sm text-green-700">
                              <Star className="h-4 w-4 mr-1 text-green-500" />
                              <span>{reason.description}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 md:mt-0 flex flex-col justify-between items-end">
                      <button 
                        onClick={() => setExpandedMinistry(expandedMinistry === ministry.id ? null : ministry.id)}
                        className="inline-flex items-center text-[#8B2332] font-medium hover:text-[#7a1e2b] transition-colors"
                      >
                        {expandedMinistry === ministry.id ? (
                          <>
                            <span>Mostrar Menos</span>
                            <ChevronUp className="h-4 w-4 ml-1" />
                          </>
                        ) : (
                          <>
                            <span>Ver Detalles</span>
                            <ChevronDown className="h-4 w-4 ml-1" />
                          </>
                        )}
                      </button>
                      
                      {/*<button className="mt-4 px-6 py-2 bg-[#8B2332] text-white rounded hover:bg-[#7a1e2b] transition-colors">
                        Conectarme
                      </button>*/}
                    </div>
                  </div>
                  
                  {/* Detalles Expandidos */}
                  {expandedMinistry === ministry.id && (
                    <div className="mt-6 border-t pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-md font-semibold text-gray-900 mb-3">Detalles del Ministerio</h4>
                          
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="space-y-3">
                              <div>
                                <h5 className="text-sm font-medium text-gray-700">Descripción</h5>
                                <p className="text-sm text-gray-600 mt-1">{ministry.longDescription || ministry.description}</p>
                              </div>
                              
                              <div>
                                <h5 className="text-sm font-medium text-gray-700">Requisitos</h5>
                                <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                                  {ministry.requirements.map((req, index) => (
                                    <li key={index}>{req}</li>
                                  ))}
                                </ul>
                              </div>
                              
                              {/*<div>
                                <h5 className="text-sm font-medium text-gray-700">Contacto</h5>
                                <p className="text-sm text-gray-600 mt-1">
                                  {ministry.contactName} • {ministry.contactEmail}
                                </p>
                              </div>*/}
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-md font-semibold text-gray-900 mb-3">Análisis de Compatibilidad</h4>
                          
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="space-y-3">
                              {ministry.matchReasons.length > 0 ? (
                                <div>
                                  <h5 className="text-sm font-medium text-gray-700">Por Qué Te Queda Bien</h5>
                                  <ul className="space-y-2 mt-2">
                                    {ministry.matchReasons.map((reason, index) => (
                                      <li key={index} className="flex items-start">
                                        <Star className="h-4 w-4 mr-2 text-[#8B2332] mt-1 flex-shrink-0" />
                                        <span className="text-sm text-gray-600">{reason.description}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ) : (
                                <div>
                                  <h5 className="text-sm font-medium text-gray-700">Notas de Baja Compatibilidad</h5>
                                  <p className="text-sm text-gray-600 mt-1">
                                    Este ministerio puede requerir habilidades o dones que difieren de tus áreas más fuertes, 
                                    pero podría ser una oportunidad para crecer.
                                  </p>
                                </div>
                              )}
                              
                              <div>
                                <h5 className="text-sm font-medium text-gray-700">Desglose de Compatibilidad</h5>
                                <div className="space-y-2 mt-2">
                                  <div>
                                    <div className="flex justify-between text-xs mb-1">
                                      <span className="font-medium text-gray-800">Dones Espirituales</span>
                                      <span className="font-medium text-gray-800">{Math.ceil(ministry.componentScores.giftsScore)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                                      <div 
                                        className="bg-[#8B2332] h-1.5 rounded-full"
                                        style={{ width: `${ministry.componentScores.giftsScore}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <div className="flex justify-between text-xs mb-1">
                                      <span className="font-medium text-gray-800">Personalidad</span>
                                      <span className="font-medium text-gray-800">{Math.ceil(ministry.componentScores.personalityScore)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                                      <div 
                                        className="bg-[#8B2332] h-1.5 rounded-full"
                                        style={{ width: `${ministry.componentScores.personalityScore}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <div className="flex justify-between text-xs mb-1">
                                      <span className="font-medium text-gray-800">Habilidades</span>
                                      <span className="font-medium text-gray-800">{Math.ceil(ministry.componentScores.skillsScore)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                                      <div 
                                        className="bg-[#8B2332] h-1.5 rounded-full"
                                        style={{ width: `${ministry.componentScores.skillsScore}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <div className="flex justify-between text-xs mb-1">
                                      <span className="font-medium text-gray-800">Pasión</span>
                                      <span className="font-medium text-gray-800">{Math.ceil(ministry.componentScores.passionScore)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                                      <div 
                                        className="bg-[#8B2332] h-1.5 rounded-full"
                                        style={{ width: `${ministry.componentScores.passionScore}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

// Ministerios predeterminados - esto normalmente vendría de una base de datos
const ministeriosPredeterminados = [
  {
    id: 1,
    name: "Ministerios Infantiles",
    description: "Trabaja con niños para enseñarles acerca de Jesús y ayudarlos a crecer en su fe.",
    longDescription: "Nuestro Ministerio de Niños proporciona un ambiente seguro, divertido y atractivo donde los niños pueden aprender acerca de Jesús y crecer en su fe. Los miembros del equipo ayudan con las clases de escuela dominical, la iglesia de los niños y eventos especiales para niños de todas las edades.",
    commitmentLevel: "Medium",
    teamSize: "15-20",
    schedule: "Domingos, 9am-12pm",
    contactName: "María Rodríguez",
    contactEmail: "maria@church.org",
    requirements: [
      "Amor por los niños",
      "Verificación de antecedentes requerida",
      "Compromiso mínimo de 6 meses"
    ],
    recommendedTraits: {
      personalityTypes: ["I", "S"],
      spiritualGifts: ["ensenanza", "pastoreo", "misericordia", "servicio"],
      skillTypes: ["S", "A"],
      passionGroups: ["Children"],
      relevantExperiences: ["Teaching", "Childcare"]
    }
  },
  {
    id: 2,
    name: "Equipo de Alabanza",
    description: "Dirige a la congregación en la adoración a través de la música y el canto durante los servicios.",
    longDescription: "Nuestro Equipo de Alabanza dirige a la congregación en adoración a través de la música durante los servicios dominicales y eventos especiales. Los miembros pueden cantar, tocar instrumentos u operar equipos audiovisuales para crear una experiencia de adoración significativa.",
    commitmentLevel: "High",
    teamSize: "10-15",
    schedule: "Práctica: Jueves 7-9pm, Servicios: Domingos 8am-12pm",
    contactName: "David Chen",
    contactEmail: "david@church.org",
    requirements: [
      "Habilidad musical o conocimientos técnicos",
      "Audición requerida para músicos/vocalistas",
      "Ensayos semanales más servicios dominicales"
    ],
    recommendedTraits: {
      personalityTypes: ["I", "S", "D"],
      spiritualGifts: ["evangelismo", "exhortacion", "fe"],
      skillTypes: ["A", "E"],
      passionGroups: ["Worship"],
      relevantExperiences: ["Music", "Public Speaking"]
    }
  },
  {
    id: 11,
    name: "Directores de Culto",
    description: "Planifica y dirige los tiempos de adoración, coordinando con el equipo de alabanza para crear una experiencia significativa.",
    longDescription: "Los Directores de Culto planifican la estructura del servicio, seleccionan las canciones apropiadas, y guían a la congregación en la adoración. Trabajan en estrecha colaboración con el pastor y el equipo de alabanza para asegurar que cada servicio fluya bien y cree un ambiente donde las personas puedan encontrarse con Dios.",
    commitmentLevel: "High",
    teamSize: "3-5",
    schedule: "Planificación semanal, ensayos jueves, servicios dominicales",
    contactName: "Roberto Sánchez",
    contactEmail: "roberto@church.org",
    requirements: [
      "Madurez espiritual y discernimiento",
      "Conocimiento musical y experiencia en adoración",
      "Habilidades de liderazgo y comunicación"
    ],
    recommendedTraits: {
      personalityTypes: ["D", "I"],
      spiritualGifts: ["liderazgo", "pastoreo", "discernimiento", "fe"],
      skillTypes: ["A", "E", "S"],
      passionGroups: ["Worship", "Prayer"],
      relevantExperiences: ["Worship Leading", "Music Ministry", "Public Speaking"]
    }
  },
  {
    id: 3,
    name: "Equipo de Bienvenida",
    description: "Recibe a los visitantes y miembros, y ayúdalos a sentirse como en casa en nuestra comunidad de iglesia.",
    longDescription: "El Equipo de Bienvenida crea un ambiente cálido y acogedor para todos los que entran en nuestra iglesia. Los miembros del equipo saludan a los visitantes, ayudan a los recién llegados a encontrar su camino, y proporcionan información sobre nuestros ministerios y eventos.",
    commitmentLevel: "Low",
    teamSize: "10-12",
    schedule: "Domingos, horario rotativo",
    contactName: "Isabella Martínez",
    contactEmail: "isabella@church.org",
    requirements: [
      "Personalidad amigable y extrovertida",
      "Conocimiento de los programas de la iglesia",
      "Llegar 30 minutos antes del servicio"
    ],
    recommendedTraits: {
      personalityTypes: ["I", "S"],
      spiritualGifts: ["hospitalidad", "misericordia", "exhortacion"],
      skillTypes: ["S", "E"],
      passionGroups: ["Families", "International"],
      relevantExperiences: ["Customer Service", "Hospitality"]
    }
  },
  {
    id: 4,
    name: "Ministerio de Oración",
    description: "Ora por las necesidades de la iglesia y la comunidad, tanto individualmente como en grupos.",
    longDescription: "El Ministerio de Oración está dedicado a interceder por las necesidades de nuestra iglesia, comunidad y mundo. Los miembros del equipo participan en reuniones de oración, mantienen la sala de oración y responden a las peticiones de oración de la congregación.",
    commitmentLevel: "Medium",
    teamSize: "8-10",
    schedule: "Reuniones de oración semanales, tiempos de oración individual flexibles",
    contactName: "Samuel Washington",
    contactEmail: "samuel@church.org",
    requirements: [
      "Compromiso con la oración regular",
      "Confidencialidad",
      "Asistir al menos a una reunión de oración al mes"
    ],
    recommendedTraits: {
      personalityTypes: ["I", "C", "S"],
      spiritualGifts: ["fe", "discernimiento", "sabiduria", "profecia"],
      skillTypes: ["I", "S"],
      passionGroups: ["Prayer"],
      relevantExperiences: ["Spiritual Growth", "Counseling"]
    }
  },
  {
    id: 5,
    name: "Equipo de Alcance",
    description: "Comparte el amor de Cristo a través del servicio comunitario e iniciativas de evangelismo.",
    longDescription: "El Equipo de Alcance lleva el amor de Dios más allá de las paredes de nuestra iglesia a través de proyectos de servicio, evangelismo y participación comunitaria. Los miembros planifican y participan en eventos que satisfacen necesidades prácticas mientras comparten el mensaje de Jesús.",
    commitmentLevel: "Medium",
    teamSize: "15-25",
    schedule: "Reuniones de planificación mensuales, eventos de alcance regulares",
    contactName: "James Taylor",
    contactEmail: "james@church.org",
    requirements: [
      "Corazón para los perdidos",
      "Disponibilidad para fines de semana ocasionales",
      "Disposición para interactuar con extraños"
    ],
    recommendedTraits: {
      personalityTypes: ["D", "I"],
      spiritualGifts: ["evangelismo", "misericordia", "exhortacion", "servicio"],
      skillTypes: ["S", "E", "R"],
      passionGroups: ["Homeless", "Addicts", "International"],
      relevantExperiences: ["Volunteering", "Public Speaking", "Social Work"]
    }
  },
  {
    id: 12,
    name: "Ayuda Social y Misericordia",
    description: "Atiende a personas en situación de vulnerabilidad a través de programas de asistencia práctica y apoyo emocional.",
    longDescription: "El Ministerio de Ayuda Social y Misericordia identifica y responde a las necesidades básicas de personas vulnerables en nuestra comunidad. Los miembros organizan colectas de alimentos, ropa y artículos básicos, proveen asistencia en crisis, y desarrollan programas continuos para apoyar a familias de bajos recursos, personas sin hogar y otros grupos en necesidad.",
    commitmentLevel: "Medium",
    teamSize: "10-15",
    schedule: "Reuniones mensuales, proyectos semanales o quincenales",
    contactName: "Elena Vázquez",
    contactEmail: "elena@church.org",
    requirements: [
      "Corazón compasivo y servicial",
      "Sensibilidad a las necesidades sociales",
      "Capacidad para trabajar con personas en situaciones difíciles"
    ],
    recommendedTraits: {
      personalityTypes: ["S", "I"],
      spiritualGifts: ["misericordia", "servicio", "ayuda", "dar"],
      skillTypes: ["S", "R"],
      passionGroups: ["Homeless", "Families", "Elderly", "Addicts"],
      relevantExperiences: ["Social Work", "Counseling", "Volunteer Work"]
    }
  },
  {
    id: 6,
    name: "Equipo de Multimedia",
    description: "Administra el sonido, la iluminación, las presentaciones y las plataformas en línea para los servicios y eventos de la iglesia.",
    longDescription: "El Equipo de Medios asegura que la tecnología mejore nuestros servicios de adoración y alcance. Los miembros del equipo operan equipos de audio, crean presentaciones visuales, administran transmisiones en vivo y desarrollan contenido para redes sociales y el sitio web de la iglesia.",
    commitmentLevel: "High",
    teamSize: "8-12",
    schedule: "Domingos más eventos especiales, creación de contenido durante la semana",
    contactName: "Michael Johnson",
    contactEmail: "michael@church.org",
    requirements: [
      "Aptitud técnica",
      "Atención al detalle",
      "Capacidad para aprender nuevos sistemas"
    ],
    recommendedTraits: {
      personalityTypes: ["C", "D", "I"],
      spiritualGifts: ["ayuda", "administracion", "servicio"],
      skillTypes: ["R", "A", "C"],
      passionGroups: ["Worship", "Teaching"],
      relevantExperiences: ["Technology", "Design", "Audio/Visual Production"]
    }
  },
  {
    id: 13,
    name: "Servicio en Montaje",
    description: "Prepara los espacios para los servicios y eventos de la iglesia, instalando y desmontando equipos y mobiliario.",
    longDescription: "El equipo de Servicio en Montaje trabaja entre bastidores para asegurar que todos los espacios estén perfectamente preparados antes de cada servicio o evento. Los miembros del equipo se encargan de colocar sillas, preparar escenarios, montar pantallas, instalar equipos de sonido y crear el ambiente adecuado para cada actividad de la iglesia.",
    commitmentLevel: "Medium",
    teamSize: "8-10",
    schedule: "Antes y después de servicios dominicales y eventos especiales",
    contactName: "Carlos Hernández",
    contactEmail: "carlos@church.org",
    requirements: [
      "Capacidad física para levantar y mover objetos",
      "Puntualidad y confiabilidad",
      "Orientación al detalle y organización"
    ],
    recommendedTraits: {
      personalityTypes: ["S", "C", "R"],
      spiritualGifts: ["servicio", "ayuda", "administracion"],
      skillTypes: ["R", "C"],
      passionGroups: [],
      relevantExperiences: ["Manual Labor", "Event Setup", "Technical Support"]
    }
  },
  {
    id: 14,
    name: "Ornamentación de la Iglesia",
    description: "Diseña y crea ambientes visuales atractivos y significativos para los servicios y eventos especiales.",
    longDescription: "El ministerio de Ornamentación transforma los espacios de la iglesia para crear ambientes que inspiren adoración y reflejen las temporadas litúrgicas o temas especiales. Los miembros seleccionan y crean decoraciones, arreglos florales, exhibiciones visuales y elementos ambientales que enriquecen la experiencia del culto y comunican verdades bíblicas a través del diseño visual.",
    commitmentLevel: "Medium",
    teamSize: "5-8",
    schedule: "Preparación semanal, énfasis en días festivos y eventos especiales",
    contactName: "Laura Mendoza",
    contactEmail: "laura@church.org",
    requirements: [
      "Creatividad y sentido estético",
      "Habilidades en diseño o decoración",
      "Disposición para trabajar en equipo"
    ],
    recommendedTraits: {
      personalityTypes: ["A", "S", "C"],
      spiritualGifts: ["servicio", "ayuda"],
      skillTypes: ["A", "R"],
      passionGroups: ["Worship"],
      relevantExperiences: ["Design", "Floral Arrangement", "Interior Decoration", "Visual Arts"]
    }
  },
  {
    id: 7,
    name: "Líderes de Estudio Bíblico",
    description: "Dirige grupos pequeños en el estudio de la Palabra de Dios y su aplicación a la vida diaria.",
    longDescription: "Los Líderes de Estudio Bíblico facilitan discusiones y guían a los participantes en la comprensión y aplicación de las Escrituras. Los líderes preparan lecciones, fomentan la participación y crean un ambiente de apoyo donde los miembros pueden crecer espiritualmente y construir relaciones.",
    commitmentLevel: "High",
    teamSize: "15-20",
    schedule: "Reuniones semanales, tiempo de preparación",
    contactName: "Rebecca Williams",
    contactEmail: "rebecca@church.org",
    requirements: [
      "Conocimiento sólido de las Escrituras",
      "Habilidades de liderazgo",
      "Compromiso con la preparación",
      "Compromiso mínimo de 1 año"
    ],
    recommendedTraits: {
      personalityTypes: ["D", "I", "C"],
      spiritualGifts: ["ensenanza", "pastoreo", "conocimiento", "sabiduria"],
      skillTypes: ["I", "S", "E"],
      passionGroups: ["Teaching", "Families", "Youth"],
      relevantExperiences: ["Teaching", "Mentoring", "Leadership"]
    }
  },
  {
    id: 8,
    name: "Apoyo Administrativo",
    description: "Ayuda con las operaciones detrás de escena que mantienen a la iglesia funcionando sin problemas.",
    longDescription: "El equipo de Apoyo Administrativo ayuda con los aspectos prácticos de las operaciones de la iglesia. Los miembros asisten con la entrada de datos, la coordinación de eventos, la gestión de horarios, las comunicaciones y el mantenimiento de instalaciones para garantizar que los programas de la iglesia funcionen eficientemente.",
    commitmentLevel: "Medium",
    teamSize: "5-8",
    schedule: "Horas entre semana, horarios flexibles disponibles",
    contactName: "Thomas Wilson",
    contactEmail: "thomas@church.org",
    requirements: [
      "Habilidades organizativas",
      "Atención al detalle",
      "Dominio de la computadora",
      "Confiabilidad"
    ],
    recommendedTraits: {
      personalityTypes: ["C", "S"],
      spiritualGifts: ["administracion", "ayuda", "servicio"],
      skillTypes: ["C", "I", "R"],
      passionGroups: [],
      relevantExperiences: ["Office Work", "Project Management", "Event Planning"]
    }
  },
  {
    id: 9,
    name: "Equipo de Misiones",
    description: "Apoya y participa en esfuerzos misioneros locales y globales para difundir el Evangelio.",
    longDescription: "El Equipo de Misiones coordina la participación de nuestra iglesia en la difusión del Evangelio localmente y en todo el mundo. Los miembros planifican viajes misioneros, apoyan a los misioneros, organizan eventos de recaudación de fondos y desarrollan asociaciones con organizaciones misioneras.",
    commitmentLevel: "Medium",
    teamSize: "10-15",
    schedule: "Reuniones mensuales, viajes misioneros ocasionales",
    contactName: "Sarah Johnston",
    contactEmail: "sarah@church.org",
    requirements: [
      "Corazón para las misiones",
      "Sensibilidad cultural",
      "Capacidad para participar o apoyar viajes misioneros"
    ],
    recommendedTraits: {
      personalityTypes: ["D", "I", "S"],
      spiritualGifts: ["evangelismo", "fe", "liderazgo", "misericordia"],
      skillTypes: ["S", "E", "I"],
      passionGroups: ["International", "Teaching", "Prayer"],
      relevantExperiences: ["Travel", "Languages", "Cross-cultural experience"]
    }
  },
  {
    id: 10,
    name: "Ministerio de Cuidado",
    description: "Proporciona apoyo práctico y emocional a los miembros durante tiempos de necesidad o crisis.",
    longDescription: "El Ministerio de Cuidado muestra el amor de Cristo apoyando a las personas en temporadas difíciles. Los miembros del equipo visitan a los enfermos y ancianos, preparan comidas para familias en crisis, proporcionan transporte a citas y ofrecen oración y aliento.",
    commitmentLevel: "Medium",
    teamSize: "12-15",
    schedule: "Base de guardia, reuniones mensuales del equipo",
    contactName: "Elizabeth Kim",
    contactEmail: "elizabeth@church.org",
    requirements: [
      "Compasión",
      "Buenas habilidades para escuchar",
      "Confiabilidad",
      "Licencia de conducir válida (para algunos roles)"
    ],
    recommendedTraits: {
      personalityTypes: ["S", "C", "I"],
      spiritualGifts: ["misericordia", "exhortacion", "hospitalidad", "ayuda"],
      skillTypes: ["S", "R"],
      passionGroups: ["Elderly", "Families"],
      relevantExperiences: ["Caregiving", "Counseling", "Healthcare"]
    }
  },
  {
    id: 15,
    name: "Ministerio de Adolescentes",
    description: "Guía a los adolescentes (12-17 años) en su crecimiento espiritual a través de enseñanza, mentoreo y actividades específicas para su edad.",
    longDescription: "El Ministerio de Adolescentes crea un espacio seguro donde los jóvenes entre 12 y 17 años pueden crecer en su fe, desarrollar relaciones saludables y descubrir su identidad en Cristo. Los líderes facilitan estudios bíblicos, discusiones relevantes, actividades recreativas y oportunidades de servicio que responden a las necesidades específicas de los adolescentes en esta etapa crucial de desarrollo.",
    commitmentLevel: "High",
    teamSize: "8-12",
    schedule: "Reuniones semanales, eventos mensuales, retiros ocasionales",
    contactName: "Marcos González",
    contactEmail: "marcos@church.org",
    requirements: [
      "Pasión por los adolescentes",
      "Verificación de antecedentes requerida",
      "Capacidad para conectar con la cultura juvenil",
      "Compromiso mínimo de 1 año"
    ],
    recommendedTraits: {
      personalityTypes: ["I", "S", "D"],
      spiritualGifts: ["ensenanza", "pastoreo", "exhortacion", "misericordia"],
      skillTypes: ["S", "E", "A"],
      passionGroups: ["Youth", "Adolecentes"],
      relevantExperiences: ["Youth Work", "Teaching", "Mentoring", "Counseling"]
    }
  },
  {
    id: 16,
    name: "Ministerio de Jóvenes",
    description: "Acompaña a jóvenes de 18-25 años en su crecimiento espiritual y transición a la vida adulta a través de comunidad y discipulado.",
    longDescription: "El Ministerio de Jóvenes está enfocado en acompañar a jóvenes adultos (18-25 años) en su transición a la vida adulta, ayudándoles a establecer fundamentos firmes en su fe. Los líderes crean oportunidades para el discipulado profundo, desarrollo de liderazgo, comunidad auténtica y participación en la misión de la iglesia, respondiendo a los desafíos únicos que enfrentan los jóvenes en esta etapa de vida.",
    commitmentLevel: "High",
    teamSize: "8-12",
    schedule: "Reuniones semanales, eventos mensuales, discipulado individual",
    contactName: "Daniel Palacios",
    contactEmail: "daniel@church.org",
    requirements: [
      "Madurez espiritual",
      "Capacidad para relacionarse con jóvenes adultos",
      "Disponibilidad para mentoría individual",
      "Verificación de antecedentes requerida"
    ],
    recommendedTraits: {
      personalityTypes: ["I", "D", "S"],
      spiritualGifts: ["pastoreo", "ensenanza", "exhortacion", "liderazgo"],
      skillTypes: ["S", "E", "I"],
      passionGroups: ["Youth", "Young Adults"],
      relevantExperiences: ["Youth Ministry", "Mentoring", "Teaching", "Leadership Development"]
    }
  },
  {
    id: 17,
    name: "Ministerio de Universitario",
    description: "Apoya a estudiantes universitarios en su crecimiento espiritual y misión en el campus a través de comunidad y recursos específicos.",
    longDescription: "El Ministerio Universitario acompaña a estudiantes durante sus años de educación superior, un tiempo crucial para la formación de convicciones y cosmovisión. Los líderes del ministerio facilitan estudios bíblicos en campus, crean espacios de comunidad y apoyo, equipan a los estudiantes para compartir su fe en entornos académicos y los ayudan a integrar su fe con sus estudios y futuras carreras.",
    commitmentLevel: "Medium",
    teamSize: "5-10",
    schedule: "Reuniones semanales en campus, eventos según calendario académico",
    contactName: "Patricia Morales",
    contactEmail: "patricia@church.org",
    requirements: [
      "Familiaridad con la cultura universitaria",
      "Capacidad para abordar preguntas intelectuales sobre la fe",
      "Disponibilidad según horarios universitarios",
      "Preferentemente con experiencia universitaria"
    ],
    recommendedTraits: {
      personalityTypes: ["I", "C", "D"],
      spiritualGifts: ["ensenanza", "sabiduria", "evangelismo", "exhortacion"],
      skillTypes: ["I", "S", "E"],
      passionGroups: ["Youth", "College Students", "Teaching"],
      relevantExperiences: ["Higher Education", "Campus Ministry", "Apologetics", "Mentoring"]
    }
  },
  {
    id: 18,
    name: "Ministerio de Diseño Gráfico",
    description: "Crea y desarrolla materiales visuales para comunicar el mensaje de la iglesia de manera efectiva y atractiva.",
    longDescription: "El Ministerio de Diseño Gráfico utiliza talento artístico y habilidades creativas para producir materiales visuales que apoyan la comunicación de la iglesia. Los miembros del equipo diseñan gráficos para redes sociales, boletines, presentaciones, banners, folletos, logos para eventos especiales y materiales promocionales que ayudan a transmitir el mensaje de la iglesia con excelencia y claridad.",
    commitmentLevel: "Medium",
    teamSize: "3-6",
    schedule: "Proyectos semanales con plazos flexibles, ocasionalmente presencial para eventos especiales",
    contactName: "Gabriela Soto",
    contactEmail: "gabriela@church.org",
    requirements: [
      "Habilidades en diseño gráfico y herramientas como Photoshop, Illustrator, Canva, etc.",
      "Ojo para el detalle y sensibilidad estética",
      "Capacidad para trabajar con plazos y recibir retroalimentación",
      "Preferentemente con portafolio de trabajos previos"
    ],
    recommendedTraits: {
      personalityTypes: ["A", "C", "I"],
      spiritualGifts: ["servicio", "ayuda", "administracion"],
      skillTypes: ["A", "C", "I"],
      passionGroups: ["Teaching", "Worship"],
      relevantExperiences: ["Graphic Design", "Visual Arts", "Marketing", "Social Media"]
    }
  },
  {
    id: 19,
    name: "Ministerio de Desarrollo Tecnológico",
    description: "Desarrolla y mantiene soluciones tecnológicas que apoyan la misión de la iglesia y mejoran su alcance digital.",
    longDescription: "El Ministerio de Desarrollo Tecnológico utiliza habilidades en programación, desarrollo web y sistemas de información para crear y mantener herramientas digitales que apoyan los diversos ministerios. Los miembros del equipo trabajan en el sitio web de la iglesia, aplicaciones móviles, sistemas de gestión de bases de datos, herramientas para transmisiones en línea y otras soluciones digitales que mejoran la experiencia de la comunidad y amplían el alcance del ministerio.",
    commitmentLevel: "Medium",
    teamSize: "4-8",
    schedule: "Reuniones quincenales, desarrollo continuo con horario flexible",
    contactName: "Andrés Ramírez",
    contactEmail: "andres@church.org",
    requirements: [
      "Conocimientos en desarrollo web, programación o sistemas",
      "Experiencia con al menos una tecnología relevante (JavaScript, Python, PHP, bases de datos, etc.)",
      "Capacidad para trabajar en equipo y documentar soluciones",
      "Compromiso con la mejora continua y aprendizaje"
    ],
    recommendedTraits: {
      personalityTypes: ["C", "I", "D"],
      spiritualGifts: ["administracion", "servicio", "ayuda", "sabiduria"],
      skillTypes: ["I", "C", "E"],
      passionGroups: ["Teaching"],
      relevantExperiences: ["Software Development", "Web Development", "IT Support", "Database Management"]
    }
  }
];

export default MinistryMatching;