import type { ContactEmailData } from './contact-admin';

export function renderContactAutoReplyEmail(
  data: ContactEmailData,
  referenceId: string
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
              <p>Bonjour ${data.name},</p>
              
              <p>Thank you for reaching out to us! We have received your message and will get back to you as soon as possible.</p>
              
              <p><strong>Your inquiry:</strong> ${data.subject}</p>
              <p><strong>Reference:</strong> ${referenceId}</p>
              
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
}
