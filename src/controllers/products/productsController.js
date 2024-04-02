import ProductMannagerM from "../../dao/db/ProductMannagerM.js"
const pm = new ProductMannagerM()

export async function getProductsController(req, res){
    //sort limit page to (para seleccionar otro campo para implementar sort, por defecto price) y querys adicionales
    const response = await pm.getProductsPaginate(req.query)
    ! response.error 
    ? res.send(response)
    : res.status(response.status).send(response)
}

export async function getProductController(req,res){
    const  response = await pm.getProductById(req.params.pid)
    ! response.error 
    ? res.send(response)
    : res.status(response.status).send(response)
}

export async function deleteProductController(req, res){
    //params.pid return an string
    const response = await pm.deleteProductById(req.params.pid)
    ! response.error 
    ? res.send(response)
    : res.status(response.status).send(response)
}

export async function addProductController(req, res){
    const response = await pm.addProduct(req.body)
    ! response.error 
    ? res.send(response)
    : res.status(response.status).send(response)
}

export async function updateProductController(req, res){
    const  response = await pm.updateProduct(req.params.pid, req.body)
    ! response.error 
    ? res.send(response) 
    : res.status(response.status).send(response)
}