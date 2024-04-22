
import { Router } from "express"
import { addProductController, deleteProductController, getProductController, getProductsController, updateProductController } from "../../controllers/products/productsController.js"
import { isAdm, isLogged } from "../../utils/users.midleware.js"
const productsRouter = Router()


// get paginate object from products 
productsRouter.get("/",isLogged,(req, res) => getProductsController(req, res))

// SEND PRODUCT BY ID
productsRouter.get("/:pid",isLogged, (req, res) => getProductController(req, res))
// Delete product by id 
productsRouter.delete("/delete/:pid",isAdm, (req, res) => deleteProductController(req, res))
// add new product 
 productsRouter.post("/add_product",isAdm, (req, res) => addProductController(req, res))
// update product by id 
productsRouter.patch("/update_product/:pid",isAdm, (req, res) => updateProductController(req, res))

export default productsRouter
