import mongoose from "mongoose"
import logger from "../config/winston.config.js"
import em from "./error.manager.js"
export default async function connectDB(collection) {
    try {
        const response = await mongoose.connect(collection)
        logger.debug("data base connected properly")
        return response
    } catch (error) {
        logger.fatal("problem connecting to data base. " + error?.message || "")
        return em.generateExternalServiceError("MongoDB")
    }
}

