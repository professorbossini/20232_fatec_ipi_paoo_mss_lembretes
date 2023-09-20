require('dotenv').config()
//usamos para definir endpoints
//para receber requisições HTTP
const express = require('express')
//usamos para enviar requisições HTTP
const axios = require('axios')
const app = express();
//middleware
app.use(express.json())

/*
  {
    "1": {"id": "1", "texto": "Fazer café"},
    "2": {"id": "2", "texto": "Ver um filme"}
  }
*/
const lembretes = {}
let id = 1

//GET /lembretes
app.get('/lembretes', (req, res) => {
  res.send(lembretes)  
})

//POST /lembretes {texto: "Fazer cafe"}
app.post('/lembretes', (req, res) => {
  const texto = req.body.texto
  const lembrete = {id, texto}
  lembretes[id] = lembrete
  id++
  // HTTP 201 Created
  res.status(201).send(lembrete)
})

app.listen(
  process.env.PORT,
  () => console.log(`Lembretes: ${process.env.PORT}`)
)