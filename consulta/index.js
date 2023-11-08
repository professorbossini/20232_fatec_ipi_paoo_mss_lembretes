require('dotenv').config()
const axios = require('axios')
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
  async () => {
    console.log(`Consulta: ${PORT}`)
    const eventos = await axios.get('http://localhost:10000/eventos')
    eventos.data.forEach((valor, indice, colecao) => {
      // try{
      //   undefined()
      // }
      // catch(e){}
      if(funcoes[valor.type]){
        funcoes[valor.type](valor.payload)
      }
    })
  }
)