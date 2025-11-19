const { connectDB, sql } = require("../config/db"); // 👈 Mismo import que departamentos

async function listarCausas(req, res) {
  try {
    const { departamento, provincia, distrito } = req.query;

    console.log("📌 Filtros recibidos:", req.query);

    const pool = await connectDB();

    
    //  Construir filtro UBIGEO
    
    let whereUbigeo = "";
    let valorUbigeo = null;

    if (distrito && distrito !== "Todos") {
      whereUbigeo = "AND LEFT(UBIGEO, 6) = @ubigeo";
      valorUbigeo = distrito;
    } else if (provincia && provincia !== "Todos") {
      whereUbigeo = "AND LEFT(UBIGEO, 4) = @ubigeo";
      valorUbigeo = provincia;
    } else if (departamento && departamento !== "Todos") {
      whereUbigeo = "AND LEFT(UBIGEO, 2) = @ubigeo";
      valorUbigeo = departamento;
    }

    
    //  Query dinámico
    
    const query = `
      SELECT DISTINCT causas
      FROM CasosDengue 
      WHERE causas IS NOT NULL 
        AND causas != 'null'
        AND causas != ''
        ${whereUbigeo}
      ORDER BY causas ASC
    `;

    console.log("📋 Query ejecutada:", query);

    const request = pool.request();

    if (valorUbigeo) {
      request.input("ubigeo", sql.VarChar, valorUbigeo);
    }

    const result = await request.query(query);

    console.log(`📊 Causas encontradas: ${result.recordset.length}`);

    res.json(result.recordset);

  } catch (err) {
    console.error("❌ Error al obtener causas:", err);
    res.status(500).json({
      error: "Error al obtener causas",
      detalle: err.message,
    });
  }
}


// Endpoint para obtener estadísticas de casos por causa 
async function getEstadisticasCausas(req, res) {
  const {
    departamento,
    provincia,
    distrito,
    fechaInicio = "2025-01-01",
    fechaFin = "2025-12-31"
  } = req.query;

  try {
    const pool = await connectDB();

    let whereUbigeo = "";
    let valorUbigeo = null;

    if (distrito && distrito !== "Todos") {
      valorUbigeo = distrito;
      whereUbigeo = "AND LEFT(UBIGEO, 6) = @ubigeo";
    } else if (provincia && provincia !== "Todos") {
      valorUbigeo = provincia;
      whereUbigeo = "AND LEFT(UBIGEO, 4) = @ubigeo";
    } else if (departamento && departamento !== "Todos") {
      valorUbigeo = departamento;
      whereUbigeo = "AND LEFT(UBIGEO, 2) = @ubigeo";
    }

    const query = `
      SELECT 
        causas,
        COUNT(*) as total,
        AVG(edad) as edad_promedio,
        COUNT(CASE WHEN sexo = 'Masculino' THEN 1 END) as hombres,
        COUNT(CASE WHEN sexo = 'Femenino' THEN 1 END) as mujeres
      FROM CasosDengue
      WHERE 
        FECHA_NOT BETWEEN @fechaInicio AND @fechaFin
        ${whereUbigeo}
        AND causas IS NOT NULL
        AND causas != 'null'
        AND causas != ''
        AND LATITUD IS NOT NULL
        AND LONGITUD IS NOT NULL
      GROUP BY causas
      ORDER BY total DESC
    `;

    const request = pool.request()
      .input("fechaInicio", sql.Date, fechaInicio)
      .input("fechaFin", sql.Date, fechaFin)
      .input("ubigeo", sql.VarChar, valorUbigeo);

    const result = await request.query(query);
    
    console.log(`📊 Estadísticas por causas: ${result.recordset.length} tipos encontrados`);
    res.json(result.recordset);

  } catch (err) {
    console.error("❌ Error al obtener estadísticas:", err);
    res.status(500).json({ error: "Error al obtener estadísticas" });
  }
}

module.exports = { listarCausas, getEstadisticasCausas};