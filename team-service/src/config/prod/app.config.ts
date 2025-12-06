export default () => ({
  port: Number(process.env.TEAM_SERVICE_PORT || 3002),
  databaseUrl: process.env.DATABASE_URL,
  rmqUrl: process.env.RABBITMQ_URL,
  initialBudget: Number(process.env.INITIAL_BUDGET || 5000000),
  positionCounts: (() => {
    try {
      return process.env.POSITION_COUNTS
        ? JSON.parse(process.env.POSITION_COUNTS)
        : { GK: 3, DEF: 6, MID: 6, ATT: 5 };
    } catch (e) {
      return { GK: 3, DEF: 6, MID: 6, ATT: 5 };
    }
  })(),
  transferDiscount: Number(process.env.TRANSFER_DISCOUNT || 0.95),
})
