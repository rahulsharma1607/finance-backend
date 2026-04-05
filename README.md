# Finance Data Processing and Access Control Backend

Simple Express backend for a finance dashboard assignment. The code is intentionally small, readable, and written with plain JavaScript and built-in Node features where possible.

## What this project includes

- User management with roles and active or inactive status
- Record management with create, read, update, delete, filtering, search, and pagination
- Dashboard summary API with totals, category totals, recent activity, and monthly trends
- Role-based access control enforced in backend middleware
- Input validation and clear error responses
- File-based JSON persistence so data survives server restarts

## Tech stack

- Node.js
- Express
- JSON file storage in `src/data`

## Installation

```bash
npm install
npm start
```

Server default: `http://localhost:5000`

## Mock authentication

This project uses a simple header-based mock auth system.

Send `x-user-id` in requests. Seeded users:

- Admin: `usr_admin_001`
- Analyst: `usr_analyst_001`
- Viewer: `usr_viewer_001`

## Roles

- `viewer`: can read records only
- `analyst`: can read records and access dashboard summary
- `admin`: full access to users and records

## Main routes

### Health

- `GET /`

### Users

- `GET /users`
- `GET /users/:id`
- `POST /users`
- `PATCH /users/:id`

Admin only.

Example create user body:

```json
{
  "name": "Priya Mehta",
  "email": "priya@example.com",
  "role": "analyst",
  "status": "active"
}
```

### Records

- `GET /records`
- `GET /records/:id`
- `POST /records`
- `PATCH /records/:id`
- `DELETE /records/:id`

Read access:

- Viewer
- Analyst
- Admin

Write access:

- Admin only

Example create record body:

```json
{
  "amount": 1200,
  "type": "income",
  "category": "consulting",
  "date": "2026-04-05",
  "note": "One-time client payment"
}
```

Supported record query params:

- `type`
- `category`
- `startDate`
- `endDate`
- `minAmount`
- `maxAmount`
- `search`
- `page`
- `limit`

Example:

```bash
GET /records?type=expense&category=rent&startDate=2026-04-01&page=1&limit=10
```

### Dashboard

- `GET /dashboard/summary`

Analyst and admin only.

Returns:

- total income
- total expenses
- net balance
- record count
- category-wise totals
- recent activity
- monthly trends

## Sample requests

Read records as viewer:

```bash
curl -H "x-user-id: usr_viewer_001" http://localhost:5000/records
```

Create record as admin:

```bash
curl -X POST http://localhost:5000/records ^
  -H "Content-Type: application/json" ^
  -H "x-user-id: usr_admin_001" ^
  -d "{\"amount\":1500,\"type\":\"income\",\"category\":\"sales\",\"date\":\"2026-04-05\",\"note\":\"Invoice payment\"}"
```

Get dashboard summary as analyst:

```bash
curl -H "x-user-id: usr_analyst_001" http://localhost:5000/dashboard/summary
```

## Design choices

- JSON files are used instead of a database to keep the solution simple while still providing persistence
- Mock auth keeps the focus on RBAC and business logic
- Controllers, models, middleware, and services are separated for clarity
- Validation is implemented manually to avoid unnecessary abstraction

## Assumptions

- Authentication can be mocked using a header
- Hard delete for records is acceptable for this assignment
- Only admins manage users
- Dates are provided in `YYYY-MM-DD` or another valid ISO-compatible format
