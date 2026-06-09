import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || '',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  const from = process.env.SMTP_FROM || '"AI Hiring Portal" <no-reply@hiringportal.com>';

  const isSmtpConfigured =
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS;

  if (!isSmtpConfigured) {
    console.log(`\n============================================================`);
    console.log(`[EMAIL DISPATCH (DEV FALLBACK - SMTP NOT CONFIGURED)]`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`------------------------------------------------------------`);
    // Basic text representation
    console.log(html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 500) + '...');
    console.log(`============================================================\n`);
    return { success: true, logged: true };
  }

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });
    console.log(`Email sent successfully: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email via Nodemailer:', error);
    return { success: false, error };
  }
}

const getEmailWrapper = (title: string, content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f8fafc;
      color: #334155;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05);
    }
    .header {
      background: linear-gradient(135deg, #4f46e5, #06b6d4);
      padding: 32px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.025em;
    }
    .content {
      padding: 40px 32px;
      line-height: 1.6;
    }
    .button-container {
      margin: 32px 0 16px;
      text-align: center;
    }
    .button {
      display: inline-block;
      background-color: #4f46e5;
      color: #ffffff !important;
      font-weight: 600;
      padding: 12px 24px;
      border-radius: 8px;
      text-decoration: none;
      transition: background-color 0.2s;
    }
    .footer {
      background-color: #f8fafc;
      border-top: 1px solid #e2e8f0;
      padding: 24px;
      text-align: center;
      font-size: 12px;
      color: #64748b;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 16px;
      text-transform: uppercase;
    }
    .badge-welcome { background-color: #e0e7ff; color: #4338ca; }
    .badge-applied { background-color: #e0f2fe; color: #0369a1; }
    .badge-reviewing { background-color: #fef3c7; color: #d97706; }
    .badge-shortlisted { background-color: #dcfce7; color: #15803d; }
    .badge-rejected { background-color: #fee2e2; color: #b91c1c; }
    .badge-hired { background-color: #fae8ff; color: #86198f; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>AI Hiring Portal</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} AI Hiring Portal. All rights reserved.<br>
      This is an automated notification. Please do not reply directly to this email.
    </div>
  </div>
</body>
</html>
`;

export async function sendWelcomeEmail(name: string, email: string, role: string) {
  const subject = `Welcome to AI Hiring Portal, ${name}!`;
  const content = `
    <span class="badge badge-welcome">Welcome</span>
    <p>Dear ${name},</p>
    <p>Thank you for registering on the <strong>AI Hiring Portal</strong>. We are thrilled to have you join our platform.</p>
    <p>You have registered as a <strong>${role === 'RECRUITER' ? 'Recruiter' : 'Applicant'}</strong>. You can now access your dashboard to ${role === 'RECRUITER' ? 'create job postings, manage applicants, and streamline your hiring' : 'find job opportunities, apply with tailored resumes, and track your applications'}.</p>
    <div class="button-container">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" class="button">Go to Dashboard</a>
    </div>
    <p>Best regards,<br>The AI Hiring Team</p>
  `;
  const html = getEmailWrapper(subject, content);
  return sendEmail({ to: email, subject, html });
}

export async function sendApplicationReceivedEmail(
  name: string,
  email: string,
  jobTitle: string,
  company: string
) {
  const subject = `Application Received: ${jobTitle} at ${company}`;
  const content = `
    <span class="badge badge-applied">Application Received</span>
    <p>Dear ${name},</p>
    <p>Your application for the position of <strong>${jobTitle}</strong> at <strong>${company}</strong> has been successfully received.</p>
    <p>Our team is currently reviewing your resume. You can track the real-time status of your application directly from your dashboard.</p>
    <div class="button-container">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/applicant/applications" class="button">Track Application</a>
    </div>
    <p>Thank you for your interest, and we wish you the best of luck!</p>
    <p>Best regards,<br>${company} Hiring Team</p>
  `;
  const html = getEmailWrapper(subject, content);
  return sendEmail({ to: email, subject, html });
}

export async function sendStatusUpdateEmail(
  name: string,
  email: string,
  jobTitle: string,
  company: string,
  status: 'REVIEWING' | 'SHORTLISTED' | 'REJECTED' | 'HIRED'
) {
  let badgeClass = 'badge-welcome';
  let badgeText: string = status;
  let subject = `Application Status Update: ${jobTitle} at ${company}`;
  const customGreeting = `Dear ${name},`;
  let bodyContent = '';

  switch (status) {
    case 'REVIEWING':
      badgeClass = 'badge-reviewing';
      badgeText = 'Under Review';
      bodyContent = `
        <p>We wanted to let you know that your application for <strong>${jobTitle}</strong> at <strong>${company}</strong> is currently being reviewed by our hiring team.</p>
        <p>We will reach out to you if your background matches our requirements for next steps. No action is required from you at this time.</p>
      `;
      break;
    case 'SHORTLISTED':
      badgeClass = 'badge-shortlisted';
      badgeText = 'Shortlisted';
      subject = `🎉 Congratulations! Shortlisted for ${jobTitle} at ${company}`;
      bodyContent = `
        <p>We have exciting news! You have been <strong>shortlisted</strong> for the <strong>${jobTitle}</strong> role at <strong>${company}</strong>.</p>
        <p>Our recruitment team will be in touch with you shortly to schedule the next round of interviews and discuss further details.</p>
        <p>Get ready and check your dashboard for updates!</p>
      `;
      break;
    case 'REJECTED':
      badgeClass = 'badge-rejected';
      badgeText = 'Status Update';
      subject = `Application update regarding ${jobTitle} at ${company}`;
      bodyContent = `
        <p>Thank you for taking the time to apply for the <strong>${jobTitle}</strong> position at <strong>${company}</strong> and for participating in our recruitment process.</p>
        <p>After careful consideration, we regret to inform you that we will not be moving forward with your application at this time. We received many qualified candidates and had to make some very difficult decisions.</p>
        <p>We appreciate your interest in our company and wish you the very best in your job search and future endeavors.</p>
      `;
      break;
    case 'HIRED':
      badgeClass = 'badge-hired';
      badgeText = 'Hired';
      subject = `🏆 Congratulations! You've been hired as ${jobTitle} at ${company}!`;
      bodyContent = `
        <p>We are absolutely delighted to offer you the position of <strong>${jobTitle}</strong> at <strong>${company}</strong>!</p>
        <p>Your qualifications and interviews stood out, and we believe you will be a fantastic addition to our team.</p>
        <p>Our onboarding team will contact you shortly with the formal offer letter, contract details, and next steps for your onboarding.</p>
        <p>Welcome aboard! We look forward to working with you.</p>
      `;
      break;
  }

  const content = `
    <span class="badge ${badgeClass}">${badgeText}</span>
    <p>${customGreeting}</p>
    ${bodyContent}
    <div class="button-container">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" class="button">View Dashboard</a>
    </div>
    <p>Best regards,<br>${company} Hiring Team</p>
  `;
  const html = getEmailWrapper(subject, content);
  return sendEmail({ to: email, subject, html });
}

export async function sendOTPEmail(email: string, otp: string) {
  const subject = `Your Verification Code: ${otp}`;
  const content = `
    <span class="badge badge-welcome">OTP Verification</span>
    <p>Hello,</p>
    <p>You requested a verification code to sign in to the <strong>AI Hiring Portal</strong>.</p>
    <p>Your OTP verification code is:</p>
    <div style="font-size: 32px; font-weight: 800; letter-spacing: 4px; text-align: center; margin: 24px 0; color: #4f46e5;">
      ${otp}
    </div>
    <p>This code is valid for 5 minutes. If you did not request this, please ignore this email.</p>
    <p>Best regards,<br>The AI Hiring Team</p>
  `;
  const html = getEmailWrapper(subject, content);
  return sendEmail({ to: email, subject, html });
}

export async function sendPasswordResetEmail(email: string, otp: string) {
  const subject = `Reset Your Password - Verification Code: ${otp}`;
  const content = `
    <span class="badge badge-rejected" style="background-color: #fee2e2; color: #b91c1c;">Password Reset</span>
    <p>Hello,</p>
    <p>We received a request to reset the password for your <strong>AI Hiring Portal</strong> account.</p>
    <p>Your password reset verification code is:</p>
    <div style="font-size: 32px; font-weight: 800; letter-spacing: 4px; text-align: center; margin: 24px 0; color: #dc2626;">
      ${otp}
    </div>
    <p>This code is valid for 5 minutes. If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
    <p>Best regards,<br>The AI Hiring Team</p>
  `;
  const html = getEmailWrapper(subject, content);
  return sendEmail({ to: email, subject, html });
}

