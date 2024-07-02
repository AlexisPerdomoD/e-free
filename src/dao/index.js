import envOptions from "../config/dotenv.config.js"
import logger from "../config/winston.config.js"
import CartMannagerM from "./db/CartMannagerM.js"
import MongoMannager from "./db/MongoMannager.js"
import TicketMannager from "./db/TicketMannager.js"
import UsserMannagerM from "./db/usserMannagerM.js"
import chatModel from "./models/chat.model.js"
// EXPORT MANAGERS INSTANCES 
// EXPORT PRODUCT MANNAGER DEPENDING ON PERSISTENCE
export let pm 
switch (envOptions.persistence){
    case "FS":
        // eslint-disable-next-line 
        const {default:productMannager} = await import("./ProductManager/productManager.js")
        pm = new productMannager("./ProductManager/products.json")
        logger.info("local data base on use")
        break
    case "MONGO":
        // eslint-disable-next-line
        const {default:productMannagerM} = await import("./db/ProductMannagerM.js")
        pm = new productMannagerM() 
        break
}
// EXPORT CART MANNAGER
export const cm = new CartMannagerM()
// EXPORT USERS MANNAGER
export const um = new UsserMannagerM()
// EXPORT TICKET MANNAGER
export const tm = new TicketMannager()
// EXPORT COMMENTS MANNAGER
export const commentsM = new MongoMannager(chatModel, 'chat')
