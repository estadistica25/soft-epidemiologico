const sql = require("mssql");
const dbConfig = require("../config/db");


const getDistritos = async (req, res) => {
  const { ubigeo } = req.query;

  if (!ubigeo) {
    return res.status(400).json({ error: "Falta el parámetro ubigeo" });
  }

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input("ubigeoProv", sql.VarChar, ubigeo)
      .query(`
        SELECT nombre, ubigeo
        FROM Distritos
        WHERE LEFT(ubigeo, 4) = @ubigeoProv
        ORDER BY nombre
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Error al obtener distritos:", err);
    res.status(500).json({ error: "Error al obtener distritos" });
  }
};

module.exports = { getDistritos };

