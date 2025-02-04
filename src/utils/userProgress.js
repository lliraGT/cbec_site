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