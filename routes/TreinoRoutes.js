//chamando modulos e criando variavel para router

const express = require('express')
const router = express.Router()
const TreinoController = require('../controllers/TreinoController')

//helpers

const checkAuth = require('../helpers/auth').checkAuth

//criando rotas que chamam funçoes especificas de TreinoController

router.get('/add',checkAuth, TreinoController.createTreino)

router.post('/add',checkAuth, TreinoController.createTreinoSave) 

router.get('/edit/:id',checkAuth, TreinoController.updateTreino)

router.post('/edit',checkAuth, TreinoController.updateTreinoSave)

router.post('/delete',checkAuth,TreinoController.deleteTreino)

router.get('/details/:id',checkAuth,TreinoController.treinoDetails)

router.get('/', checkAuth, TreinoController.showTreino)

module.exports = router