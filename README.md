# Finance Data Processing Backend

## Overview

This project is a backend system for managing financial records with role-based access control (RBAC). It supports CRUD operations, filtering, and dashboard-level analytics.

---

## Features

* User and Role Management (Viewer, Analyst, Admin)
* Financial Records CRUD (Create, Read, Delete)
* Record Filtering (type, category)
* Dashboard Summary APIs

  * Total Income
  * Total Expense
  * Net Balance
* Role-Based Access Control (RBAC)
* Input Validation and Error Handling
* In-memory Data Persistence

---

## Tech Stack

* Node.js
* Express.js

---

## API Endpoints

| Method | Endpoint         | Description                    | Access                 |
| ------ | ---------------- | ------------------------------ | ---------------------- |
| GET    | /records         | Get all records (with filters) | Viewer, Analyst, Admin |
| POST   | /records         | Create record                  | Admin                  |
| DELETE | /records/:id     | Delete record                  | Admin                  |
| GET    | /records/summary | Dashboard summary              | Analyst, Admin         |

---

## Roles & Permissions

* **Viewer** → Read-only access
* **Analyst** → Read + analytics
* **Admin** → Full access (CRUD + management)

---

## Setup Instructions

```bash
git clone https://github.com/rahulsharma1607/finance-backend.git
cd finance-backend
npm install
node index.js
```

Server runs at:
http://localhost:5000

---

## Example Requests

### Create Record

```json
POST /records
{
  "amount": 1000,
  "type": "income",
  "category": "salary"
}
```

---

### Get Summary

```
GET /records/summary
Header: role: analyst
```

---

## Design Decisions

* Used **in-memory storage** for simplicity and faster implementation
* Implemented **RBAC via middleware** for clean separation of concerns
* Structured project using **controllers, routes, models pattern**
* Focused on **clarity and maintainability over complexity**

---

## Limitations

* Data resets on server restart (no database)
* No authentication system (role passed via headers)

---

## Future Improvements

* Add database (MongoDB / PostgreSQL)
* Implement JWT authentication
* Add pagination and search
* Add unit and integration tests

---

## Author

Rahul Sharma
