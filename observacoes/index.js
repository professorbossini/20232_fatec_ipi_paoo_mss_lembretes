require('dotenv').config()
const express = require('express')
const axios = require('axios')
const { v4: uuidv4 } = require('uuid')

// const PORT = process.env.PORT
const { PORT } = process.env

const app = express()
app.use(express.json())

const observacoesPorLembreteId = {}

const funcoes = {
  ObservacaoClassificada: async (observacao) => {
    const observacoes = 
      observacoesPorLembreteId[observacao.lembreteId]
    const obsParaAtualizar = observacoes.find(o => o.id === observacao.id)
    obsParaAtualizar.status = observacao.status
    await axios.post(
      'http://localhost:10000/eventos', 
      {
        type: 'ObservacaoAtualizada',
        payload: {
          id: observacao.id,
          texto: observacao.texto,
          lembreteId: observacao.lembreteId,
          status: observacao.status
        }
      }
    )
  }
}

/*
{
  "1": [
    {"id": 100, "texto": "oi", "idLembrete": "1"},
    {"id": 101, "texto": "tchau", "idLembrete": "1"}
  ],
  "2": [
    {"id": 102, "texto": "sim", "idLembrete": "2"}
  ]
}

*/


//GET /lembretes/1/observacoes
app.get(
  '/lembretes/:id/observacoes',
  (req, res) => {
    res.send(observacoesPorLembreteId[req.params.id] || [])  
  }
)

//POST /eventos
app.post('/eventos', (req, res) => {
  try{
    const evento = req.body
    console.log(evento)
    funcoes[req.body.type](req.body.payload)
  }
  catch(e){}
  res.status(200).end()
})

//POST /lembretes/1/observacoes
app.post(
  '/lembretes/:id/observacoes',
  async function(req, res){
    const idObs = uuidv4()
    const { texto } = req.body 
    const idLembrete = req.params.id
    const observacoesDoLembrete = observacoesPorLembreteId[idLembrete] || []
    observacoesDoLembrete.push({id: idObs, texto: texto})
    observacoesPorLembreteId[idLembrete] = observacoesDoLembrete
    await axios.post('http://localhost:10000/eventos', {
      type: 'ObservacaoCriada',
      payload: {
        id: idObs,
        texto: texto,
        lembreteId: idLembrete,
        status: 'aguardando'
      }
    })
    res.status(201).send(observacoesDoLembrete)
  }
)

app.listen(
  PORT, 
  () => console.log(`Observações: ${PORT}`)
)
