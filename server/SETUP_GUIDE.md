# Contact Form Backend Setup

The backend is a single Express process. It serves the built React app and
handles one POST endpoint (`/api/contact`), which sends mail over SMTP.

There is no database and no analytics store.

## Installation

```bash
cd server
npm install
cp .env.example .env
```

Then fill in `.env`.

## SMTP configuration

| Variable | What it is |
| --- | --- |
| `MAIL_ENABLED` | `true` to actually send. Set `false` locally to test the form without sending mail. |
| `SMTP_HOST` | Your provider's SMTP hostname. |
| `SMTP_PORT` | `587` for STARTTLS (most common) or `465` for implicit TLS. |
| `SMTP_SECURE` | `false` for port 587, `true` for port 465. Getting this wrong is the most common cause of connection hangs. |
| `SMTP_USER` | SMTP login — usually the full mailbox address. |
| `SMTP_PASS` | SMTP password or app password. |
| `MAIL_FROM` | The address mail is sent from. Must be an address your SMTP account is authorised to send as. |
| `MAIL_FROM_NAME` | Display name on outgoing mail. |
| `RECIPIENT_EMAIL` | Where inquiries are delivered. |

### Common providers

**Gmail / Google Workspace** — requires 2FA and an App Password
(Google Account → Security → 2-Step Verification → App Passwords). Your normal
password will not work.

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
```

**Fastmail**

```env
SMTP_HOST=smtp.fastmail.com
SMTP_PORT=465
SMTP_SECURE=true
```

**Namecheap Private Email**

```env
SMTP_HOST=mail.privateemail.com
SMTP_PORT=465
SMTP_SECURE=true
```

**Migadu / Zoho / most other hosts** — check their docs for host and port, then
match `SMTP_SECURE` to the port using the rule above.

## Running

```bash
npm run dev    # nodemon, from server/
npm start      # production, from server/
```

On boot the server verifies the SMTP connection and logs either
`SMTP connection verified` or the failure reason. If you see a failure, mail
will not send — fix it before deploying.

## Deliverability

Mail sent from your own domain needs SPF and DKIM records or it will land in
spam. Your SMTP provider publishes the exact DNS records to add. This matters
more with plain SMTP than it did with Resend, which handled some of it for you.

## Rate limiting

`/api/contact` allows 5 submissions per IP per hour, held in memory. It resets
on restart, which is fine for a single-instance deploy. If you move to multiple
instances you'll want a shared store.

## Troubleshooting

- **Connection hangs or times out** — `SMTP_SECURE` almost certainly doesn't
  match `SMTP_PORT`. Use `true` only with port 465.
- **`Invalid login`** — for Gmail, you're using your account password instead of
  an App Password.
- **`Mail from address not allowed`** — `MAIL_FROM` isn't an address your SMTP
  account is authorised to send as.
- **Mail sends but never arrives** — check spam, then check SPF/DKIM.

## Security

- Never commit `server/.env`. It is gitignored.
- Keep `MAIL_FROM` on a domain you control.
