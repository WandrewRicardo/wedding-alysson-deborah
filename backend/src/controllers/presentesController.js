const presentesService = require('../services/presentesService.js')

async function listarPresentes(req, res) {
   const presentes = await presentesService.listarPresentes()
    return res.status(200).json(presentes)
}

async function reservarPresente (req, res) {
    const { numero_convite, presenteId} = req.body

    const presentesResponse = await presentesService.reservarPresente(numero_convite, presenteId)

    return res.status(presentesResponse.status).json(presentesResponse) 
}

async function atualizarPresente (req, res) {

    const {numero_convite, presenteId} = req.body

    const presentesResponse = await presentesService.atualizarPresente(numero_convite, presenteId)

    return res.status(presentesResponse.status).json(presentesResponse)
}


module.exports = {
    listarPresentes, reservarPresente, atualizarPresente
}