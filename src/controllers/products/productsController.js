import { pm } from "../../dao/index.js";
import em, { ErrorCode } from "../../utils/error.manager.js";
export async function getProductsController(req, res, next) {
  try {
    const response = await pm.getProductsPaginate(req.query);
    return res.send(response);
  } catch (err) {
    next(err);
  }
}

export async function getProductController(req, res, next) {
  try {
    const response = await pm.getProductById(req.params.pid);
    return res.send(response);
  } catch (err) {
    next(err);
  }
}

export async function deleteProductController(req, res, next) {
  try {
    //params.pid return an string
    const response = await pm.deleteProductById(req.params.pid);
    return res.send(response);
  } catch (err) {
    next(err);
  }
}

export async function addProductController(req, res, next) {
  try {
    const {
      title,
      description,
      price,
      category,
      code,
      thumbnail,
      status,
      stock,
    } = req.body;
    if (!title || !description || !price || !category || !code)
      em.generateProductError({
        title,
        description,
        price,
        category,
      });
    if (typeof category !== "string")
      em.generateValidationDataError("category", "category must by an string");

    const productInfo = {
      title,
      description,
      price,
      category: category.trim().toLowerCase(),
    };
    if (typeof thumbnail === "string") productInfo.thumbnail = thumbnail;
    if (typeof status === "boolean") productInfo.status = status;
    if (typeof stock === "number" && stock >= 0) productInfo.stock = stock;

    const response = await pm.addProduct(productInfo);
    return res.send(response);
  } catch (err) {
    next(err);
  }
}

export async function updateProductController(req, res, next) {
  try {
    const updateblesFields = [
      "title",
      "description",
      "price",
      "stock",
      "thumbnail",
      "status",
      "category",
      "code",
    ];
    const updates = {};
    for (const field of updateblesFields) {
      if (req.body[field]) updates[field] = req.body[field];
    }
    if (Object.entries(updates).length === 0)
      return em.createError({
        error: "Bad Request",
        message: "there is any valid field to be update",
        status: 400,
        code: ErrorCode.GENERAL_USER_ERROR,
      });

    const response = await pm.updateProduct(req.params.pid, updates);
    return res.send(response);
  } catch (err) {
    next(err);
  }
}
