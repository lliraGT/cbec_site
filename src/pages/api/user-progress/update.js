// pages/api/user-progress/update.js
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-31'
});

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { userId, testType, results } = req.body;

  if (!userId || !testType) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const validTestTypes = ['personality', 'dones', 'skills', 'experience', 'passion'];
  if (!validTestTypes.includes(testType)) {
    return res.status(400).json({ error: 'Invalid test type' });
  }

  try {
    // First, check if user progress exists
    const existingProgress = await client.fetch(
      `*[_type == "userProgress" && user._ref == $userId][0]`,
      { userId }
    );

    if (!existingProgress) {
      return res.status(404).json({ error: 'User progress not found' });
    }

    // Map test type to field names
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

    const fields = testFields[testType];
    const updateData = {
      [fields.completed]: true,
      [fields.date]: new Date().toISOString(),
      [fields.results]: results
    };

    // Update the document
    const updatedProgress = await client
      .patch(existingProgress._id)
      .set(updateData)
      .commit();

    res.status(200).json(updatedProgress);
  } catch (error) {
    console.error('Error updating user progress:', error);
    res.status(500).json({ error: 'Error updating user progress' });
  }
}