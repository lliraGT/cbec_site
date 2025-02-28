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

  const { token, testType, results, firstName, lastName } = req.body;

  // Debug
  console.log('API received data:', { token, testType, firstName, lastName });
  console.log('Results data:', JSON.stringify(results).substring(0, 200) + '...');

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
      `*[_type == "testResults" && invitationToken == $token][0]{
        _id,
        firstName,
        lastName
      }`,
      { token }
    );

    // Debug
    console.log('Existing results found:', existingResults ? 'Yes' : 'No');
    if (existingResults) {
      console.log('Existing first/last name:', existingResults.firstName, existingResults.lastName);
    }

    if (existingResults) {
      // Debug field that will be updated
      console.log('Updating field:', resultField, 'in document:', existingResults._id);
      
      // Update existing results with new data for this test
      const updateData = {
        [resultField]: results,
        updatedAt: new Date().toISOString()
      };
      
      // Always update first and last name if provided
      if (firstName) {
        updateData.firstName = firstName;
        console.log('Setting firstName to:', firstName);
      }
      
      if (lastName) {
        updateData.lastName = lastName;
        console.log('Setting lastName to:', lastName);
      }
      
      const updated = await client
        .patch(existingResults._id)
        .set(updateData)
        .commit();
        
      console.log('Update successful, document id:', updated._id);
    } else {
      // Create new results document with all available data
      const newDoc = {
        _type: 'testResults',
        invitationToken: token,
        invitation: {
          _type: 'reference',
          _ref: invitation._id
        },
        [resultField]: results,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Add first and last name if provided
      if (firstName) {
        newDoc.firstName = firstName;
        console.log('Creating with firstName:', firstName);
      }
      
      if (lastName) {
        newDoc.lastName = lastName;
        console.log('Creating with lastName:', lastName);
      }
      
      const created = await client.create(newDoc);
      console.log('Created new document with id:', created._id);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Save test results error:', error);
    return res.status(500).json({ error: 'Failed to save test results: ' + error.message });
  }
}