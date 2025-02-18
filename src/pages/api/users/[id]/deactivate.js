// src/pages/api/users/[id]/deactivate.js
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
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session || !['admin'].includes(session.user.role?.toLowerCase())) {
      return res.status(403).json({ error: 'Only admins can deactivate users' });
    }

    const { id } = req.query;

    // Deactivate user in Sanity
    await client
      .patch(id)
      .set({ 
        active: false,
        deactivatedAt: new Date().toISOString(),
        deactivatedBy: {
          _type: 'reference',
          _ref: session.user.id
        }
      })
      .commit();

    return res.status(200).json({ message: 'User deactivated successfully' });
  } catch (error) {
    console.error('Error deactivating user:', error);
    return res.status(500).json({ error: 'Failed to deactivate user' });
  }
}