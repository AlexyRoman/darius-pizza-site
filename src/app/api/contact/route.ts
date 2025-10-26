import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { envServer } from '@/lib/env';
import { z } from 'zod';

const resend = new Resend(envServer.RESEND_API_KEY);

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
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #d97706; color: white; padding: 20px; text-align: center; }
            .content { background: #f9fafb; padding: 20px; margin: 20px 0; border-radius: 8px; }
            .field { margin: 15px 0; }
            .label { font-weight: bold; color: #555; }
            .value { margin-top: 5px; color: #333; }
            .message { background: white; padding: 15px; border-left: 4px solid #d97706; margin: 15px 0; }
            .footer { text-align: center; color: #666; font-size: 14px; margin-top: 30px; padding: 20px; border-top: 1px solid #e5e7eb; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🍕 New Contact Form Submission</h1>
            </div>
            
            <div class="content">
              <div class="field">
                <div class="label">Name:</div>
                <div class="value">${validatedData.name}</div>
              </div>
              
              <div class="field">
                <div class="label">Email:</div>
                <div class="value">${validatedData.email}</div>
              </div>
              
              ${
                validatedData.phone
                  ? `
              <div class="field">
                <div class="label">Phone:</div>
                <div class="value">${validatedData.phone}</div>
              </div>
              `
                  : ''
              }
              
              <div class="field">
                <div class="label">Inquiry Type:</div>
                <div class="value">${inquiryTypeLabel}</div>
              </div>
              
              <div class="field">
                <div class="label">Subject:</div>
                <div class="value">${validatedData.subject}</div>
              </div>
              
              ${
                validatedData.preferredContact
                  ? `
              <div class="field">
                <div class="label">Preferred Contact Method:</div>
                <div class="value">${validatedData.preferredContact}</div>
              </div>
              `
                  : ''
              }
              
              <div class="message">
                <div class="label">Message:</div>
                <div class="value">${validatedData.message.replace(/\n/g, '<br>')}</div>
              </div>
            </div>
            
            <div class="footer">
              <p>This email was sent from the Darius Pizza website contact form.</p>
              <p>Submitted: ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </body>
      </html>
    `;

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
    const autoReplyHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #d97706; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .footer { text-align: center; color: #666; font-size: 14px; margin-top: 30px; padding: 20px; border-top: 1px solid #e5e7eb; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🍕 Thank You for Contacting Darius Pizza</h1>
            </div>
            
            <div class="content">
              <p>Bonjour ${validatedData.name},</p>
              
              <p>Thank you for reaching out to us! We have received your message and will get back to you as soon as possible.</p>
              
              <p><strong>Your inquiry:</strong> ${validatedData.subject}</p>
              <p><strong>Reference:</strong> ${new Date().toISOString()}</p>
              
              <p>In the meantime, feel free to follow us on social media or visit our website for the latest updates.</p>
              
              <p>Best regards,<br>The Darius Pizza Team</p>
            </div>
            
            <div class="footer">
              <p>Darius Pizza</p>
              <p>275 Avenue des Alliés, 83240 Cavalaire</p>
              <p>Phone: 04.94.64.05.11</p>
            </div>
          </div>
        </body>
      </html>
    `;

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
