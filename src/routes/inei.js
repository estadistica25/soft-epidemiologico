const express = require("express");
const fetch = require("node-fetch");
const simplify = require("simplify-geojson");
const https = require("https");

const router = express.Router();
const cache = {};

const agent = new https.Agent({
  rejectUnauthorized: false,
});


router.get("/distritos", async (req, res) => {
  const { distrito } = req.query;

  if (!distrito) {
    return res.status(400).json({ error: "Falta el parámetro distrito" });
  }

  try {
    
    if (cache[distrito]) {
      console.log(`♻️ Enviando distrito ${distrito} desde caché`);
      return res.json(cache[distrito]);
    }

    
    const url = `https://geoespacial.inei.gob.pe/geoserver/Interoperabilidad/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Interoperabilidad:ig_distrito&CQL_FILTER=ubigeo='${distrito}'&outputFormat=application/json`;

    console.log("🌎 Descargando polígono del INEI:", distrito);
    console.log("🔗 URL:", url);

    const response = await fetch(url, {
      method: "GET",
      agent,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; FrankApp/1.0)",
        Accept: "application/json",
      },
    });

    
    if (!response.ok) {
      console.warn(`⚠️ INEI devolvió error HTTP ${response.status}`);
      return res.status(502).json({
        error: `El servidor del INEI no respondió correctamente (HTTP ${response.status})`,
      });
    }

   
    let data;
    try {
      data = await response.json();
    } catch (parseErr) {
      console.error("❌ El INEI devolvió HTML en lugar de JSON");
      return res.status(500).json({
        error: "El servicio del INEI devolvió un formato no válido (HTML)",
      });
    }

    
    if (data.features.length === 0) {
      return res.status(404).json({
        error: `No se encontró el distrito con código ${distrito}`,
      });
    }

    const simplificado = simplify(data, 0.00005);
    cache[distrito] = simplificado;
    
    console.log(`✅ Polígono encontrado: ${data.features[0].properties.nombdist}`);
    res.json(simplificado);

  } catch (error) {
    console.error("❌ Error general al obtener distrito:", error.message);
    res.status(500).json({
      error: "Error interno del servidor al procesar el distrito",
    });
  }
});

module.exports = router;