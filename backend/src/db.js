require('dotenv').config()
const { Pool, Client } = require('pg')
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
})

pool.on('connect', (err, client) => {
	console.log(`Connecting to DB "${process.env.PG_DATABASE}"`)
})
  
pool.on('error', (err, client) => {
	console.log(`Connection failed ${err}`)
})
  
module.exports = pool