# Football Online Manager System

A microservices-based football fantasy manager system built with NestJS and RabbitMQ.

## Architecture Overview

The system consists of 3 microservices:
- **API Gateway**: Handles HTTP requests and routing
- **Auth Service**: Manages user authentication and registration
- **Team Service**: Handles team creation, player management, and transfers

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose (optional, for containerized run)
- PostgreSQL
- RabbitMQ
- Redis
- ELK Stack (Elasticsearch + Kibana) and Elastic APM Server (optional but recommended)

## Project Structure

```
football-manager/
├── api-gateway/          # HTTP API Gateway
├── auth-service/         # Authentication microservice
├── team-service/         # Team management microservice
├── shared/               # Shared types and utilities
├── docker-compose.yml    # Docker setup
└── README.md
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/MohammedGhanem1997/team-management.git
cd football-manager
```

### 2. Install Dependencies

```bash
# Install dependencies for each service
cd api-gateway && npm install && cd ..
cd auth-service && npm install && cd ..
cd team-service && npm install && cd ..
```

### 3. Environment Configuration
Create a root `.env` at project root and use Docker Compose `env_file` to load variables. Example:

```env
API_GATEWAY_PORT=3000
AUTH_SERVICE_HOST=auth-service
AUTH_SERVICE_PORT=3001
TEAM_SERVICE_HOST=team-service
TEAM_SERVICE_PORT=3002
RABBITMQ_URL=amqp://rabbitmq:5672
JWT_SECRET=your-secret-key-change-in-production
AUTH_DATABASE_URL=postgresql://postgres:password@auth-postgres:5432/football_auth
TEAM_DATABASE_URL=postgresql://postgres:password@team-postgres:5432/football_teams
```

Development and production configs live under `config/`:
- `config/dev/` (defaults for local dev)
- `config/prod/` (production overrides)

Services load envs via Nest Config with `envFilePath` set based on `NODE_ENV`. Missing critical configs (e.g., `JWT_SECRET`) will abort requests with proper errors.

### 4. Start Infrastructure with Docker

```bash
docker-compose up -d
```

This will build service images, load envs from `.env`, run database migrations automatically on service start, and seed clubs/players in team-service.

This will start:
- PostgreSQL (ports 5432)
- RabbitMQ (ports 5672, 15672 for management UI)

### 5. Run Database Migrations

```bash
# Auth service
cd auth-service
npm run migration:run

# Team service
cd ../team-service
npm run migration:run
```


The API Gateway will be available at `http://localhost:3000`

## API Endpoints

### Authentication

**POST /auth/register**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**POST /auth/login**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

Response:
```json
{
  "access_token": "jwt-token",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

### Team Management

**GET /teams/my-team**
Headers: `Authorization: Bearer <token>`

Response:
```json
{
  "id": "uuid",
  "name": "Team Name",
  "budget": 5000000,
  "players": [...]
}
```

### Transfer Market

**GET /transfers**
Query params: `teamName`, `playerName`, `minPrice`, `maxPrice`

**POST /transfers/list-player**
```json
{
  "playerId": "uuid",
  "askingPrice": 1500000
}
```

**POST /transfers/remove-player**
```json
{
  "playerId": "uuid"
}
```

**POST /transfers/buy-player**
```json
{
  "playerId": "uuid"
}
```

### Player Improvements

- `POST /api/v1/players/improve`
  - Body:
    ```json
    {
      "player_id": "uuid",
      "improvement_type": "pace",
      "value": 3
    }
    ```
  - Security: `Authorization: Bearer <token>`
  - Rate limiting: `20 req / 60s`
  - Response:
    ```json
    {
      "success": true,
      "updated_player_data": { ...player fields... }
    }
    ```

- `POST /players/:playerId/skills`
  - Body:
    ```json
    {
      "skill": "pace",
      "amount": 3
    }
    ```
  - Security: `Authorization: Bearer <token>`
  - Rate limiting: `20 req / 60s`

## Endpoint Catalog

Below is a quick catalog of available HTTP endpoints via the API Gateway:

- Authentication
  - `POST /auth/register` — Register user
  - `POST /auth/login` — Login and get JWT
- Team Management
  - `GET /teams/my-team` — Get current user's team (JWT required)
- Transfer Market
  - `GET /transfers` — List transfer market, filters supported
  - `POST /transfers/list-player` — List a player (JWT required)
  - `POST /transfers/remove-player` — Remove a player from listing (JWT required)
  - `POST /transfers/buy-player` — Buy a listed player (JWT required)
- Player Improvements
  - `POST /api/v1/players/improve` — Improve player skill by type/value (JWT required)
  - `POST /players/:playerId/skills` — Improve a specific player's skill (JWT required)

## Swagger / OpenAPI

The API Gateway exposes Swagger docs.

- Start the API Gateway (Docker or local):
  - Docker: `docker compose up -d api-gateway`
  - Local: `cd api-gateway && npm run start:dev`
- Open Swagger UI:
  - `http://localhost:3000/api`
