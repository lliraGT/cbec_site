// src/pages/api/save-test-results.js
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

  const { token, testType, results } = req.body;

  if (!token || !testType || !results) {
    return res.status(400).json({ error: 'Token, test type, and results are required' });
  }

  try {
    // Verify that the invitation exists and is valid
    const invitation = await client.fetch(
      `*[_type == "testInvitation" && token == $token && status == "pending" && expiresAt > now()][0]{
        _id,
        email,
        tests
      }`,
      { token }
    );

    if (!invitation) {
      return res.status(404).json({ error: 'Invalid or expired invitation' });
    }

    // Check if the test type is allowed for this invitation
    if (!invitation.tests.includes(testType)) {
      return res.status(403).json({ error: 'This test is not included in your invitation' });
    }

    // Map test types to their corresponding result fields
    const resultFields = {
      personalidad: 'personalityResults',
      dones: 'donesResults',
      habilidades: 'skillsResults',
      pasion: 'passionResults',
      experiencia: 'experienceResults'
    };

    const resultField = resultFields[testType];
    if (!resultField) {
      return res.status(400).json({ error: 'Invalid test type' });
    }

    // Check if a testResults document already exists for this invitation
    const existingResults = await client.fetch(
      `*[_type == "testResults" && invitationToken == $token][0]`,
      { token }
    );

    if (existingResults) {
      // Update existing results
      await client
        .patch(existingResults._id)
        .set({
          [resultField]: results,
          updatedAt: new Date().toISOString()
        })
        .commit();
    } else {
      // Create new results document
      await client.create({
        _type: 'testResults',
        invitationToken: token,
        invitation: {
          _type: 'reference',
          _ref: invitation._id
        },
        [resultField]: results,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Save test results error:', error);
    return res.status(500).json({ error: 'Failed to save test results' });
  }
}