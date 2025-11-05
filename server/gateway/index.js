import cluster from "cluster";
import os from "os";
import gateway from "fast-gateway";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

const totalCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`✅ Gateway Primary PID: ${process.pid}`);
  console.log(`🚀 Spawning ${totalCPUs} workers...`);

  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`⚠️ Worker ${worker.process.pid} died. Respawning...`);
    cluster.fork();
  });
} else {
  const server = gateway({
    middlewares: [
      cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
      }),
      morgan("dev"),
    ],

    routes: [
      {
        prefix: "/auth",
        target: process.env.AUTH_SERVICE_URL,
        stripPrefix: false,
      },
      {
        prefix: "/api/data",
        target: process.env.DATA_SERVICE_URL,
        stripPrefix: false,
      },
      {
        prefix: "/api/analytic",
        target: process.env.ANALYTIC_SERVICE_URL,
        stripPrefix: false,
      },
    ],
  });

  server.start(process.env.PORT).then(() => {
    console.log(
      `✅ Worker PID ${process.pid} Gateway running on port ${process.env.PORT}`
    );
  });
}
