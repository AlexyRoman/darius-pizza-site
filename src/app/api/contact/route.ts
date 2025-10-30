import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { envServer } from '@/lib/env';
import { z } from 'zod';
import {
  renderContactAdminEmail,
  type ContactEmailData,
} from '@/emails/contact-admin';
import { renderContactAutoReplyEmail } from '@/emails/contact-auto-reply';

export const dynamic = 'force-dynamic';

const contactFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(5),
  inquiryType: z.string(),
  message: z.string().min(10),
  preferredContact: z.string().optional(),
  turnstileToken: z.string(),
});

// Verify Turnstile token
async function verifyTurnstileToken(token: string): Promise<boolean> {
  try {
    if (!envServer.TURNSTILE_SECRET_KEY) {
      console.warn(
        'Turnstile secret key not configured, skipping verification'
      );
      return true; // Skip verification if not configured
    }

    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret: envServer.TURNSTILE_SECRET_KEY,
          response: token,
        }),
      }
    );

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validatedData = contactFormSchema.parse(body);

    // Verify Turnstile token if configured
    if (envServer.TURNSTILE_SECRET_KEY) {
      const isValid = await verifyTurnstileToken(validatedData.turnstileToken);
      if (!isValid) {
        console.error('Turnstile verification failed');
        return NextResponse.json(
          { error: 'Verification failed. Please try again.' },
          { status: 403 }
        );
      }
    }

    // Check if Resend is configured
    if (!envServer.RESEND_API_KEY) {
      console.error('Resend API key not configured');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    if (!envServer.RESEND_TO_EMAIL || !envServer.RESEND_FROM_EMAIL) {
      console.error('Resend email addresses not configured');
      return NextResponse.json(
        { error: 'Email addresses not configured' },
        { status: 500 }
      );
    }

    // Initialize Resend lazily to avoid build-time initialization
    const resend = new Resend(envServer.RESEND_API_KEY);

    // Format the inquiry type for display
    const inquiryTypes: Record<string, string> = {
      general: 'General Question',
      catering: 'Catering Request',
      feedback: 'Feedback',
      complaint: 'Complaint',
      compliment: 'Compliment',
      employment: 'Employment',
      other: 'Other',
    };

    const inquiryTypeLabel =
      inquiryTypes[validatedData.inquiryType] || validatedData.inquiryType;

    // Create email content
    const emailSubject = `Contact Form: ${validatedData.subject}`;
    const submittedAt = new Date();
    const emailHtml = renderContactAdminEmail(
      validatedData as ContactEmailData,
      inquiryTypeLabel,
      submittedAt
    );

    // Send email using Resend
    const result = await resend.emails.send({
      from: envServer.RESEND_FROM_EMAIL,
      to: envServer.RESEND_TO_EMAIL,
      subject: emailSubject,
      html: emailHtml,
      replyTo: validatedData.email,
    });

    // Check if email was sent successfully
    if (result.error) {
      console.error('Failed to send email:', result.error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    // Also send auto-reply to the customer
    const referenceId = new Date().toISOString();
    const autoReplyHtml = renderContactAutoReplyEmail(
      validatedData as ContactEmailData,
      referenceId
    );

    // Send auto-reply (optional - don't fail the whole request if this fails)
    try {
      await resend.emails.send({
        from: envServer.RESEND_FROM_EMAIL,
        to: validatedData.email,
        subject: 'Thank you for contacting Darius Pizza',
        html: autoReplyHtml,
      });
    } catch (autoReplyError) {
      console.error('Failed to send auto-reply:', autoReplyError);
      // Continue even if auto-reply fails
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Message sent successfully',
        id: result.data?.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing contact form:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid form data', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
