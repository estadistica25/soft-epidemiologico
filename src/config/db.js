const sql = require("mssql");

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST, 
  port: parseInt(process.env.DB_PORT), 
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

console.log("Config usada por Node:", dbConfig);  

let pool;

async function connectDB() {
  try {
    if (pool) return pool; 
    pool = await sql.connect(dbConfig);
    console.log("✅ Conexión a SQL Server establecida (pool único)");
    return pool;
  } catch (err) {
    console.error("❌ Error al conectar con SQL Server:", err);
    throw err;
  }
}

module.exports = { connectDB, sql };
