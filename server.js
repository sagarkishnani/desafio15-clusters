const express = require("express");
const cluster = require("cluster");

const app = express();

const numCpu = require("os").cpus().length;

if (cluster.isMaster) {
  console.log(numCpu);
  console.log(`PID MASTER ${process.pid}`);

  for (let i = 0; i < numCpu; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  const PORT = parseInt(process.argv[2]) || 8080;

  app.get("/info", (req, res) => {
    res.send(
      `Servidor en puerto ${PORT} - <b>PID ${
        process.pid
      }</b> - ${new Date().toLocaleString()} <br> ${process.pid}`
    );
  });

  app.get("/api/randoms", (req, res) => {
    res.send(`Random`);
  });

  app.listen(PORT, (err) => {
    if (!err)
      console.log(`Servidor escuchando en puerto ${PORT} - PID ${process.pid}`);
  });

  app.on("error", (error) => console.log(`Error en servidor ${error}`));
}
