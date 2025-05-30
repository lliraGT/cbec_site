// src/pages/api/all-invitations.js
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

    // Fetch all invitations (both regular and test invitations)
    const invitations = await client.fetch(`
      *[_type in ["invitation", "testInvitation"]] {
        _id,
        _type,
        email,
        token,
        status,
        createdAt,
        expiresAt,
        "type": _type,
        "tests": _type == "testInvitation" ? tests : null,
        "invitedBy": invitedBy->name
      } | order(createdAt desc)
    `);

    return res.status(200).json({ invitations });
  } catch (error) {
    console.error('Error fetching invitations:', error);
    return res.status(500).json({ error: 'Failed to fetch invitations' });
  }
}