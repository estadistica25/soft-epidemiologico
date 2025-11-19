const { connectDB, sql } = require("../config/db");


// 📌 Controlador para listar casos 
async function listarCasos(req, res) {
  const {
    departamento,
    provincia,
    distrito,
    fechaInicio = "2025-01-01",
    fechaFin = "2025-12-31",
    causas,
    tipoDx,
  } = req.query;

  try {
    const pool = await connectDB();

   
    let whereUbigeo = "";
    let whereNombre = "";
    let valorUbigeo = null;
    let valorNombre = null;

    if (distrito && distrito !== "Todos") {
      if (/^\d+$/.test(distrito)) {
        valorUbigeo = distrito;
        whereUbigeo = "AND LEFT(UBIGEO, 6) = @ubigeo";
      } else {
        valorNombre = distrito.toUpperCase().trim();
        whereNombre = "AND UPPER(DISTRITO) = @distritoNombre";
      }
    } else if (provincia && provincia !== "Todos") {
      valorUbigeo = provincia;
      whereUbigeo = "AND LEFT(UBIGEO, 4) = @ubigeo";
    } else if (departamento && departamento !== "Todos") {
      valorUbigeo = departamento;
      whereUbigeo = "AND LEFT(UBIGEO, 2) = @ubigeo";
    }

    // 🔹 Filtro por causas
    let whereCausas = "";
    if (causas && causas !== "Todos") {
      whereCausas = "AND causas = @causas";
    }

    // 🔹 Filtro por tipo de diagnóstico
    let whereTipoDx = "";
    if (tipoDx && tipoDx !== "Todos") {
      whereTipoDx = "AND TIPO_DX = @tipoDx";
    }

    // 🔹 Consulta final
    const query = `
      SELECT 
        id AS idCaso,
        departamento,
        provincia,
        distrito,
        UBIGEO AS ubigeo,
        LATITUD AS latitud,
        LONGITUD AS longitud,
        SEXO AS sexo,
        EDAD AS edad,
        causas,
        TIPO_DX AS tipoDx,
        FECHA_NOT AS fechaNotificacion,
        FECHA_INI AS fechaInicio
      FROM CasosDengue
      WHERE 
        FECHA_NOT BETWEEN @fechaInicio AND @fechaFin
        ${whereUbigeo}
        ${whereNombre}
        ${whereCausas}
        ${whereTipoDx}
        AND LATITUD IS NOT NULL
        AND LONGITUD IS NOT NULL
        AND LATITUD <> 0
        AND LONGITUD <> 0
    `;

    const request = pool.request()
      .input("fechaInicio", sql.Date, fechaInicio)
      .input("fechaFin", sql.Date, fechaFin)
      .input("ubigeo", sql.VarChar, valorUbigeo)
      .input("distritoNombre", sql.NVarChar, valorNombre)
      .input("causas", sql.VarChar, causas)
      .input("tipoDx", sql.VarChar, tipoDx);

    const casosRes = await request.query(query);
    const casos = casosRes.recordset;

    if (casos.length === 0) {
      return res.json({
        totalCasos: 0,
        causas: causas || "Todas",
        tipoDx: tipoDx || "Todos",
        centroide: null,
        casos: [],
      });
    }


    
    // 🔹 Calcular centroide promedio o usar centro del distrito si no hay casos
let avgLat = null, avgLng = null;

if (casos.length > 0) {
  avgLat = casos.reduce((sum, c) => sum + (c.latitud || 0), 0) / casos.length;
  avgLng = casos.reduce((sum, c) => sum + (c.longitud || 0), 0) / casos.length;
} else {
  try {
    // Buscar el centroide del distrito como respaldo
    const distritoCentro = await pool.request()
      .input("ubigeo", sql.VarChar, valorUbigeo)
      .query(`
        SELECT AVG(LATITUD) AS lat, AVG(LONGITUD) AS lng
        FROM Distritos
        WHERE ubigeo = @ubigeo
      `);

    if (distritoCentro.recordset[0]) {
      avgLat = distritoCentro.recordset[0].lat;
      avgLng = distritoCentro.recordset[0].lng;
    }
  } catch (error) {
    console.warn("⚠️ No se pudo obtener centroide del distrito:", error.message);
  }
}

    res.json({
      totalCasos: casos.length,
      causas: causas || "Todas",
      tipoDx: tipoDx || "Todos",
      centroide: [avgLat, avgLng],
      casos,
    });
  } catch (err) {
    console.error("❌ Error en listarCasos:", err.message);
    res.status(500).json({ error: err.message });
  }
}

