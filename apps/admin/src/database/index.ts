import pg, { PoolConfig, Pool, QueryResult } from "pg";
import dotEnv from "dotenv";

dotEnv.config();

let pool: Pool | null = null;
let idleTimeout: NodeJS.Timeout | null = null;
const IDLE_TIMEOUT_MS = 600000; // 10 minutes

export default function createPool(): Pool {
  try {
    if (!pool) {
      const poolConfig: PoolConfig = {
        user: process.env.DB_USER || "",
        password: process.env.DB_PASSWORD || "",
        host: process.env.DB_HOST || "",
        port: parseInt(process.env.DB_PORT || "5432", 10),
        database: process.env.DB_NAME || "",
        ssl: {
          rejectUnauthorized: false,
        },
        allowExitOnIdle: true,
        idleTimeoutMillis: 5000,
      };

      pool = new pg.Pool(poolConfig);
      console.log("nova pool criada");
      // Define o timer para fechar a conexão quando estiver ociosa
      idleTimeout = setTimeout(() => {
        if (pool) {
          pool.end(); // Fecha a pool
          pool = null; // Define a pool como null
        }
      }, IDLE_TIMEOUT_MS);
    } else {
      // Reinicia o timer
      resetIdleTimeout();
    }
  } catch (error) {
    console.log(`createPool`, error);
  }

  return pool!;
}

function resetIdleTimeout() {
  if (idleTimeout) {
    clearTimeout(idleTimeout);
    idleTimeout = setTimeout(() => {
      if (pool) {
        pool.end(); // Fecha a pool
        pool = null; // Define a pool como null
      }
    }, IDLE_TIMEOUT_MS);
  }
}

// Wrapper para o método query
async function query(queryString: string): Promise<any> {
  const pool = createPool();
  try {
    const result: QueryResult = await pool.query(queryString);
    return result.rows;
  } catch (error) {
    throw error;
  }
}
