// pages/api/complete-invite.js
import { createClient } from '@sanity/client';
import bcrypt from 'bcryptjs';

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

  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ error: 'Token and password are required' });
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

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in Sanity
    const user = await client.create({
      _type: 'user',
      email: invitation.email,
      name: invitation.email.split('@')[0], // Default name from email
      role: invitation.role,
      password: hashedPassword,
    });

    // Update invitation status to completed
    await client.patch(invitation._id).set({
      status: 'completed',
      completedAt: new Date().toISOString(),
    }).commit();

    return res.status(200).json({ message: 'Account created successfully' });
  } catch (error) {
    console.error('Complete invitation error:', error);
    return res.status(500).json({ error: 'Failed to create account' });
  }
}