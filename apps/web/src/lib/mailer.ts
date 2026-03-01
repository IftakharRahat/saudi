import nodemailer from 'nodemailer';

type ContactNotificationPayload = {
  name: string;
  phone: string;
  email: string;
  location: string;
  message: string;
  submittedAt: Date;
};

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

export async function sendContactNotification(payload: ContactNotificationPayload) {
  const adminEmail = process.env.CONTACT_NOTIFICATION_EMAIL ?? 'info@usedfurnituresaudi.com';
  const from = process.env.SMTP_FROM ?? 'Future Companies <no-reply@usedfurnituresaudi.com>';

  const transporter = getTransporter();

  if (!transporter) {
    console.warn(
      'Contact submission email was skipped because SMTP credentials are not fully configured.'
    );
    return false;
  }

  await transporter.sendMail({
    from,
    to: adminEmail,
    subject: `New contact form submission from ${payload.name}`,
    text: [
      `Name: ${payload.name}`,
      `Phone: ${payload.phone}`,
      `Email: ${payload.email}`,
      `Location: ${payload.location}`,
      `Submitted At: ${payload.submittedAt.toISOString()}`,
      '',
      'Message:',
      payload.message,
    ].join('\n'),
  });

  return true;
}
