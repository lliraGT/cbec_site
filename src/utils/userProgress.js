// src/utils/userProgress.js
export async function updatePersonalityTest(userId, results) {
  console.log('Updating personality test with:', { userId, results });

  if (!userId) {
    console.error('Missing userId:', userId);
    throw new Error('Missing required fields: userId');
  }

  // Validate results
  if (!results || typeof results !== 'object') {
    console.error('Invalid results:', results);
    throw new Error('Missing required fields: results must be an object');
  }

  const { D, I, S, C } = results;
  if (D === undefined || I === undefined || S === undefined || C === undefined) {
    console.error('Missing DISC values:', results);
    throw new Error('Missing required fields: DISC values');
  }

  try {
    const response = await fetch('/api/user-progress/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        testType: 'personality',
        results: {
          D: Number(D),
          I: Number(I),
          S: Number(S),
          C: Number(C)
        },
      }),
    });

    const data = await response.json();
    console.log('API Response:', data);

    if (!response.ok) {
      throw new Error(data.error || 'Error updating test progress');
    }

    return data;
  } catch (error) {
    console.error('Error updating personality test:', error);
    throw error;
  }
}

export async function updateDonesTest(userId, results) {
  console.log('Updating dones test with:', { userId, results });

  if (!userId) {
    return { error: 'Missing required fields: userId' };
  }

  // Validate results
  if (!results || typeof results !== 'object') {
    return { error: 'Missing required fields: results must be an object' };
  }

  // Expected spiritual gifts
  const expectedGifts = [
    'evangelismo', 'liderazgo', 'misericordia', 'administracion', 
    'profecia', 'dar', 'ensenanza', 'pastoreo', 'fe', 'exhortacion', 
    'servicio', 'ayuda', 'sabiduria', 'conocimiento', 'hospitalidad', 
    'discernimiento'
  ];

  // Validate all spiritual gifts are present
  const missingGifts = expectedGifts.filter(gift => results[gift] === undefined);
  if (missingGifts.length > 0) {
    return { error: `Missing required fields: ${missingGifts.join(', ')}` };
  }

  try {
    // Map the results to sanitized field names
    const sanitizedResults = {
      evangelismo: Number(results.evangelismo),
      liderazgo: Number(results.liderazgo),
      misericordia: Number(results.misericordia),
      administracion: Number(results.administracion),
      profecia: Number(results.profecia),
      dar: Number(results.dar),
      ensenanza: Number(results.ensenanza || results.enseñanza), // Handle both versions
      pastoreo: Number(results.pastoreo),
      fe: Number(results.fe),
      exhortacion: Number(results.exhortacion),
      servicio: Number(results.servicio),
      ayuda: Number(results.ayuda),
      sabiduria: Number(results.sabiduria),
      conocimiento: Number(results.conocimiento),
      hospitalidad: Number(results.hospitalidad),
      discernimiento: Number(results.discernimiento)
    };

    const response = await fetch('/api/user-progress/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        testType: 'dones',
        results: sanitizedResults,
      }),
    });

    const data = await response.json();
    console.log('API Response:', data);

    if (!response.ok) {
      return { error: data.error || 'Error updating test progress' };
    }

    return data;
  } catch (error) {
    console.error('Error updating dones test:', error);
    return { error: 'Error updating test progress' };
  }
}

export async function updateSkillsTest(userId, results) {
  console.log('Updating skills test with:', { userId, results });

  if (!userId) {
    return { error: 'Missing required fields: userId' };
  }

  // Validate results
  if (!results || typeof results !== 'object') {
    return { error: 'Missing required fields: results must be an object' };
  }

  // Expected skill categories
  const expectedCategories = ['R', 'I', 'A', 'S', 'E', 'C'];

  // Validate all categories are present
  const missingCategories = expectedCategories.filter(category => results[category] === undefined);
  if (missingCategories.length > 0) {
    return { error: `Missing required fields: ${missingCategories.join(', ')}` };
  }

  try {
    // Map the results to sanitized field names
    const sanitizedResults = {
      R: Number(results.R),
      I: Number(results.I),
      A: Number(results.A),
      S: Number(results.S),
      E: Number(results.E),
      C: Number(results.C)
    };

    const response = await fetch('/api/user-progress/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        testType: 'skills',
        results: sanitizedResults,
      }),
    });

    const data = await response.json();
    console.log('API Response:', data);

    if (!response.ok) {
      return { error: data.error || 'Error updating test progress' };
    }

    return data;
  } catch (error) {
    console.error('Error updating skills test:', error);
    return { error: 'Error updating test progress' };
  }
}

export async function updatePassionTest(userId, results) {
  console.log('Updating passion test with:', { userId, results });

  if (!userId) {
    return { error: 'Missing required fields: userId' };
  }

  // Validate results
  if (!results || typeof results !== 'object') {
    return { error: 'Missing required fields: results must be an object' };
  }

  // Validate required arrays exist
  const requiredArrays = ['selectedGroups', 'topFiveGroups', 'selectedPassions', 'topThreePassions'];
  const missingArrays = requiredArrays.filter(array => !Array.isArray(results[array]));
  if (missingArrays.length > 0) {
    return { error: `Missing required fields: ${missingArrays.join(', ')} must be arrays` };
  }

  // Validate array lengths
  if (results.topFiveGroups.length !== 5) {
    return { error: 'topFiveGroups must contain exactly 5 items' };
  }

  if (results.topThreePassions.length !== 3) {
    return { error: 'topThreePassions must contain exactly 3 items' };
  }

  try {
    const response = await fetch('/api/user-progress/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        testType: 'passion',
        results: {
          selectedGroups: results.selectedGroups,
          topFiveGroups: results.topFiveGroups,
          selectedPassions: results.selectedPassions,
          topThreePassions: results.topThreePassions
        },
      }),
    });

    const data = await response.json();
    console.log('API Response:', data);

    if (!response.ok) {
      return { error: data.error || 'Error updating test progress' };
    }

    return data;
  } catch (error) {
    console.error('Error updating passion test:', error);
    return { error: 'Error updating test progress' };
  }
}

// Add this function to your src/utils/userProgress.js file

export async function updateExperienceTest(userId, results) {
  console.log('Updating experience test with:', { userId, results });

  if (!userId) {
    return { error: 'Missing required fields: userId' };
  }

  // Validate results
  if (!results || typeof results !== 'object') {
    return { error: 'Missing required fields: results must be an object' };
  }

  try {
    // Make sure these properties exist even if empty
    const sanitizedResults = {
      experienceTypes: results.experienceTypes || [],
      significantEvents: results.significantEvents || [],
      positiveExperiences: results.positiveExperiences || [],
      painfulExperiences: results.painfulExperiences || [],
      lessonsLearned: results.lessonsLearned || '',
      impactOnMinistry: results.impactOnMinistry || '',
      topTwoExperiences: results.topTwoExperiences || []
    };

    // Log the actual data being sent
    console.log('Sanitized experience results being sent to API:', sanitizedResults);

    const response = await fetch('/api/user-progress/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        testType: 'experience',
        results: sanitizedResults,
      }),
    });

    const data = await response.json();
    console.log('API Response for experience test update:', data);

    if (!response.ok) {
      return { error: data.error || 'Error updating test progress' };
    }

    return data;
  } catch (error) {
    console.error('Error updating experience test:', error);
    return { error: 'Error updating test progress' };
  }
}