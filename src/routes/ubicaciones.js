const express = require("express");
const { listarCasos } = require("../controllers/casosController");
const { getDepartamentos } = require("../controllers/departamentosController");
const { getProvincias } = require("../controllers/provinciasController");
const { getDistritos } = require("../controllers/distritosController");

const router = express.Router();


router.get("/casos", listarCasos);


router.get("/departamentos", getDepartamentos);
router.get("/provincias", getProvincias);
router.get("/distritos", getDistritos);

module.exports = router;
