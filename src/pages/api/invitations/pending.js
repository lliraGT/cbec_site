// src/pages/api/invitations/pending.js
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
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if user is authenticated and authorized
    const session = await getServerSession(req, res, authOptions);
    
    if (!session || !['admin', 'staff'].includes(session.user.role?.toLowerCase())) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const invitations = await client.fetch(`
      *[_type == "invitation" && status == "pending" && expiresAt > now()] | order(createdAt desc) {
        _id,
        email,
        role,
        createdAt,
        expiresAt,
        status
      }
    `);

    return res.status(200).json({ invitations });
  } catch (error) {
    console.error('Error fetching invitations:', error);
    return res.status(500).json({ error: 'Failed to fetch invitations' });
  }
}