// Path: src/pages/api/user-progress/reset-test.js
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-01-31'
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { userId, testType } = req.body;

  if (!userId || !testType) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Support both English and Spanish test types
  const validTestTypes = [
    'personality', 'dones', 'skills', 'experience', 'passion', 
    'personalidad', 'habilidades', 'experiencia', 'pasion'
  ];
  
  if (!validTestTypes.includes(testType)) {
    return res.status(400).json({ error: `Invalid test type: ${testType}` });
  }

  // Map Spanish test types to English field names
  const testTypeMapping = {
    'personalidad': 'personality',
    'habilidades': 'skills',
    'experiencia': 'experience',
    'pasion': 'passion',
    // Ensure English types map to themselves
    'personality': 'personality',
    'dones': 'dones',
    'skills': 'skills',
    'experience': 'experience',
    'passion': 'passion'
  };

  const normalizedTestType = testTypeMapping[testType];
  console.log('Normalized test type:', normalizedTestType, 'from:', testType);

  try {
    // First, check if user progress exists
    const existingProgress = await client.fetch(
      `*[_type == "userProgress" && user._ref == $userId][0]`,
      { userId }
    );

    if (!existingProgress) {
      return res.status(404).json({ error: 'User progress not found' });
    }

    // Map test type to field names to reset
    const testFields = {
      personality: {
        completed: 'personalityTestCompleted',
        date: 'personalityTestCompletionDate',
        results: 'personalityTestResults'
      },
      dones: {
        completed: 'donesTestCompleted',
        date: 'donesTestCompletionDate',
        results: 'donesTestResults'
      },
      skills: {
        completed: 'skillsTestCompleted',
        date: 'skillsTestCompletionDate',
        results: 'skillsTestResults'
      },
      experience: {
        completed: 'experienceTestCompleted',
        date: 'experienceTestCompletionDate',
        results: 'experienceTestResults'
      },
      passion: {
        completed: 'passionTestCompleted',
        date: 'passionTestCompletionDate',
        results: 'passionTestResults'
      }
    };

    const fields = testFields[normalizedTestType];
    
    if (!fields) {
      return res.status(400).json({ error: `Could not map test type: ${testType} to ${normalizedTestType}` });
    }
    
    // Create an unset operation to remove the fields
    const unsetFields = [fields.completed, fields.date, fields.results];
    
    console.log('Unsetting fields:', unsetFields);
    
    // Update the document to reset the test
    await client
      .patch(existingProgress._id)
      .unset(unsetFields)
      .set({ [fields.completed]: false }) // Explicitly set the completed flag to false
      .commit();

    res.status(200).json({ message: `${testType} test reset successfully` });
  } catch (error) {
    console.error(`Error resetting ${testType} test:`, error);
    res.status(500).json({ error: `Error resetting ${testType} test: ${error.message}` });
  }
}