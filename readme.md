# Football Online Manager System

A microservices-based football fantasy manager system built with NestJS and RabbitMQ.

## Architecture Overview

The system consists of 3 microservices:
- **API Gateway**: Handles HTTP requests and routing
- **Auth Service**: Manages user authentication and registration
- **Team Service**: Handles team creation, player management, and transfers

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- PostgreSQL
- RabbitMQ

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
git clone <your-repo-url>
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
- `config/dev/.env` (defaults for local dev)
- `config/prod/.env` (production overrides)

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

### 6. Start the Services

Open 3 terminal windows:

```bash
# Terminal 1 - Auth Service
cd auth-service
npm run start:dev

# Terminal 2 - Team Service
cd team-service
npm run start:dev

# Terminal 3 - API Gateway
cd api-gateway
npm run start:dev
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

## License

MIT

## Contact

For questions or issues, please open a GitHub issue.
API Gateway enforces authentication via a JWT guard for protected endpoints (teams and transfers). Ensure `Authorization: Bearer <token>` is set.
### Player Improvements (v1)

Path: `/api/v1/players/improve`

- Method: `POST`
- Security: `Authorization: Bearer <token>` (JWT)
- Rate limiting: 20 requests per 60 seconds per user (subject to global throttler)

Request body:
```json
{
  "player_id": "a4f8c6b1-1c2d-4e5f-9a8b-1234567890ab",
  "improvement_type": "pace",
  "value": 3
}
```

Response 200:
```json
{
  "success": true,
  "updated_player_data": {
    "id": "a4f8c6b1-1c2d-4e5f-9a8b-1234567890ab",
    "first_name": "Alex",
    "last_name": "Smith",
    "position": "MID",
    "age": 24,
    "overall_rating": 78,
    "pace": 83,
    "shooting": 70,
    "passing": 75,
    "dribbling": 80,
    "defending": 60,
    "physical": 72,
    "market_value": "7800000.00",
    "teamId": "c5e1d9f2-7b34-4f8a-b2a1-abcdef123456"
  }
}
```

Error responses:
- 400: Invalid parameters (skill must be one of pace/shooting/passing/dribbling/defending/physical; value 1-10)
- 404: Player not found or not owned by requesting user
- 500: Internal server error

Example curl:
```bash
curl -X POST http://localhost:3000/api/v1/players/improve \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "player_id": "a4f8c6b1-1c2d-4e5f-9a8b-1234567890ab",
    "improvement_type": "pace",
    "value": 3
  }'
```

OpenAPI/Swagger: navigate to `http://localhost:3000/api` and find the Players section; endpoint is documented with request/response schemas and examples.
