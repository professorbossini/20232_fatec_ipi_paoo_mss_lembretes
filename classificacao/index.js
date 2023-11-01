require('dotenv').config()
const express = require('express')
const axios = require ('axios')
const app = express()
app.use(express.json())

const { PORT } = process.env

const funcoes = {
  ObservacaoCriada: async (observacao) => {
    observacao.status = 
      observacao.texto.toLowerCase().includes('importante') ? 
      'importante':
      'comum'
    await axios.post(
      'http://localhost:10000/eventos',
      {
        type: 'ObservacaoClassificada',
        payload: observacao
      }
    )
  }
}

app.post('/eventos', async (req, res) => {
  // if (funcoes[req.body.type])
  //   funcoes[req.body.type](req.body.payload)
  try{
    funcoes[req.body.type](req.body.payload)
  } 
  catch(e){} 
  res.status(200).end()
})

app.listen(PORT, () => {
  console.log(`Classificação. Porta ${PORT}`)
})

