const express = require("express");
const { listarCasos } = require("../controllers/casosController");
const { insertarCasosMasivos } = require("../controllers/casosController");
const router = express.Router();


router.get("/", listarCasos);
router.post("/insertar", insertarCasosMasivos);


module.exports = router;
