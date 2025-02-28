// src/pages/api/test-results.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-01-31',
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if user is authenticated and authorized
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (!['admin', 'elder', 'staff'].includes(session.user.role?.toLowerCase())) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Comprehensive query to fetch test results from multiple sources
    const guestResults = await client.fetch(`
      *[_type == "testResults"] {
        _id,
        firstName,
        lastName,
        "email": invitation->email,
        "userType": "guest",
        "completedTests": [
          personalityResults != null ? "personalidad" : null,
          donesResults != null ? "dones" : null,
          skillsResults != null ? "habilidades" : null,
          passionResults != null ? "pasion" : null,
          experienceResults != null ? "experiencia" : null
        ][@ != null],
        personalityResults,
        donesResults,
        skillsResults,
        passionResults,
        experienceResults,
        createdAt
      } | order(createdAt desc)
    `);

    // Fetch user progress results for logged-in users
    const userProgressResults = await client.fetch(`
      *[_type == "userProgress"] {
        _id,
        "user": user->,
        "completedTests": [
          personalityTestCompleted == true ? "personalidad" : null,
          donesTestCompleted == true ? "dones" : null,
          skillsTestCompleted == true ? "habilidades" : null,
          passionTestCompleted == true ? "pasion" : null,
          experienceTestCompleted == true ? "experiencia" : null
        ][@ != null],
        personalityTestResults,
        donesTestResults,
        skillsTestResults,
        passionTestResults,
        experienceTestResults
      }
    `);

    // Combine and process results
    const processedUserProgressResults = userProgressResults.map(result => ({
      _id: result._id,
      firstName: result.user?.name || 'Usuario',
      lastName: '',
      email: result.user?.email || '',
      userType: 'application',
      completedTests: result.completedTests,
      personalityResults: result.personalityTestResults,
      donesResults: result.donesTestResults,
      skillsResults: result.skillsTestResults,
      passionResults: result.passionTestResults,
      experienceResults: result.experienceTestResults
    }));

    // Combine guest and user progress results
    const combinedResults = [
      ...guestResults,
      ...processedUserProgressResults
    ];

    return res.status(200).json(combinedResults);
  } catch (error) {
    console.error('Error fetching test results:', {
      message: error.message,
      stack: error.stack
    });

    return res.status(500).json({ 
      error: 'Failed to fetch test results', 
      details: error.message
    });
  }
}