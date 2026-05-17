import "dotenv/config";
import { httpServer } from "./app";
import logger from "./utils/winston.logger";

httpServer.listen(process.env.PORT || 3000, () => {
  logger.info(`The backend is running on ${process.env.PORT}`);
});
