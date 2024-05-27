
import { Router } from "express"
import { addProductController, deleteProductByOwnerCtr, deleteProductController, getProductController, getProductsController, updateProductByOwnerCtr, updateProductController } from "../../controllers/products/productsController.js"
import { isAdm, isLogged, isPremium } from "../../utils/users.midleware.js"
const productsRouter = Router()


// get paginate object from products 
productsRouter.get("/", async (req, res, next) => getProductsController(req, res, next))

// SEND PRODUCT BY ID
productsRouter.get("/:pid", isLogged, (req, res, next) => getProductController(req, res, next))
// Delete product by id 
productsRouter.delete("/:pid", isAdm, (req, res, next) => deleteProductController(req, res, next))
// add new product 
productsRouter.post("/", isAdm, (req, res, next) => addProductController(req, res, next))
// update product by id 
productsRouter.patch("/:pid",isAdm, (req, res, next) => updateProductController(req, res, next))

// premium users endpoints 

productsRouter.post("/premium", isPremium, (req, res, next) => addProductController(req, res, next))

productsRouter.patch("/:pid/premium", isPremium, (req, res, next) => updateProductByOwnerCtr(req, res, next))

productsRouter.delete("/:pid/premium", isPremium, (req, res, next) => deleteProductByOwnerCtr(req, res, next))

export default productsRouter

// {
//   "message": "product properly added, id: 663997aefcd770c251b6d45f",
//   "content": {
//     "title": "nuevo producto",
//     "description": "Golden-fried chicken tenders served with your choice of dipping sauce – BBQ, honey mustard, or ranch",
//     "price": 7.49,
//     "category": "nuevo",
//     "code": "nuevo",
//     "thumbnail": null,
//     "status": true,
//     "stock": 99,
//     "_id": "663997aefcd770c251b6d45f",
//     "__v": 0
//   }
// }
