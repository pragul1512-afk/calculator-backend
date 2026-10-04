# Calculator Backend

Node.js & Express REST API backend with PostgreSQL database integration for the Calculator application.

## API Endpoints

### `POST /api/calculate`
Performs arithmetic calculations (`+`, `-`, `*`, `/`) and saves the record in PostgreSQL.

### `GET /api/history`
Retrieves calculation history from PostgreSQL.

### `PUT /api/history/:id`
Updates a history record by ID.

### `DELETE /api/history/:id`
Deletes a history record by ID.

## Getting Started

### 1. Installation
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory (based on `.env.example`):
```env
PORT=3000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=calculator_db
DB_PASSWORD=your_password
DB_PORT=5432
```

### 3. Running the Server
```bash
npm start
```
The server will run on `http://localhost:3000`.
