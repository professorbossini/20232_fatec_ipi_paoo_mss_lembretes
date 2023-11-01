require('dotenv').config()
const express = require('express')
const axios = require('axios')
const app = express()
//aplicando um middleware
app.use(express.json())

//aqui recebemos todos os eventos
//e repassamos para todos os mss
app.post('/eventos', async (req, res) => {
  //aqui pegamos o evento
  const evento = req.body
  console.log(evento)
  await axios.post('http://localhost:4000/eventos', evento)
  await axios.post('http://localhost:5000/eventos', evento)
  await axios.post('http://localhost:6000/eventos', evento)
  await axios.post('http://localhost:7000/eventos', evento)
  res.status(200).end()
})

app.listen(
  process.env.PORT, 
  () => console.log(`Barramento: ${process.env.PORT}`)
)