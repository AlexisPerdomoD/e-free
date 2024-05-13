import { pm } from "../../dao/index.js"
import em, { ErrorCode } from "../../utils/error.manager.js"
export async function getProductsController(req, res) {
    //sort limit page to (para seleccionar otro campo para implementar sort, por defecto price) y querys adicionales
    const response = await pm.getProductsPaginate(req.query)
    return res.send(response)
    
}

export async function getProductController(req, res) {
    const response = await pm.getProductById(req.params.pid)
    return res.status(response.status || 200).send(response)
}

export async function deleteProductController(req, res) {
    //params.pid return an string
    const response = await pm.deleteProductById(req.params.pid)
    return res.status(response.status || 200).send(response)
}

export async function addProductController(req, res) {
    const response = await pm.addProduct(req.body)
    return res.status(response.status || 200).send(response)
    
}

export async function updateProductController(req, res) {
    const response = await pm.updateProduct(req.params.pid, req.body)
    return res.status(response.status || 200).send(response)
}
