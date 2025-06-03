import { httpServer } from "./app";
import dotenv from "dotenv";
import logger from "./utils/winston.logger";

dotenv.config({ path: "./.env" });

httpServer.listen(process.env.PORT || 3000, () => {
  logger.info(`The backend is running on ${process.env.PORT}`);
});
