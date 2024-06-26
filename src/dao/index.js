import envOptions from "../config/dotenv.config.js"
import logger from "../config/winston.config.js"

export let pm 
switch (envOptions.persistence){
    case "FS":
        const {default:productMannager} = await import("./ProductManager/productManager.js")
        pm = new productMannager("./ProductManager/products.json")
        logger.info("local data base on use")
        break
    case "MONGO":
        const {default:productMannagerM} = await import("./db/ProductMannagerM.js")
        pm = new productMannagerM() 
        break
}
