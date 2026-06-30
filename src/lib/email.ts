import nodemailer from 'nodemailer';
import { generateOfferLetterPDF, type OfferLetterData } from './offerLetterGenerator';

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
  attachments?: {
    filename: string;
    content: Buffer;
    contentType?: string;
  }[];
}

export async function sendEmail({ to, subject, html, attachments }: SendEmailParams) {
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
    if (attachments?.length) {
      console.log(`Attachments: ${attachments.map(a => `${a.filename} (${(a.content.length / 1024).toFixed(1)}KB)`).join(', ')}`);
    }
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
      attachments: attachments?.map(a => ({
        filename: a.filename,
        content: a.content,
        contentType: a.contentType || 'application/pdf',
      })),
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
  status: 'REVIEWING' | 'SHORTLISTED' | 'REJECTED' | 'HIRED',
  jobDetails?: {
    salaryMin?: number | null;
    salaryMax?: number | null;
    salaryCurrency?: string | null;
    employmentType?: string;
    location?: string;
    locationType?: string;
    startDate?: string | null;
  }
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
        <div style="background: linear-gradient(135deg, #fae8ff, #e0e7ff); border: 1px solid #c084fc; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
          <div style="font-size: 28px; margin-bottom: 6px;">🎉📄🏆</div>
          <div style="font-size: 16px; font-weight: 700; color: #6d28d9;">Your Offer Letter is Attached!</div>
          <div style="font-size: 12px; color: #7c3aed; margin-top: 4px;">Please find the formal offer letter attached to this email as a PDF.</div>
        </div>
        <p>Please review the attached offer letter carefully. Our onboarding team will follow up shortly with contract details and next steps for your onboarding.</p>
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

  // Generate offer letter PDF attachment for HIRED status
  let attachments: { filename: string; content: Buffer; contentType: string }[] | undefined;
  if (status === 'HIRED') {
    try {
      const offerPdf = await generateOfferLetterPDF({
        candidateName: name,
        jobTitle,
        company,
        salaryMin: jobDetails?.salaryMin,
        salaryMax: jobDetails?.salaryMax,
        salaryCurrency: jobDetails?.salaryCurrency,
        employmentType: jobDetails?.employmentType,
        location: jobDetails?.location,
        locationType: jobDetails?.locationType,
        startDate: jobDetails?.startDate || undefined,
      });
      attachments = [{
        filename: `Offer_Letter_${name.replace(/\s+/g, '_')}_${jobTitle.replace(/\s+/g, '_')}.pdf`,
        content: offerPdf,
        contentType: 'application/pdf',
      }];
    } catch (err) {
      console.error('Failed to generate offer letter PDF for status update email:', err);
    }
  }

  return sendEmail({ to: email, subject, html, attachments });
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

export async function sendAiDecisionEmail(
  name: string,
  email: string,
  jobTitle: string,
  company: string,
  classification: string,
  aiSummary: string
) {
  let badgeClass = 'badge-welcome';
  let badgeText = 'Application Update';
  let subject = `Application Update: ${jobTitle} at ${company}`;
  let bodyContent = '';

  switch (classification) {
    case 'MATCHING':
      badgeClass = 'badge-shortlisted';
      badgeText = 'Shortlisted';
      subject = `🎉 Great News! You've been shortlisted for ${jobTitle} at ${company}`;
      bodyContent = `
        <p>We're excited to share that after our AI-powered initial screening, your profile has been identified as a <strong>strong match</strong> for the <strong>${jobTitle}</strong> position at <strong>${company}</strong>!</p>
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <strong style="color: #15803d;">AI Assessment:</strong>
          <p style="color: #166534; margin: 8px 0 0;">${aiSummary}</p>
        </div>
        <p>Our recruitment team will review your application next and reach out to schedule the next steps. Please keep an eye on your dashboard for updates.</p>
      `;
      break;

    case 'NEAR_BOUND':
      badgeClass = 'badge-reviewing';
      badgeText = 'Under Review';
      subject = `Application Update: Your profile is under review for ${jobTitle} at ${company}`;
      bodyContent = `
        <p>Thank you for your interest in the <strong>${jobTitle}</strong> position at <strong>${company}</strong>.</p>
        <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <strong style="color: #d97706;">AI Assessment:</strong>
          <p style="color: #92400e; margin: 8px 0 0;">${aiSummary}</p>
        </div>
        <p>Your profile shows potential for this role and has been flagged for further review by our recruitment team. We'll be in touch once a decision is made.</p>
        <p>In the meantime, you can track your application status from your dashboard.</p>
      `;
      break;

    case 'NOT_MATCHING':
      badgeClass = 'badge-rejected';
      badgeText = 'Application Update';
      subject = `Application update regarding ${jobTitle} at ${company}`;
      bodyContent = `
        <p>Thank you for taking the time to apply for the <strong>${jobTitle}</strong> position at <strong>${company}</strong>.</p>
        <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <strong style="color: #b91c1c;">Assessment Summary:</strong>
          <p style="color: #991b1b; margin: 8px 0 0;">${aiSummary}</p>
        </div>
        <p>After our initial screening, we've determined that your profile may not be the strongest fit for this particular role at this time. However, we encourage you to apply for other positions that may better align with your skills and experience.</p>
        <p>We appreciate your interest and wish you the very best in your career journey.</p>
      `;
      break;

    default:
      bodyContent = `
        <p>Thank you for your application to the <strong>${jobTitle}</strong> position at <strong>${company}</strong>.</p>
        <p>Your application is currently being processed. We'll update you once a decision has been made.</p>
      `;
  }

  const content = `
    <span class="badge ${badgeClass}">${badgeText}</span>
    <p>Dear ${name},</p>
    ${bodyContent}
    <div class="button-container">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" class="button">View Dashboard</a>
    </div>
    <p>Best regards,<br>${company} Hiring Team</p>
  `;
  const html = getEmailWrapper(subject, content);
  return sendEmail({ to: email, subject, html });
}

/**
 * Send interview scheduled email to applicant with date/time details.
 * Optionally includes info about the previous round that was cleared.
 */
export async function sendInterviewScheduledEmail(
  name: string,
  email: string,
  jobTitle: string,
  company: string,
  roundName: string,
  roundNumber: number,
  scheduledDate: Date,
  interviewLink?: string | null,
  interviewInfo?: string | null,
  clearedRound?: {
    roundName: string;
    roundNumber: number;
  } | null
) {
  const formattedDate = scheduledDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = scheduledDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const subject = `📅 Interview Scheduled: ${roundName} for ${jobTitle} at ${company}`;

  const content = `
    <span class="badge badge-applied">Interview Scheduled</span>
    <p>Dear ${name},</p>
    <p>We are pleased to inform you that your interview for the <strong>${jobTitle}</strong> position at <strong>${company}</strong> has been scheduled.</p>
    
    <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
      <div style="font-size: 11px; color: #60a5fa; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 4px;">
        Scheduled Interview
      </div>
      <div style="font-size: 14px; color: #3b82f6; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
        ${roundName} (Round ${roundNumber})
      </div>
      <div style="font-size: 24px; font-weight: 800; color: #1e40af; margin-bottom: 4px;">
        ${formattedDate}
      </div>
      <div style="font-size: 18px; font-weight: 600; color: #2563eb;">
        ${formattedTime}
      </div>
    </div>

    ${interviewLink ? `
    <div style="margin: 24px 0; padding: 16px; background-color: #f8fafc; border-left: 4px solid #3b82f6; border-radius: 4px;">
      <p style="margin-top: 0; font-weight: bold; color: #1e293b;">Interview Link:</p>
      <a href="${interviewLink}" style="color: #2563eb; text-decoration: underline; word-break: break-all;">${interviewLink}</a>
    </div>
    ` : ''}

    ${interviewInfo ? `
    <div style="margin: 24px 0; padding: 16px; background-color: #f8fafc; border-left: 4px solid #8b5cf6; border-radius: 4px;">
      <p style="margin-top: 0; font-weight: bold; color: #1e293b;">Additional Information from Recruiter:</p>
      <p style="margin-bottom: 0; color: #334155; white-space: pre-wrap;">${interviewInfo}</p>
    </div>
    ` : ''}

    <p>Please make sure to be available at the scheduled time. You can check your dashboard for any updates or changes.</p>
    <div class="button-container">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/applicant/applications" class="button">View Dashboard</a>
    </div>
    <p>Best of luck!</p>
    <p>Best regards,<br>${company} Hiring Team</p>
  `;
  const html = getEmailWrapper(subject, content);
  return sendEmail({ to: email, subject, html });
}

/**
 * Send round advance email — applicant passed a round and is moving to the next.
 */
export async function sendRoundAdvanceEmail(
  name: string,
  email: string,
  jobTitle: string,
  company: string,
  passedRoundName: string,
  passedRoundNumber: number,
  nextRoundName: string | null
) {
  const subject = `🎉 Congratulations! You passed ${passedRoundName} for ${jobTitle} at ${company}`;
  const content = `
    <span class="badge badge-shortlisted">Round Cleared</span>
    <p>Dear ${name},</p>
    <p>Great news! You have successfully cleared <strong>${passedRoundName} (Round ${passedRoundNumber})</strong> for the <strong>${jobTitle}</strong> position at <strong>${company}</strong>.</p>
    ${nextRoundName ? `
    <p>You are now advancing to the next stage: <strong>${nextRoundName}</strong>. Our team will reach out shortly with further details and scheduling.</p>
    ` : `
    <p>Our team will be in touch shortly regarding the next steps.</p>
    `}
    <div class="button-container">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/applicant/applications" class="button">Track Progress</a>
    </div>
    <p>Best regards,<br>${company} Hiring Team</p>
  `;
  const html = getEmailWrapper(subject, content);
  return sendEmail({ to: email, subject, html });
}

/**
 * Send round rejection email — applicant did not pass a particular round.
 */
export async function sendRoundRejectionEmail(
  name: string,
  email: string,
  jobTitle: string,
  company: string,
  roundName: string,
  roundNumber: number
) {
  const subject = `Application Update: ${jobTitle} at ${company}`;
  const content = `
    <span class="badge badge-rejected">Round Update</span>
    <p>Dear ${name},</p>
    <p>Thank you for your participation in the interview process for the <strong>${jobTitle}</strong> position at <strong>${company}</strong>.</p>
    <p>After careful evaluation of <strong>${roundName} (Round ${roundNumber})</strong>, we regret to inform you that we will not be advancing your application further at this time.</p>
    <p>We appreciate the time and effort you invested. We encourage you to explore other opportunities on our platform that may be a great fit for your skills.</p>
    <div class="button-container">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/applicant/applications" class="button">View Dashboard</a>
    </div>
    <p>Best regards,<br>${company} Hiring Team</p>
  `;
  const html = getEmailWrapper(subject, content);
  return sendEmail({ to: email, subject, html });
}

/**
 * Send final offer email — applicant passed all rounds.
 */
export async function sendFinalOfferEmail(
  name: string,
  email: string,
  jobTitle: string,
  company: string,
  totalRounds: number,
  jobDetails?: {
    salaryMin?: number | null;
    salaryMax?: number | null;
    salaryCurrency?: string | null;
    employmentType?: string;
    location?: string;
    locationType?: string;
    startDate?: string | null;
  }
) {
  const subject = `🏆 Offer Letter: Congratulations on the ${jobTitle} position at ${company}!`;
  const content = `
    <span class="badge badge-hired">Offer Letter</span>
    <p>Dear ${name},</p>
    <p>We are absolutely thrilled to extend you an offer for the position of <strong>${jobTitle}</strong> at <strong>${company}</strong>!</p>
    <div style="background: linear-gradient(135deg, #fae8ff, #e0e7ff); border: 1px solid #c084fc; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
      <div style="font-size: 32px; margin-bottom: 8px;">🎉🏆🎊</div>
      <div style="font-size: 20px; font-weight: 800; color: #6d28d9;">
        You cleared all ${totalRounds} interview rounds!
      </div>
      <div style="font-size: 13px; color: #7c3aed; margin-top: 8px;">📄 Your formal offer letter is attached to this email</div>
    </div>
    <p>Your talent, skills, and performance throughout the interview process truly stood out. We are confident you will be a fantastic addition to our team.</p>
    <p>Please review the attached offer letter carefully. Our onboarding team will be reaching out shortly with contract details and next steps for your onboarding process.</p>
    <div class="button-container">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/applicant/applications" class="button">View Dashboard</a>
    </div>
    <p>Welcome aboard! 🎉</p>
    <p>Best regards,<br>${company} Hiring Team</p>
  `;
  const html = getEmailWrapper(subject, content);

  // Generate PDF offer letter attachment
  let attachments: { filename: string; content: Buffer; contentType: string }[] | undefined;
  try {
    const offerPdf = await generateOfferLetterPDF({
      candidateName: name,
      jobTitle,
      company,
      totalRoundsCleared: totalRounds,
      salaryMin: jobDetails?.salaryMin,
      salaryMax: jobDetails?.salaryMax,
      salaryCurrency: jobDetails?.salaryCurrency,
      employmentType: jobDetails?.employmentType,
      location: jobDetails?.location,
      locationType: jobDetails?.locationType,
      startDate: jobDetails?.startDate || undefined,
    });
    attachments = [{
      filename: `Offer_Letter_${name.replace(/\s+/g, '_')}_${jobTitle.replace(/\s+/g, '_')}.pdf`,
      content: offerPdf,
      contentType: 'application/pdf',
    }];
  } catch (err) {
    console.error('Failed to generate offer letter PDF:', err);
  }

  return sendEmail({ to: email, subject, html, attachments });
}
