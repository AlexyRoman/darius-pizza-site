export interface ContactEmailData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  inquiryType: string;
  message: string;
  preferredContact?: string;
}

export function renderContactAdminEmail(
  data: ContactEmailData,
  inquiryTypeLabel: string,
  submittedAt: Date
): string {
  return `
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
                <div class="value">${data.name}</div>
              </div>
              
              <div class="field">
                <div class="label">Email:</div>
                <div class="value">${data.email}</div>
              </div>
              
              ${
                data.phone
                  ? `
              <div class="field">
                <div class="label">Phone:</div>
                <div class="value">${data.phone}</div>
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
                <div class="value">${data.subject}</div>
              </div>
              
              ${
                data.preferredContact
                  ? `
              <div class="field">
                <div class="label">Preferred Contact Method:</div>
                <div class="value">${data.preferredContact}</div>
              </div>
              `
                  : ''
              }
              
              <div class="message">
                <div class="label">Message:</div>
                <div class="value">${data.message.replace(/\n/g, '<br>')}</div>
              </div>
            </div>
            
            <div class="footer">
              <p>This email was sent from the Darius Pizza website contact form.</p>
              <p>Submitted: ${submittedAt.toLocaleString()}</p>
            </div>
          </div>
        </body>
      </html>
    `;
}
