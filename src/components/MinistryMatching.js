import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, ArrowUpDown, ChevronDown, ChevronUp, Info, Users, Star, Calendar } from 'lucide-react';
import _ from 'lodash';

// Ministry Matching Component
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

  // Get test results with safe fallbacks
  const getTestData = (slug) => {
    const test = userTests.find(t => t?.slug === slug);
    return test?.status === 'completado' ? test.results || {} : {};
  };

  const personalityResults = getTestData('personalidad');
  const donesResults = getTestData('dones');
  const skillsResults = getTestData('habilidades');
  const passionResults = getTestData('pasion');
  const experienceResults = getTestData('experiencia');

  // Get top personality traits
  const personalityTraits = Object.keys(personalityResults).length > 0
    ? Object.entries(personalityResults)
        .sort(([, a], [, b]) => (b || 0) - (a || 0))
        .slice(0, 2)
        .map(([type]) => type)
    : [];

  // Get top spiritual gifts
  const topDones = Object.keys(donesResults).length > 0
    ? Object.entries(donesResults)
        .sort(([, a], [, b]) => (b || 0) - (a || 0))
        .slice(0, 5)
        .map(([gift]) => gift)
    : [];

  // Get top skills
  const topSkills = Object.keys(skillsResults).length > 0
    ? Object.entries(skillsResults)
        .sort(([, a], [, b]) => (b || 0) - (a || 0))
        .slice(0, 3)
        .map(([category]) => category)
    : [];

  // Get top passion areas
  const passionGroups = passionResults?.topFiveGroups || [];
  const passionTypes = passionResults?.topThreePassions || [];

  // Fetch or prepare ministry opportunities
  useEffect(() => {
    // This would typically be an API call
    const fetchMinistryOpportunities = async () => {
      setIsLoading(true);
      try {
        if (ministryOpportunities) {
          setMinistries(ministryOpportunities);
        } else {
          // Default ministry definitions if none are provided
          setMinistries(defaultMinistries);
        }
      } catch (error) {
        console.error('Error fetching ministry opportunities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMinistryOpportunities();
  }, [ministryOpportunities]);

  // Calculate compatibility scores for all ministries
  const matchedMinistries = useMemo(() => {
    if (!ministries.length) return [];

    return ministries.map(ministry => {
      // Initialize the match reasons for this ministry
      const matchReasons = [];
      
      // Calculate personality compatibility (0-100)
      let personalityScore = 0;
      if (personalityTraits.length > 0) {
        const matchingPersonalityTypes = ministry.recommendedTraits.personalityTypes.filter(
          type => personalityTraits.includes(type)
        );
        personalityScore = (matchingPersonalityTypes.length / ministry.recommendedTraits.personalityTypes.length) * 100;
        
        if (matchingPersonalityTypes.length > 0) {
          matchReasons.push({
            type: 'personality',
            description: `Your ${matchingPersonalityTypes.join('/')} personality type is well-suited for this ministry.`
          });
        }
      }

      // Calculate spiritual gifts compatibility (0-100)
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
            description: `Your spiritual gifts of ${giftLabels.join(', ')} are valuable in this ministry.`
          });
        }
      }

      // Calculate skills compatibility (0-100)
      let skillsScore = 0;
      if (topSkills.length > 0) {
        const matchingSkills = ministry.recommendedTraits.skillTypes.filter(
          skill => topSkills.includes(skill)
        );
        skillsScore = (matchingSkills.length / ministry.recommendedTraits.skillTypes.length) * 100;
        
        if (matchingSkills.length > 0) {
          const skillLabels = matchingSkills.map(skill => {
            const labels = {
              R: 'Hands-on/Practical', 
              I: 'Analytical/Research',
              A: 'Creative/Artistic',
              S: 'Social/Helper',
              E: 'Entrepreneurial/Leadership',
              C: 'Detailed/Organizational'
            };
            return labels[skill] || skill;
          });
          
          matchReasons.push({
            type: 'skills',
            description: `Your ${skillLabels.join(', ')} skills are needed in this ministry.`
          });
        }
      }

      // Calculate passion compatibility (0-100)
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
          matchReasons.push({
            type: 'passion',
            description: `Your passion for ${matchingPassions.join(', ')} aligns perfectly with this ministry's focus.`
          });
        }
      }

      // Calculate experience relevance (0-100)
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
            description: `Your life experiences make you especially effective in this area.`
          });
        }
      }

      // Calculate overall compatibility score (weighted average)
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

  // Apply search filtering
  const filteredMinistries = useMemo(() => {
    if (!matchedMinistries.length) return [];

    return matchedMinistries.filter(ministry => {
      // Text search
      const matchesSearch = searchTerm === '' || 
        ministry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ministry.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by selected filters
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

  // Apply sorting
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

  // Handle sort request
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Handle filter changes
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

  // Clear all filters
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

  // Get compatibility label based on score
  const getCompatibilityLabel = (score) => {
    if (score >= 80) return { text: 'Excellent Match', color: 'bg-green-500' };
    if (score >= 60) return { text: 'Good Match', color: 'bg-blue-500' };
    if (score >= 40) return { text: 'Moderate Match', color: 'bg-yellow-500' };
    return { text: 'Consider Exploring', color: 'bg-gray-500' };
  };

  // Get commitment level element with appropriate styling
  const getCommitmentLevel = (level) => {
    const styles = {
      'Low': 'bg-green-100 text-green-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'High': 'bg-red-100 text-red-800'
    };

    return (
      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${styles[level]}`}>
        {level} Commitment
      </span>
    );
  };

  // Define all available filters
  const filterOptions = {
    personalityTypes: [
      { value: 'D', label: 'D (Dominant)' },
      { value: 'I', label: 'I (Influencing)' },
      { value: 'S', label: 'S (Steady)' },
      { value: 'C', label: 'C (Compliant)' }
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
      { value: 'R', label: 'Realista (Hands-on)' },
      { value: 'I', label: 'Investigador (Analytical)' },
      { value: 'A', label: 'Artístico (Creative)' },
      { value: 'S', label: 'Social (Helper)' },
      { value: 'E', label: 'Emprendedor (Leader)' },
      { value: 'C', label: 'Convencional (Organized)' }
    ],
    passionGroups: [
      { value: 'Children', label: 'Children' },
      { value: 'Youth', label: 'Youth' },
      { value: 'Elderly', label: 'Elderly' },
      { value: 'Families', label: 'Families' },
      { value: 'Homeless', label: 'Homeless' },
      { value: 'Addicts', label: 'Addiction Recovery' },
      { value: 'International', label: 'International' },
      { value: 'Prayer', label: 'Prayer' },
      { value: 'Worship', label: 'Worship' },
      { value: 'Teaching', label: 'Teaching' }
    ],
    commitmentLevel: [
      { value: 'Low', label: 'Low Commitment' },
      { value: 'Medium', label: 'Medium Commitment' },
      { value: 'High', label: 'High Commitment' }
    ]
  };

  // Check if any tests are completed
  const hasCompletedTests = userTests.some(test => test?.status === 'completado');

  // If no tests completed, show appropriate message
  if (!hasCompletedTests) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <h2 className="text-xl font-bold text-[#8B2332] mb-4">Ministry Matching</h2>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-6">
          <p className="text-amber-800">
            Please complete at least one personality assessment to see ministry recommendations.
          </p>
        </div>
        <button 
          onClick={() => window.location.href = '/dashboard/dones'}
          className="px-4 py-2 bg-[#8B2332] text-white rounded hover:bg-[#7a1e2b] transition-colors"
        >
          Go to Assessments
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-[#8B2332]">Ministry Matching</h2>
        <p className="text-gray-600 mt-1">Find ministry opportunities that align with your unique gifts and calling</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="p-4 md:p-6 border-b bg-gray-50">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Field */}
          <div className="relative w-full md:w-1/3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search ministries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B2332] focus:border-[#8B2332]"
            />
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
          >
            <Filter className="h-5 w-5 mr-2 text-gray-600" />
            <span className="text-gray-700">Filters</span>
            {Object.values(selectedFilters).flat().length > 0 && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#8B2332] text-white">
                {Object.values(selectedFilters).flat().length}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
            >
              <ArrowUpDown className="h-5 w-5 mr-2 text-gray-600" />
              <span className="text-gray-700">Sort</span>
              <ChevronDown className="h-4 w-4 ml-1 text-gray-600" />
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10 hidden">
              <button 
                onClick={() => requestSort('compatibilityScore')}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
              >
                By Compatibility
              </button>
              <button 
                onClick={() => requestSort('name')}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
              >
                By Name
              </button>
              <button 
                onClick={() => requestSort('commitmentLevel')}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
              >
                By Commitment Level
              </button>
            </div>
          </div>

          {/* Clear Filters (only shown if filters are applied) */}
          {Object.values(selectedFilters).flat().length > 0 && (
            <button
              onClick={clearFilters}
              className="text-[#8B2332] hover:text-[#7a1e2b] transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Filter Panel */}
        {isFilterPanelOpen && (
          <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
              {/* Personality Type Filters */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Personality Type</h3>
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

              {/* Spiritual Gifts Filters */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Spiritual Gifts</h3>
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

              {/* Skills Filters */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Skills</h3>
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

              {/* Passion Group Filters */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Passion Areas</h3>
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

              {/* Commitment Level Filters */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Commitment Level</h3>
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

      {/* Loading State */}
      {isLoading ? (
        <div className="p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B2332] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading ministry opportunities...</p>
        </div>
      ) : (
        <>
          {/* Results Count */}
          <div className="px-6 py-3 border-b bg-gray-50">
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium">{sortedMinistries.length}</span> ministry opportunities
              {Object.values(selectedFilters).flat().length > 0 && ' (filtered)'}
            </p>
          </div>

          {/* No Results */}
          {sortedMinistries.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-gray-600">No matching ministry opportunities found.</p>
              {Object.values(selectedFilters).flat().length > 0 && (
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 bg-[#8B2332] text-white rounded hover:bg-[#7a1e2b] transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {/* Results List */}
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
                      </div>
                      
                      <p className="text-gray-600 mb-4">{ministry.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {getCommitmentLevel(ministry.commitmentLevel)}
                        
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <Users className="h-3 w-3 mr-1" />
                          {ministry.teamSize} Members
                        </span>
                        
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <Calendar className="h-3 w-3 mr-1" />
                          {ministry.schedule}
                        </span>
                      </div>
                      
                      {/* Match Reasons (visible by default) */}
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
                            <span>Show Less</span>
                            <ChevronUp className="h-4 w-4 ml-1" />
                          </>
                        ) : (
                          <>
                            <span>View Details</span>
                            <ChevronDown className="h-4 w-4 ml-1" />
                          </>
                        )}
                      </button>
                      
                      <button className="mt-4 px-6 py-2 bg-[#8B2332] text-white rounded hover:bg-[#7a1e2b] transition-colors">
                        Get Connected
                      </button>
                    </div>
                  </div>
                  
                  {/* Expanded Details */}
                  {expandedMinistry === ministry.id && (
                    <div className="mt-6 border-t pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-md font-semibold text-gray-900 mb-3">Ministry Details</h4>
                          
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="space-y-3">
                              <div>
                                <h5 className="text-sm font-medium text-gray-700">Description</h5>
                                <p className="text-sm text-gray-600 mt-1">{ministry.longDescription || ministry.description}</p>
                              </div>
                              
                              <div>
                                <h5 className="text-sm font-medium text-gray-700">Requirements</h5>
                                <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                                  {ministry.requirements.map((req, index) => (
                                    <li key={index}>{req}</li>
                                  ))}
                                </ul>
                              </div>
                              
                              <div>
                                <h5 className="text-sm font-medium text-gray-700">Contact</h5>
                                <p className="text-sm text-gray-600 mt-1">
                                  {ministry.contactName} • {ministry.contactEmail}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-md font-semibold text-gray-900 mb-3">Compatibility Analysis</h4>
                          
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="space-y-3">
                              {ministry.matchReasons.length > 0 ? (
                                <div>
                                  <h5 className="text-sm font-medium text-gray-700">Why This Fits You</h5>
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
                                  <h5 className="text-sm font-medium text-gray-700">Low Compatibility Notes</h5>
                                  <p className="text-sm text-gray-600 mt-1">
                                    This ministry may require skills or gifts that differ from your strongest areas, 
                                    but could be an opportunity for growth.
                                  </p>
                                </div>
                              )}
                              
                              <div>
                                <h5 className="text-sm font-medium text-gray-700">Compatibility Breakdown</h5>
                                <div className="space-y-2 mt-2">
                                  <div>
                                    <div className="flex justify-between text-xs mb-1">
                                      <span>Spiritual Gifts</span>
                                      <span>{ministry.componentScores.giftsScore}%</span>
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
                                      <span>Personality</span>
                                      <span>{ministry.componentScores.personalityScore}%</span>
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
                                      <span>Skills</span>
                                      <span>{ministry.componentScores.skillsScore}%</span>
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
                                      <span>Passion</span>
                                      <span>{ministry.componentScores.passionScore}%</span>
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

// Default ministry opportunities - this would typically come from a database
const defaultMinistries = [
  {
    id: 1,
    name: "Children's Ministry",
    description: "Work with children to teach them about Jesus and help them grow in their faith.",
    longDescription: "Our Children's Ministry provides a safe, fun, and engaging environment where children can learn about Jesus and grow in their faith. Team members help with Sunday School classes, children's church, and special events for kids of all ages.",
    commitmentLevel: "Medium",
    teamSize: "15-20",
    schedule: "Sundays, 9am-12pm",
    contactName: "Maria Rodriguez",
    contactEmail: "maria@church.org",
    requirements: [
      "Love for children",
      "Background check required",
      "Minimum 6-month commitment"
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
    name: "Worship Team",
    description: "Lead the congregation in worship through music and song during services.",
    longDescription: "Our Worship Team leads the congregation in worship through music during Sunday services and special events. Members may sing, play instruments, or operate audio/visual equipment to create a meaningful worship experience.",
    commitmentLevel: "High",
    teamSize: "10-15",
    schedule: "Practice: Thursdays 7-9pm, Services: Sundays 8am-12pm",
    contactName: "David Chen",
    contactEmail: "david@church.org",
    requirements: [
      "Musical ability or technical skills",
      "Audition required for musicians/vocalists",
      "Weekly rehearsals plus Sunday services"
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
    id: 3,
    name: "Welcome Team",
    description: "Greet visitors and members, and help them feel at home in our church community.",
    longDescription: "The Welcome Team creates a warm, inviting atmosphere for everyone who enters our church. Team members greet visitors, help newcomers find their way around, and provide information about our ministries and events.",
    commitmentLevel: "Low",
    teamSize: "10-12",
    schedule: "Sundays, rotation schedule",
    contactName: "Isabella Martinez",
    contactEmail: "isabella@church.org",
    requirements: [
      "Friendly, outgoing personality",
      "Knowledge of church programs",
      "Arrive 30 minutes before service"
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
    name: "Prayer Ministry",
    description: "Pray for the needs of the church and community, both individually and in groups.",
    longDescription: "The Prayer Ministry is dedicated to interceding for the needs of our church, community, and world. Team members participate in prayer meetings, maintain the prayer room, and respond to prayer requests from the congregation.",
    commitmentLevel: "Medium",
    teamSize: "8-10",
    schedule: "Weekly prayer meetings, flexible individual prayer times",
    contactName: "Samuel Washington",
    contactEmail: "samuel@church.org",
    requirements: [
      "Commitment to regular prayer",
      "Confidentiality",
      "Attend at least one prayer meeting per month"
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
    name: "Outreach Team",
    description: "Share the love of Christ through community service and evangelism initiatives.",
    longDescription: "The Outreach Team takes God's love beyond our church walls through service projects, evangelism, and community engagement. Members plan and participate in events that meet practical needs while sharing the message of Jesus.",
    commitmentLevel: "Medium",
    teamSize: "15-25",
    schedule: "Monthly planning meetings, regular outreach events",
    contactName: "James Taylor",
    contactEmail: "james@church.org",
    requirements: [
      "Heart for the lost",
      "Availability for occasional weekends",
      "Willingness to engage with strangers"
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
    id: 6,
    name: "Media Team",
    description: "Manage sound, lighting, presentations, and online platforms for church services and events.",
    longDescription: "The Media Team ensures that technology enhances our worship services and outreach. Team members operate audio equipment, create visual presentations, manage livestreams, and develop content for social media and the church website.",
    commitmentLevel: "High",
    teamSize: "8-12",
    schedule: "Sundays plus special events, content creation throughout the week",
    contactName: "Michael Johnson",
    contactEmail: "michael@church.org",
    requirements: [
      "Technical aptitude",
      "Attention to detail",
      "Ability to learn new systems"
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
    id: 7,
    name: "Bible Study Leaders",
    description: "Lead small groups in studying God's Word and applying it to daily life.",
    longDescription: "Bible Study Leaders facilitate discussions and guide participants in understanding and applying Scripture. Leaders prepare lessons, encourage participation, and foster a supportive environment where members can grow spiritually and build relationships.",
    commitmentLevel: "High",
    teamSize: "15-20",
    schedule: "Weekly meetings, preparation time",
    contactName: "Rebecca Williams",
    contactEmail: "rebecca@church.org",
    requirements: [
      "Strong knowledge of Scripture",
      "Leadership skills",
      "Commitment to preparation",
      "Minimum 1-year commitment"
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
    name: "Administration Support",
    description: "Assist with behind-the-scenes operations that keep the church running smoothly.",
    longDescription: "The Administration Support team helps with the practical aspects of church operations. Members assist with data entry, event coordination, schedule management, communications, and facility maintenance to ensure church programs run efficiently.",
    commitmentLevel: "Medium",
    teamSize: "5-8",
    schedule: "Weekday hours, flexible scheduling available",
    contactName: "Thomas Wilson",
    contactEmail: "thomas@church.org",
    requirements: [
      "Organizational skills",
      "Attention to detail",
      "Computer proficiency",
      "Reliability"
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
    name: "Missions Team",
    description: "Support and participate in local and global mission efforts to spread the Gospel.",
    longDescription: "The Missions Team coordinates our church's involvement in spreading the Gospel locally and around the world. Members plan mission trips, support missionaries, organize fundraising events, and develop partnerships with mission organizations.",
    commitmentLevel: "Medium",
    teamSize: "10-15",
    schedule: "Monthly meetings, occasional mission trips",
    contactName: "Sarah Johnston",
    contactEmail: "sarah@church.org",
    requirements: [
      "Heart for missions",
      "Cultural sensitivity",
      "Ability to participate in or support mission trips"
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
    name: "Care Ministry",
    description: "Provide practical and emotional support to members during times of need or crisis.",
    longDescription: "The Care Ministry shows Christ's love by supporting people through difficult seasons. Team members visit the sick and elderly, prepare meals for families in crisis, provide transportation to appointments, and offer prayer and encouragement.",
    commitmentLevel: "Medium",
    teamSize: "12-15",
    schedule: "On-call basis, monthly team meetings",
    contactName: "Elizabeth Kim",
    contactEmail: "elizabeth@church.org",
    requirements: [
      "Compassion",
      "Good listening skills",
      "Reliability",
      "Valid driver's license (for some roles)"
    ],
    recommendedTraits: {
      personalityTypes: ["S", "C", "I"],
      spiritualGifts: ["misericordia", "exhortacion", "hospitalidad", "ayuda"],
      skillTypes: ["S", "R"],
      passionGroups: ["Elderly", "Families"],
      relevantExperiences: ["Caregiving", "Counseling", "Healthcare"]
    }
  }
];

export default MinistryMatching;