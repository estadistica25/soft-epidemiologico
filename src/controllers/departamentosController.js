const { connectDB, sql } = require("../config/db");

const getDepartamentos = async (req, res) => {
  try {
    const pool = await connectDB(); 
    const result = await pool.request().query("SELECT * FROM Departamentos");
    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Error al obtener departamentos:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

module.exports = { getDepartamentos };
