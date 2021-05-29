import { app } from "./app"
import { logger } from "./logger"
const port = parseInt(process.env.PORT || "3000")
export const httpServer = app.listen(port, () => {
  // if (err) {
  //   return logger.error(`Unable to create server: ${err.message}`)
  // }
  logger.info(`Server is running on port: ${port}`)
})

