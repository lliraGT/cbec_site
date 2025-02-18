// pages/api/verify-invite.js
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
    // Query Sanity for the invitation
    const invitation = await client.fetch(
      `*[_type == "invitation" && token == $token && status == "pending" && expiresAt > now()][0]`,
      { token }
    );

    if (!invitation) {
      return res.status(404).json({ error: 'Invalid or expired invitation' });
    }

    return res.status(200).json({ invitation });
  } catch (error) {
    console.error('Verify invitation error:', error);
    return res.status(500).json({ error: 'Failed to verify invitation' });
  }
}