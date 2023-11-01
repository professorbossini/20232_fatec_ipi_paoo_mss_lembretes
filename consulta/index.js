require('dotenv').config()
const express = require ('express')
const app = express()
app.use(express.json())

const { PORT } = process.env

const baseConsolidada = {}

const funcoes = {
  LembreteCriado: (lembrete) => {
    baseConsolidada[lembrete.id] = lembrete
  },
  ObservacaoCriada: (observacao) => {
    const observacoes = baseConsolidada[observacao.lembreteId]['observacoes'] || []
    observacoes.push(observacao)
    baseConsolidada[observacao.lembreteId]['observacoes'] = observacoes
  },
  ObservacaoAtualizada: (observacao) => {
    const observacoes = 
      baseConsolidada[observacao.lembreteId]['observacoes']
    const indice = observacoes.findIndex(o => o.id === observacao.id)
    observacoes[indice] = observacao
  }
}

//disponibilizar a base consolidada
//GET /lembretes
app.get('/lembretes', (req, res) => {
  res.json(baseConsolidada)
})

//receber eventos
//POST /eventos
app.post('/eventos', (req, res) => {
  try{
    //princípio aberto/fechado
    const evento = req.body
    funcoes[evento.type](evento.payload)
  }
  catch(e){}
  res.status(200).json(baseConsolidada)
})


app.listen(
  PORT,
  () => console.log(`Consulta: ${PORT}`)
)