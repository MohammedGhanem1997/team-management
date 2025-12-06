const { Client } = require('pg')
const cn = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5434/football_teams'
const client = new Client({ connectionString: cn })
async function main() {
  await client.connect()
  const res = await client.query(
    "SELECT column_name FROM information_schema.columns WHERE table_name='players' ORDER BY column_name;"
  )
  console.log(res.rows.map(r => r.column_name))
  await client.end()
}
main().catch(e => { console.error(e); process.exit(1) })

