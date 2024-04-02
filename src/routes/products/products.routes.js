import { Router } from "express"
import { addProductController, deleteProductController, getProductController, getProductsController, updateProductController } from "../../controllers/products/productsController.js"
const productsRouter = Router()


// get paginate object from products 
productsRouter.get("/", (req, res) => getProductsController(req, res))

// SEND PRODUCT BY ID
productsRouter.get("/:pid", (req, res) => getProductController(req, res))
// Delete product by id 
productsRouter.delete("/delete/:pid", (req, res) => deleteProductController(req, res))
// add new product 
 productsRouter.post("/add_product", (req, res) => addProductController(req, res))
// update product by id 
productsRouter.patch("/update_product/:pid", (req, res) => updateProductController(req, res))

export default productsRouter
