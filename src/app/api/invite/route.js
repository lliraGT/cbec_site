// src/app/api/invite/route.js
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createClient } from '@sanity/client';
import { randomBytes } from 'crypto';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2023-05-03',
});

export async function POST(request) {
  try {
    // Check if user is authenticated and authorized
    const session = await getServerSession(authOptions);
    
    if (!session || !['admin', 'staff'].includes(session.user.role?.toLowerCase())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get request body
    const { email, role } = await request.json();

    // Generate invitation token
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    // Create invitation in Sanity
    await client.create({
      _type: 'invitation',
      email,
      role,
      token,
      expiresAt,
      status: 'pending',
      invitedBy: {
        _type: 'reference',
        _ref: session.user.id
      }
    });

    const inviteUrl = `${process.env.NEXTAUTH_URL}/auth/accept-invite?token=${token}`;

    // Send the email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Church Onboarding <onboarding@resend.dev>',
      to: email,
      subject: 'Invitation to join the platform',
      html: `
        <h1>You've been invited!</h1>
        <p>You've been invited to join our platform with the role of ${role}.</p>
        <p>Click the link below to set up your password and access your account:</p>
        <a href="${inviteUrl}" style="display: inline-block; padding: 12px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">Accept Invitation</a>
        <p>This invitation will expire in 24 hours.</p>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p>${inviteUrl}</p>
      `,
    });

    if (error) {
      console.error('Email error:', error);
      return NextResponse.json(
        { error: 'Failed to send invitation email' },
        { status: 500 }
      );
    }

    console.log('Email sent successfully:', data.id);
    return NextResponse.json({ message: 'Invitation sent successfully' });
  } catch (error) {
    console.error('Invitation error:', error);
    return NextResponse.json(
      { error: `Failed to send invitation: ${error.message}` }, 
      { status: 500 }
    );
  }
}