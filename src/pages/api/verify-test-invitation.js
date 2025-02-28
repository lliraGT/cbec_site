// src/pages/api/verify-test-invitation.js
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2023-05-03',
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    // Query Sanity for the test invitation
    const invitation = await client.fetch(
      `*[_type == "testInvitation" && token == $token && status == "pending" && expiresAt > now()][0]{
        _id,
        email,
        tests,
        status,
        expiresAt,
        createdAt
      }`,
      { token }
    );

    if (!invitation) {
      return res.status(404).json({ error: 'Invalid or expired invitation' });
    }

    // Check if there are any existing results for this invitation
    const testResults = await client.fetch(
      `*[_type == "testResults" && invitationToken == $token][0]{
        "personalidad": personalityResults,
        "dones": donesResults,
        "habilidades": skillsResults,
        "pasion": passionResults,
        "experiencia": experienceResults
      }`,
      { token }
    );

    return res.status(200).json({ 
      invitation, 
      results: testResults || {} 
    });
  } catch (error) {
    console.error('Verify test invitation error:', error);
    return res.status(500).json({ error: 'Failed to verify invitation' });
  }
}