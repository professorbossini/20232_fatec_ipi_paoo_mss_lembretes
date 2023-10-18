require('dotenv').config()
const express = require('express')
const axios = require('axios')
const app = express()
//aplicando um middleware
app.use(express.json())

//aqui recebemos todos os eventos
//e repassamos para todos os mss
app.post('/eventos', (req, res) => {
  //aqui pegamos o evento
  const evento = req.body
  axios.post('http://localhost:4000/eventos', evento)
  axios.post('http://localhost:5000/eventos', evento)
})

app.listen(
  process.env.PORT, 
  () => console.log(`Barramento: ${process.env.PORT}`)
)