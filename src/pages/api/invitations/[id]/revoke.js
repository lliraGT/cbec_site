// src/pages/api/invitations/[id]/revoke.js
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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if user is authenticated and authorized
    const session = await getServerSession(req, res, authOptions);
    
    if (!session || !['admin', 'staff'].includes(session.user.role?.toLowerCase())) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { id } = req.query;

    // Update the invitation status to revoked
    await client
      .patch(id)
      .set({
        status: 'revoked',
        revokedAt: new Date().toISOString(),
        revokedBy: {
          _type: 'reference',
          _ref: session.user.id
        }
      })
      .commit();

    return res.status(200).json({ message: 'Invitation revoked successfully' });
  } catch (error) {
    console.error('Error revoking invitation:', error);
    return res.status(500).json({ error: 'Failed to revoke invitation' });
  }
}