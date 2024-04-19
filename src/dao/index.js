import envOptions from "../config/dotenv.config.js"

export let pm 
switch (envOptions.persistence){
    case "FS":
        const {default:productMannager} = await import("./ProductManager/productManager.js")
        pm = new productMannager("./ProductManager/products.json")
        console.log("local data base on use")
        break
    case "MONGO":
        const {default:productMannagerM} = await import("./db/ProductMannagerM.js")
        pm = new productMannagerM() 
        break
}
