const express = require("express");
const cors = require("cors");

const casosRouter = require("./routes/casos");
const causasRouter = require("./routes/causas");
const ubicacionesRouter = require("./routes/ubicaciones");
const ineiRoutes = require("./routes/inei");

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));  
app.use(express.urlencoded({ 
  extended: true,
  limit: "50mb"  
}));
app.use(express.urlencoded({ extended: true }));


app.use("/api/causas", causasRouter);
app.use("/api/casos", casosRouter);
app.use("/api", ubicacionesRouter);

app.use("/api/inei", ineiRoutes);

module.exports = app;