- Authentication in Swagger:
  - Click `Authorize`, paste `Bearer <token>` from `/auth/login` or `/auth/register` response.
- Explore endpoints under sections: Authentication, Team Management, Transfer Market, Players.
- Models for player improvement:
  - Request: `ImprovePlayerSkillRequestDto`
  - Response: `ImprovePlayerSkillResponseDto`
  - Player: `PlayerDto`

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Gateway Integration & Performance
- Integration tests cover rate limiting, auth flows, and downstream mapping under `api-gateway/tests/integration` and `api-gateway/tests/e2e`
- Performance tests using `autocannon` provide latency percentiles and throughput under `api-gateway/tests/perf`
- Rate limiter: IP-based defaults (100 req/min), API-key tiering, sliding window (ms), per-endpoint limits, Redis-backed; headers `X-RateLimit-*` and 429 payload.

## Time Report

| Section | Time Spent |
|---------|-----------|
| Project setup & architecture design | 2 hours |
| Auth microservice implementation | 3 hours |
| Team microservice implementation | 4 hours |
| API Gateway setup | 2 hours |
| RabbitMQ integration | 2 hours |
| Database schema & migrations | 1.5 hours |
| Transfer market logic | 3 hours |
| Testing & debugging | 2.5 hours |
| Documentation | 1 hour |
| **Total** | **21 hours** |

## Design Decisions

### Why Microservices?
- **Scalability**: Team creation can be resource-intensive, so having it as a separate service allows independent scaling
- **Separation of Concerns**: Auth and team management are logically separate domains
- **Fault Isolation**: If team service is under heavy load during team creation, auth remains responsive

### Why RabbitMQ?
- **Async Processing**: Team creation (20 players) is handled asynchronously
- **Reliability**: Message persistence ensures team creation requests aren't lost
- **Decoupling**: Services communicate without direct dependencies

### Database Design
- Separate databases per service (microservice best practice)
- PostgreSQL for ACID compliance in financial transactions (transfers)
- Proper indexing on commonly queried fields

## Key Features

✅ Single flow registration/login (returns token for both new and existing users)
✅ Async team creation via RabbitMQ
✅ Initial budget of $5,000,000
✅ 20 players with correct position distribution
✅ Transfer market with filtering
✅ List/remove players from transfer market
✅ Buy players at 95% of asking price
✅ Team size validation (15-25 players)
✅ Budget validation for transfers

## Future Enhancements

- WebSocket notifications for team creation completion
- Player value fluctuation based on performance
- Leaderboards and team rankings
- Match simulation
- Real-time transfer market updates

## Troubleshooting

**RabbitMQ Connection Failed**
```bash
docker-compose restart rabbitmq
```

**Database Connection Issues**
```bash
# Check if PostgreSQL is running
docker-compose ps
# Reset databases
docker-compose down -v
docker-compose up -d
```

**Missing or invalid configuration**
Ensure `.env` exists at project root and contains `JWT_SECRET`, `AUTH_DATABASE_URL`, `TEAM_DATABASE_URL`, and `RABBITMQ_URL`. For local dev outside Docker, use `config/dev/.env` or set environment variables in your shell.

**Observability & Security**
- Elastic APM enabled via `APM_SERVER_URL`; EFK stack included in docker-compose with Elasticsearch, Kibana, and APM Server
- Security headers via Helmet (HSTS enabled, CSP disabled for Swagger)

**Port Already in Use**
```bash
# Change ports in .env files or kill the process
lsof -ti:3000 | xargs kill -9
```

---

## Running Without Docker (Local Services)

