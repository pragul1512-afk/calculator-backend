# Calculator Backend

Node.js & Express REST API backend for the Calculator application.

## API Endpoints

### `POST /api/calculate`

Performs arithmetic calculations (`+`, `-`, `*`, `/`).

#### Request Body
```json
{
  "num1": 10,
  "num2": 5,
  "operator": "+"
}
```

#### Successful Response (`200 OK`)
```json
{
  "num1": 10,
  "num2": 5,
  "operator": "+",
  "result": 15
}
```

#### Error Response (`400 Bad Request`)
```json
{
  "error": "Cannot divide by zero"
}
```

## Getting Started

### Installation
```bash
npm install
```

### Running the Server
```bash
npm start
```
The server will run on `http://localhost:3000`.
