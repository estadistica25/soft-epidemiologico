const express = require('express');
const router = express.Router();
const { listarCausas, getEstadisticasCausas} = require('../controllers/causasController');


router.get('/', listarCausas);
router.get('/estadisticas', getEstadisticasCausas); 

module.exports = router;