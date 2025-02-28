// src/pages/api/invite-to-tests.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createClient } from '@sanity/client';
import { randomBytes } from 'crypto';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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
    // Check if user is authenticated
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Get request body
    const { email, tests } = req.body;

    if (!email || !tests || !Array.isArray(tests) || tests.length === 0) {
      return res.status(400).json({ error: 'Email and at least one test are required' });
    }

    // Generate invitation token
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

    // Create test invitation in Sanity
    await client.create({
      _type: 'testInvitation',
      email,
      token,
      expiresAt,
      tests,
      status: 'pending',
      invitedBy: {
        _type: 'reference',
        _ref: session.user.id
      }
    });

    // Generate invitation URL - now pointing to the welcome page
    const inviteUrl = `${process.env.NEXTAUTH_URL}/tests-welcome?token=${token}`;

    // Format test names for email
    const testNames = {
      personalidad: 'Test de Personalidad',
      dones: 'Test de Dones Espirituales',
      habilidades: 'Test de Habilidades',
      pasion: 'Test de Pasión',
      experiencia: 'Test de Experiencia'
    };

    const testList = tests.map(test => `<li>${testNames[test] || test}</li>`).join('');

    // Send the email using Resend
    const { data, error } = await resend.emails.send({
      from: 'CBEC | Pruebas Descubre <descubre@cbec.online>',
      to: email,
      subject: 'Invitación para completar tests de descubrimiento',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #8B2332;">Has sido invitado a completar tests de descubrimiento</h1>
          <p>Has sido invitado a completar los siguientes tests:</p>
          <ul>
            ${testList}
          </ul>
          <p>Estos tests te ayudarán a descubrir tus dones espirituales, personalidad, habilidades y pasiones para servir mejor en el cuerpo de Cristo.</p>
          <p>Haz clic en el botón a continuación para acceder a los tests:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${inviteUrl}" style="display: inline-block; padding: 12px 24px; background-color: #8B2332; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">Acceder a los Tests</a>
          </div>
          <p>Este enlace expirará en 30 días.</p>
          <p>Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
          <p>${inviteUrl}</p>
        </div>
      `,
    });

    if (error) {
      console.error('Email error:', error);
      return res.status(500).json({ error: 'Failed to send invitation email' });
    }

    return res.status(200).json({ message: 'Invitation sent successfully' });
  } catch (error) {
    console.error('Invitation error:', error);
    return res.status(500).json({ error: `Failed to send invitation: ${error.message}` });
  }
}