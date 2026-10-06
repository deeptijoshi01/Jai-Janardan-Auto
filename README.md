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

Admin sign-in and Sell Requests administration require these backend-only
variables in `backend/.env`:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET` (at least 32 characters; generate a random value and
  never expose it in frontend code)

Generate a signing secret from the project root with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

After setting them, restart the backend. Admin credentials are checked by the
backend and the resulting short-lived signed session is required for every
Sell Requests administration endpoint. Public owners only have access to
creating a request.

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