async function insertarCasosMasivos(req, res) {
  const casos = req.body;

  if (!Array.isArray(casos)) {
    console.log("❌ Error: Formato inválido, se esperaba un array de casos.");
    return res.status(400).json({ error: "Formato inválido: se esperaba un array de casos" });
  }

  try {
    const pool = await connectDB();
    let insertados = 0;
    let actualizados = 0;
    let errores = 0;
    let registrosConError = [];
    let totalEnBD = 'No disponible'; 

    console.log(`👉 Recibidos ${casos.length} casos para procesar.`);

    for (const [index, caso] of casos.entries()) {
      try {
        const {
          ano,
          semana,
          tipo_dx,
          ubigeo,
          edad,
          sexo,
          fecha_ini,
          fecha_not,
          latitud,
          longitud,
          causas,
          nomb_distrito,
          nomb_provincia,
          nomb_departamento,
        } = caso;

        // 🔍 DEBUG DETALLADO
        console.log(`\n🔍 Procesando caso ${index + 1}/${casos.length}:`, {
          ano, semana, ubigeo, fecha_ini, tipo_dx, edad, sexo
        });

        // VALIDAR DATOS CRÍTICOS
        if (!ano || !semana || !ubigeo || !fecha_ini) {
          console.log(`❌ DATOS INCOMPLETOS: Fila ${index + 1} - Ano:${ano}, Semana:${semana}, Ubigeo:${ubigeo}, Fecha:${fecha_ini}`);
          errores++;
          registrosConError.push({
            fila: index + 1,
            error: 'Datos incompletos',
            datos: { ano, semana, ubigeo, fecha_ini }
          });
          continue; // Saltar al siguiente registro
        }

        const result = await pool
          .request()
          .input("ano", sql.Int, ano)
          .input("semana", sql.Int, semana)
          .input("tipo_dx", sql.NVarChar(50), tipo_dx || "No especificado")
          .input("ubigeo", sql.VarChar(10), ubigeo)
          .input("edad", sql.Int, edad)
          .input("sexo", sql.NVarChar(10), sexo || null)
          .input("fecha_ini", sql.Date, fecha_ini)
          .input("fecha_not", sql.Date, fecha_not)
          .input("latitud", sql.Float, latitud === "null" ? null : parseFloat(latitud))
          .input("longitud", sql.Float, longitud === "null" ? null : parseFloat(longitud))
          .input("causas", sql.NVarChar(255), causas === "null" ? null : causas)
          .input("distrito", sql.NVarChar(100), nomb_distrito === "null" ? null : nomb_distrito)
          .input("provincia", sql.NVarChar(100), nomb_provincia === "null" ? null : nomb_provincia)
          .input("departamento", sql.NVarChar(100), nomb_departamento === "null" ? null : nomb_departamento)
          .query(`
            MERGE INTO CasosDengue AS Target
            USING (VALUES (
              @ano, @semana, @tipo_dx, @ubigeo, @edad, @sexo,
              @fecha_ini, @fecha_not, @latitud, @longitud,
              @causas, @distrito, @provincia, @departamento
            )) AS Source (
              ano, semana, tipo_dx, ubigeo, edad, sexo,
              fecha_ini, fecha_not, latitud, longitud,
              causas, distrito, provincia, departamento
            )
            ON Target.ano = Source.ano
              AND Target.semana = Source.semana
              AND Target.ubigeo = Source.ubigeo
              AND Target.fecha_ini = Source.fecha_ini
              AND Target.edad = Source.edad        
              AND Target.sexo = Source.sexo         
              AND Target.tipo_dx = Source.tipo_dx 

            WHEN NOT MATCHED BY TARGET THEN
              INSERT (
                ano, semana, tipo_dx, ubigeo, edad, sexo,
                fecha_ini, fecha_not, latitud, longitud,
                causas, distrito, provincia, departamento
              )
              VALUES (
                Source.ano, Source.semana, Source.tipo_dx, Source.ubigeo, Source.edad, Source.sexo,
                Source.fecha_ini, Source.fecha_not, Source.latitud, Source.longitud,
                Source.causas, Source.distrito, Source.provincia, Source.departamento
              )

            WHEN MATCHED THEN
              UPDATE SET
                Target.tipo_dx = Source.tipo_dx,
                Target.edad = Source.edad,
                Target.sexo = Source.sexo,
                Target.fecha_not = Source.fecha_not,
                Target.latitud = Source.latitud,
                Target.longitud = Source.longitud,
                Target.causas = Source.causas,
                Target.distrito = Source.distrito,
                Target.provincia = Source.provincia,
                Target.departamento = Source.departamento

            OUTPUT $action AS accion;
          `);

        // VERIFICAR RESULTADO REAL
        if (result.recordset.length > 0) {
          const action = result.recordset[0].accion;
          if (action === "INSERT") {
            insertados++;
            console.log(`✅ INSERTADO: ${ano} - Semana: ${semana} - Ubigeo: ${ubigeo}`);
          } else if (action === "UPDATE") {
            actualizados++;
            console.log(`⚡ ACTUALIZADO: ${ano} - Semana: ${semana} - Ubigeo: ${ubigeo}`);
          }
        } else {
          // ⚠️ ESTO ES EL PROBLEMA - MERGE no hizo nada
          console.log(`❌ MERGE NO EJECUTADO: ${ano} - Semana: ${semana} - Ubigeo: ${ubigeo}`);
          errores++;
          registrosConError.push({
            fila: index + 1,
            error: 'MERGE no ejecutó ninguna acción',
            datos: { ano, semana, ubigeo, fecha_ini }
          });
        }

      } catch (error) {
        errores++;
        console.error(`❌ ERROR SQL en caso ${index + 1}:`, error.message);
        registrosConError.push({
          fila: index + 1,
          error: error.message,
          datos: { ano, semana, ubigeo, fecha_ini }
        });
      }
    }

    console.log(`\n📊 RESUMEN DETALLADO:`);
    console.log(`   ✅ Insertados: ${insertados}`);
    console.log(`   🔄 Actualizados: ${actualizados}`);
    console.log(`   ❌ Errores: ${errores}`);
    console.log(`   📦 Total recibidos: ${casos.length}`);
    console.log(`   🔍 Diferencia: ${casos.length - (insertados + actualizados + errores)} registros no contabilizados`);

    if (registrosConError.length > 0) {
      console.log(`\n❌ REGISTROS CON ERROR (primeros 10):`);
      registrosConError.slice(0, 10).forEach(error => {
        console.log(`   Fila ${error.fila}:`, error);
      });
    }

    // VERIFICAR EN BD CUÁNTOS HAY REALMENTE
    try {
      const countResult = await pool.request().query('SELECT COUNT(*) as total FROM CasosDengue');
      const totalEnBD = countResult.recordset[0].total;
      console.log(`\n🔍 VERIFICACIÓN BD: ${totalEnBD} registros en la base de datos`);
    } catch (countError) {
      console.log('❌ No se pudo verificar el total en BD:', countError.message);
    }

    res.json({
      message: "Proceso completado",
      nuevos: insertados,
      actualizados: actualizados,
      errores: errores,
      totalRecibidos: casos.length,
      totalEnBD: totalEnBD || 'No disponible',
      registrosConError: registrosConError.slice(0, 10) // Solo primeros 10 errores
    });

  } catch (err) {
    console.error("❌ Error general en insertarCasosMasivos:", err.message);
    res.status(500).json({ error: err.message });
  }
}

module.exports = { insertarCasosMasivos,listarCasos };

