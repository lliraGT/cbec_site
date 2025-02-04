// pages/api/user-progress/index.js
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false, // We want real-time data
  token: process.env.SANITY_API_TOKEN, // Need a token with write access
  apiVersion: '2024-01-31'
});

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { userId } = req.query;
    
    try {
      // First, check if user progress exists
      let progress = await client.fetch(
        `*[_type == "userProgress" && user._ref == $userId][0]`,
        { userId }
      );

      // If no progress found, initialize it
      if (!progress) {
        progress = await client.create({
          _type: 'userProgress',
          user: {
            _type: 'reference',
            _ref: userId
          },
          personalityTestCompleted: false,
          donesTestCompleted: false,
          skillsTestCompleted: false,
          experienceTestCompleted: false,
          passionTestCompleted: false
        });
      }

      res.status(200).json(progress);
    } catch (error) {
      console.error('Error fetching user progress:', error);
      res.status(500).json({ error: 'Error fetching user progress' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}