You can run everything locally without Docker by installing and starting the infrastructure services on your machine, setting local environment variables, running migrations, and starting each Nest service.

### 1. Install and Start Infrastructure

- PostgreSQL (default port `5432`)
  - Create two databases: `football_auth`, `football_teams`
  - Example (psql):
    ```sql
    CREATE DATABASE football_auth;
    CREATE DATABASE football_teams;
    ```
- RabbitMQ (default port `5672`)
- Redis (default port `6379`)
- Elasticsearch (7.17.x) and Kibana (optional)
- Elastic APM Server (optional)

Ensure all services are running and reachable on localhost.

### 2. Configure Environment Variables (Local)

Create a `.env` file at project root (or use `config/dev/.env`) with localhost values:

```env
# API Gateway
API_GATEWAY_PORT=3000
RABBITMQ_URL=amqp://localhost:5672
REDIS_URL=redis://localhost:6379

# Auth service (TCP microservice for API Gateway; Nest HTTP port 3001 if needed)
AUTH_SERVICE_HOST=localhost
AUTH_TCP_PORT=3003
AUTH_DATABASE_URL=postgresql://postgres:password@localhost:5432/football_auth
JWT_SECRET=your-secret-key-change-in-production

# Team service (RMQ microservice)
TEAM_SERVICE_HOST=localhost
TEAM_SERVICE_PORT=3002
TEAM_DATABASE_URL=postgresql://postgres:password@localhost:5432/football_teams

# Optional Observability
APM_SERVER_URL=http://localhost:8200
```

Alternatively, you can place a service-specific `.env` inside each service folder with the subset it needs:

- `auth-service/.env`
  ```env
  DATABASE_URL=postgresql://postgres:password@localhost:5432/football_auth
  RABBITMQ_URL=amqp://localhost:5672
  JWT_SECRET=your-secret-key-change-in-production
  AUTH_TCP_PORT=3003
  ```
- `team-service/.env`
  ```env
  DATABASE_URL=postgresql://postgres:password@localhost:5432/football_teams
  RABBITMQ_URL=amqp://localhost:5672
  PORT=3002
  ```
- `api-gateway/.env`
  ```env
  PORT=3000
  AUTH_SERVICE_HOST=localhost
  AUTH_TCP_PORT=3003
  TEAM_SERVICE_HOST=localhost
  TEAM_SERVICE_PORT=3002
  RABBITMQ_URL=amqp://localhost:5672
  REDIS_URL=redis://localhost:6379
  APM_SERVER_URL=http://localhost:8200
  ```

### 3. Install Dependencies

```bash
cd api-gateway && npm install && cd ..
cd auth-service && npm install && cd ..
cd team-service && npm install && cd ..
```

### 4. Run Database Migrations (Local)

```bash
# Auth service
cd auth-service
npm run build
npm run migration:run

# Team service
cd ../team-service
npm run build
npm run migration:run
```

### 5. Start Services (Local)

Open three terminals:

```bash
# Terminal 1 - Auth Service (TCP microservice + JWT)
cd auth-service
npm run start:dev

# Terminal 2 - Team Service (RMQ microservice)
cd team-service
npm run start:dev

# Terminal 3 - API Gateway (HTTP)
cd api-gateway
npm run start:dev
```

API Gateway will be available at `http://localhost:3000`. Swagger docs: `http://localhost:3000/api`.

### 6. Verify Messaging and Endpoints

- Register/login via Gateway auth endpoints to obtain a JWT.
- Team creation is emitted by Auth to Team via RabbitMQ and processed asynchronously.
- Player improvement endpoint (Gateway):
  - `POST /api/v1/players/improve`
  - Body:
    ```json
    {
      "player_id": "uuid",
      "improvement_type": "pace",
      "value": 3
    }
    ```
  - Requires `Authorization: Bearer <token>` header.

### 7. Optional Observability

- Elastic APM Server: set `APM_SERVER_URL=http://localhost:8200` (Gateway has APM instrumentation)
- Elasticsearch & Kibana: start locally and configure indices as needed

### 8. Troubleshooting (Local)

- Ensure ports are not in use (3000, 3001, 3002, 3003, 5432, 5672, 6379, 9200/5601/8200)
- Confirm environment variables loaded in each service
- Run `npm run build` before migrations

