export default () => ({
  port: Number(process.env.AUTH_SERVICE_PORT || 3001),
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/football_auth',
  rmqUrl: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-key',
})

