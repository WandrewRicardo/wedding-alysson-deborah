const presenteController = require('../controllers/presentesController.js')
const express = require('express')
const router = express.Router()

router.get('/api/presentes', presenteController.listarPresentes)
router.post('/api/presentes', presenteController.reservarPresente)
router.put('/api/presentes', presenteController.atualizarPresente)

module.exports = router