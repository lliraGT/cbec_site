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

    // Comprehensive query to fetch test results from guest users - simplified to avoid syntax errors
    const guestResults = await client.fetch(`
      *[_type == "testResults"] {
        _id,
        firstName,
        lastName,
        "email": invitation->email,
        "userType": "guest",
        "completedTests": [],
        personalityResults,
        donesResults,
        skillsResults,
        passionResults,
        experienceResults,
        createdAt
      } | order(createdAt desc)
    `);
    
    // Fix the completedTests array for each result
    const processedGuestResults = guestResults.map(result => {
      const completedTests = [];
      if (result.personalityResults) completedTests.push("personalidad");
      if (result.donesResults) completedTests.push("dones");
      if (result.skillsResults) completedTests.push("habilidades");
      if (result.passionResults) completedTests.push("pasion");
      if (result.experienceResults) completedTests.push("experiencia");
      
      return {
        ...result,
        completedTests
      };
    });

    // Fetch user progress results for logged-in users - simplified query
    const userProgressResults = await client.fetch(`
      *[_type == "userProgress"] {
        _id,
        "user": user->,
        personalityTestCompleted,
        donesTestCompleted,
        skillsTestCompleted,
        passionTestCompleted,
        experienceTestCompleted,
        personalityTestResults,
        donesTestResults,
        skillsTestResults,
        passionTestResults,
        experienceTestResults
      }
    `);

    // Process and format user progress results to match the guest results format
    const processedUserProgressResults = userProgressResults.map(result => {
      const completedTests = [];
      if (result.personalityTestCompleted) completedTests.push("personalidad");
      if (result.donesTestCompleted) completedTests.push("dones");
      if (result.skillsTestCompleted) completedTests.push("habilidades");
      if (result.passionTestCompleted) completedTests.push("pasion");
      if (result.experienceTestCompleted) completedTests.push("experiencia");
      
      const nameParts = result.user?.name?.split(' ') || ['Usuario'];
      
      return {
        _id: result._id,
        firstName: nameParts[0],
        lastName: nameParts.slice(1).join(' '),
        email: result.user?.email || '',
        userType: 'application',
        completedTests,
        personalityResults: result.personalityTestResults || null,
        donesResults: result.donesTestResults || null,
        skillsResults: result.skillsTestResults || null,
        passionResults: result.passionTestResults || null,
        experienceResults: result.experienceTestResults || null
      };
    });

    // Combine guest and user progress results
    const combinedResults = [
      ...processedGuestResults,
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