export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, phone, subject, message } = data;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const submission = await prisma.contactSubmission.create({
      data: { name, email, phone: phone ?? null, subject, message, status: 'new' },
    });

    // Send notification
    try {
      const appUrl = process.env.NEXTAUTH_URL || '';
      const htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a1628; color: #f0e6d2; padding: 30px; border-radius: 8px;">
          <h2 style="color: #c9a96e; border-bottom: 2px solid #c9a96e; padding-bottom: 10px;">New Contact Form Message</h2>
          <div style="background: #111d33; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong style="color: #c9a96e;">From:</strong> ${name}</p>
            <p><strong style="color: #c9a96e;">Email:</strong> ${email}</p>
            ${phone ? `<p><strong style="color: #c9a96e;">Phone:</strong> ${phone}</p>` : ''}
            <p><strong style="color: #c9a96e;">Subject:</strong> ${subject}</p>
            <div style="background: #0d1829; padding: 15px; border-radius: 4px; border-left: 4px solid #c9a96e; margin-top: 10px;">
              ${message}
            </div>
          </div>
        </div>
      `;
      await fetch('https://apps.abacus.ai/api/sendNotificationEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deployment_token: process.env.ABACUSAI_API_KEY,
          app_id: process.env.WEB_APP_ID,
          notification_id: process.env.NOTIF_ID_CONTACT_FORM_SUBMISSION,
          subject: `Striped World Charters Contact: ${subject} - from ${name}`,
          body: htmlBody,
          is_html: true,
          recipient_email: 'info@stripedworldcharters.com',
          reply_to: email,
          sender_email: appUrl ? `noreply@${new URL(appUrl).hostname}` : 'noreply@stripedworldcharters.com',
          sender_alias: 'Striped World Charters',
        }),
      });
    } catch (emailError: any) {
      console.error('Contact email failed:', emailError);
    }

    return NextResponse.json(submission, { status: 201 });
  } catch (error: any) {
    console.error('Contact error:', error);
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
  }
}
