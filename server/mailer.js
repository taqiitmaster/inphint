import 'dotenv/config'
import nodemailer from 'nodemailer'

// Email is OPTIONAL. If SMTP_* env vars are not set, notifications are skipped
// silently and submissions are still saved to the database.
const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, NOTIFY_TO } = process.env

let transporter = null
if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })
}

export function mailerEnabled() {
  return Boolean(transporter && NOTIFY_TO)
}

// Fire-and-forget notification of a new enquiry. Never throws.
export async function notifyNewEnquiry(sub) {
  if (!mailerEnabled()) return
  const lines = [
    `Name:    ${sub.name}`,
    `Email:   ${sub.email}`,
    `Phone:   ${sub.phone || '—'}`,
    `Service: ${sub.service || '—'}`,
    `Budget:  ${sub.budget || '—'}`,
    '',
    'Message:',
    sub.message,
  ]
  try {
    await transporter.sendMail({
      from: SMTP_FROM || SMTP_USER,
      to: NOTIFY_TO,
      replyTo: sub.email,
      subject: `New enquiry from ${sub.name} — Inphint`,
      text: lines.join('\n'),
    })
  } catch (err) {
    console.error('[mailer] failed to send notification:', err.message)
  }
}
