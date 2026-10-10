# Jai Janardan Auto

This project uses a React + TypeScript front end with a MongoDB-backed admin inventory API.

## Development seed data

To insert sample vehicles into MongoDB for local testing, set `MONGO_URI` in your backend environment and run:

```bash
npm run seed:vehicles
```

The seed script creates a batch of realistic commercial-vehicle listings and marks a subset as best sellers for the public home page.

## Local front-end and API

```bash
npm install
npm run dev
```

Then run the backend server separately from the `backend` folder if needed.

## Sell Your Vehicle review workflow

Owners can submit vehicles at `/sell-your-vehicle`. Submissions are saved as
private sell requests and are not public inventory until an Admin lists them
from **Admin → Sell Requests**. Requests can be approved for later manual
listing, published directly, or rejected. Published vehicles use the existing
Vehicle collection and public inventory APIs.

Copy `backend/.env.example` to `backend/.env` and configure the backend-only
variables before starting the API. On first startup, if `ADMIN_EMAIL` and
`ADMIN_PASSWORD` are set and that email does not already exist, the backend
creates one bcrypt-hashed admin account in MongoDB. It does not replace or
reset an existing account password. Set `ADMIN_NAME` for the display name
shown in the admin panel; when omitted for the initial account, the email
prefix is used as its initial name.

Generate a signing secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

`ADMIN_SESSION_SECRET` must contain at least 32 characters. Admin login uses
an HTTP-only signed session cookie (never browser local storage); Remember Me
sets a 30-day cookie, while an unremembered login uses a browser-session
cookie. Authenticated sessions are checked against the MongoDB admin record
and are invalidated by password reset. Logout clears the browser's
HTTP-only session cookie. All inventory and brand write endpoints and Sell
Requests administration require an authorized session. Public visitors retain
access to public inventory and sell-request submission endpoints.

Passwords use salted bcrypt hashes with a SHA-256 pre-hash so bcrypt's
72-byte input limit does not silently truncate long passwords.

Password reset requires `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`,
`MAIL_FROM`, and `FRONTEND_URL`. Reset tokens are single-use, stored hashed,
and expire after 15 minutes. The API verifies the SMTP connection before
processing a request; missing local settings are reported with their variable
names, while production responses do not disclose mail configuration details.

For Gmail, enable 2-Step Verification and create a Google App Password. Put
that App Password (not the ordinary Gmail account password) in `SMTP_PASS`.
Use `SMTP_HOST=smtp.gmail.com` and either port `465` for implicit TLS or port
`587` for STARTTLS. Set `SMTP_USER` to the Gmail account and `MAIL_FROM` to an
matching sender, for example `"Jai Janardan Auto <your-email@gmail.com>"`;
the backend checks that the sender address matches `SMTP_USER`. Reset messages
are sent only to the registered admin email in MongoDB. A successful SMTP
submission cannot guarantee inbox delivery if that recipient's domain or
mailbox is not deliverable; configure its mail DNS or update that existing
admin record manually to a verified address before requesting another reset.
Never commit `backend/.env` or share the App Password.

Set `FRONTEND_URL` to the origin serving the reset page. Local CORS allows
`http://localhost:5173` and `http://localhost:5174`; set `FRONTEND_URL` to the
one actually used so reset links open at the right origin. In production use
the deployed HTTPS origin and HTTPS termination, and set
`NODE_ENV=production`; cookie access is restricted to that configured origin.
The frontend defaults to `http://localhost:5000/api`; set
`VITE_API_BASE_URL` when the API is hosted elsewhere.

Start the frontend from the repository root with `npm run dev` and the API
from `backend` with `npm run dev` (or `npm start` for a non-watching process).

The `AdminUser` collection adds a unique index on `email` and a sparse unique
index on `resetTokenHash`; Mongoose manages these indexes from the model. If
production disables automatic index creation, apply these once in MongoDB
after confirming there are no duplicate values:

```javascript
db.adminusers.createIndex({ email: 1 }, { unique: true });
db.adminusers.createIndex(
  { resetTokenHash: 1 },
  { unique: true, sparse: true }
);
```

## Vehicle categories and brands

The backend creates the two active categories and their default brands when MongoDB connects:

- Commercial Vehicles (`commercial`): Tata, Mahindra, Ashok Leyland, Eicher
- Cars (`cars`): Toyota, Tata, Maruti Suzuki, Hyundai

Categories and brands are stored in MongoDB. The Admin **Categories** page manages brands; active brands are loaded dynamically by Add Vehicle and the public vehicle filters. A brand is unique within its category, so Tata can be present in both.

Category and brand APIs:

- `GET /api/categories`
- `GET /api/brands?category=commercial`
- `GET /api/brands?category=cars`
- `POST /api/brands`
- `PATCH /api/brands/:id`
- `DELETE /api/brands/:id`

New vehicle records store `category` and `categoryType` as `commercial` or `cars`. Existing records are preserved; legacy vehicle subtype values are classified only when their category is unambiguous.
