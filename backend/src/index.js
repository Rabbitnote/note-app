const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const db = require('./db.js')

const app = express()

app.use(cors())
app.use(bodyParser.json()) // ให้มันแปลง request body ที่เข้ามา (JSON) ให้อยู่ในรูป object

//Get Leaderboard List
app.get('/api/list', async (req,res)=>{
    const data = await db.query(`SELECT name,score FROM leaderboard ORDER BY score DESC`);
    res.send(data.rows);  
})

app.post('/api/add',async (req,res)=>{
    const name = req.body.name;
    const score = req.body.score;
    await db.query(`INSERT INTO leaderboard(name,score) VALUES ('${name}',${score})`);
    const data = await db.query(`SELECT * FROM leaderboard ORDER BY score DESC`);
    res.status(201).send(data.rows);
})
app.patch('/api/update',async (req,res)=>{
    const name = req.body.name;
    const score = req.body.score;
    await db.query(`UPDATE leaderboard SET score=${score} Where name='${name}'`)
    const data =await db.query('SELECT * FROM leaderboard Order by score desc')
    res.status(200).send(data.rows)
})
app.delete('/api/delete/:name', async (req,res) => {
    const name = req.params.name;
    console.log(name)
    await db.query(`DELETE FROM leaderboard WHERE name='${name}'`)
    const data =await db.query('SELECT * FROM leaderboard ORDER BY score DESC')
    res.status(200).send(data.rows)
})


// app.get('/api/test', async (req, res) => {
// 	const data = await db.query('SELECT current_timestamp')
//     res.send(data.fields)
// })
// app.get('/api/todos', async (req, res) => {
//     const todos = await db.query('SELECT * FROM todo ORDER BY id')
//     res.send(todos.rows)
// })
// app.post('/api/todo',async(req,res) => {
//     // รับค่า name จาก request body
//     const name = req.body.name
//     // สร้าง todo อันใหม่ใน db
//     await db.query(`INSERT INTO todo(name) VALUES ('${name}');`)
//     // query เอา todo ทั้งหมดออกมา
//     const todos = await db.query('SELECT * FROM todo ORDER BY id')
//     // ส่ง todos ที่เอามา กลับไปให้ user
//     res.status(201).send(todos.rows)
// })
// app.patch('/api/todo/:id', async (req,res) => {
//     const id = req.params.id
//     const name = req.body.name
//     await db.query(`UPDATE todo SET name= '${name}' WHERE id=${id};`)
//     const todos =await db.query('SELECT * FROM todo ORDER BY id')
//     res.status(200).send(todos.rows)
// })
// app.delete('/api/todo/:id', async (req,res) => {
//     const id =req.params.id
//     await db.query(`DELETE FROM todo WHERE id=${id};`)
//     const todos =await db.query('SELECT * FROM todo ORDER BY id')
//     res.status(200).send(todos.rows)
// })
app.listen(5000,()=>{
	console.log("start at port 5000");
})