const sql = require("mssql");
const dbConfig = require("../config/db");


const getProvincias = async (req, res) => {
  const { ubigeo } = req.query;

  if (!ubigeo) {
    return res.status(400).json({ error: "Falta el parámetro ubigeo" });
  }

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input("ubigeoDepto", sql.VarChar, ubigeo)
      .query(`
        SELECT idProvincia AS id, nombre, ubigeo
        FROM Provincias
        WHERE LEFT(ubigeo, 2) = @ubigeoDepto
        ORDER BY nombre
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Error al obtener provincias:", err);
    res.status(500).json({ error: "Error al obtener provincias" });
  }
};


module.exports = { getProvincias };
