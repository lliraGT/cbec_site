// src/pages/api/test-results/[id].js
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2023-05-03',
});

export default async function handler(req, res) {
  const { id } = req.query;

  // Only allow DELETE method
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if user is authenticated and authorized
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Only admin and staff can delete test results
    if (!['admin', 'staff'].includes(session.user.role?.toLowerCase())) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }

    // Determine if this is a test result or a user progress document
    const document = await client.fetch(
      `*[_id == $id][0] {
        _id,
        _type
      }`,
      { id }
    );

    if (!document) {
      return res.status(404).json({ error: 'Not found' });
    }

    // Handle different types of documents
    if (document._type === 'testResults') {
      // Delete test results
      await client.delete(id);
      return res.status(200).json({ message: 'Test results deleted successfully' });
    } else if (document._type === 'userProgress') {
      // For userProgress, we'll reset all test results instead of deleting the document
      await client
        .patch(id)
        .unset([
          'personalityTestCompleted', 'personalityTestCompletionDate', 'personalityTestResults',
          'donesTestCompleted', 'donesTestCompletionDate', 'donesTestResults',
          'skillsTestCompleted', 'skillsTestCompletionDate', 'skillsTestResults',
          'passionTestCompleted', 'passionTestCompletionDate', 'passionTestResults',
          'experienceTestCompleted', 'experienceTestCompletionDate', 'experienceTestResults'
        ])
        .set({
          personalityTestCompleted: false,
          donesTestCompleted: false,
          skillsTestCompleted: false,
          passionTestCompleted: false,
          experienceTestCompleted: false
        })
        .commit();
      
      return res.status(200).json({ message: 'User progress reset successfully' });
    } else {
      return res.status(400).json({ error: 'Invalid document type' });
    }
  } catch (error) {
    console.error('Error deleting test results:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}