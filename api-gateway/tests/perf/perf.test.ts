import autocannon from 'autocannon'

describe('Performance', () => {
  it('baseline /transfers throughput', async () => {
    const result = await autocannon({ url: 'http://localhost:3000/transfers', connections: 10, duration: 5 })
    expect(result.latency.p50).toBeDefined()
    expect(result.latency.p90).toBeDefined()
    expect(result.latency.p99).toBeDefined()
  })
})

