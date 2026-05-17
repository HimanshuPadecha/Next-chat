import { drizzle} from "drizzle-orm/neon-http"

// logger.info("The database is string is" + process.env.DATABASE_URI)
export const db = drizzle(process.env.DATABASE_URI!)