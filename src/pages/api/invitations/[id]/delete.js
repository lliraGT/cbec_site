// src/pages/api/invitations/[id]/delete.js
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
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if user is authenticated and authorized
    const session = await getServerSession(req, res, authOptions);
    
    if (!session || !['admin', 'staff'].includes(session.user.role?.toLowerCase())) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Invitation ID is required' });
    }

    // First, determine what type of invitation it is
    const invitation = await client.fetch(
      `*[_id == $id][0] {
        _id,
        _type,
        token
      }`,
      { id }
    );

    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    // If it's a testInvitation, we need to delete any associated test results first
    if (invitation._type === 'testInvitation') {
      // Find all test results associated with this invitation token
      const testResults = await client.fetch(
        `*[_type == "testResults" && invitationToken == $token]._id`,
        { token: invitation.token }
      );

      // Delete each test result
      if (testResults && testResults.length > 0) {
        for (const resultId of testResults) {
          await client.delete(resultId);
        }
        console.log(`Deleted ${testResults.length} test results for invitation ${id}`);
      }
    }

    // Now delete the invitation itself
    await client.delete(id);

    return res.status(200).json({ message: 'Invitation successfully deleted' });
  } catch (error) {
    console.error('Error deleting invitation:', error);
    return res.status(500).json({ error: 'Failed to delete invitation' });
  }
}