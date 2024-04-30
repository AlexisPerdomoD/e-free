import productModel from "../models/product.model.js";
import em, { ErrorCode } from "../../utils/error.manager.js";

export default class ProductMannagerM {
  async getProductsPaginate(querys) {
    const options = { limit: 10, page: 1 };
    if (querys.limit) {
      options.limit = +querys.limit;
      delete querys.limit;
    }
    if (querys.page) {
      options.page = +querys.page;
      delete querys.page;
    }
    if (querys.sort) {
      let sort = querys.sort;
      let toOrder = querys.to ? querys.to : "price";
      delete querys.to;
      delete querys.sort;
      options.sort = {};
      options.sort[toOrder] = +sort || sort;
    }

    let data = await productModel.paginate(querys, options);
    const response = { status: "success" };
    response.payload = data.totalDocs;
    response.products = data.docs;
    response.totalPages = data.totalPages;
    response.page = data.page;
    response.hasPrevPage = data.hasPrevPage;
    response.hasNextPage = data.hasNextPage;
    response.nextPage = data.nextPage;
    response.prevPage = data.prevPage;
    return response;
  }
  async getProductById(id) {
    try {
      return {
        message: "product found",
        content: await productModel.findById(id),
      };
    } catch (error) {
      if (error.name === "CastError")
        throw em.createError({
          name: error.name,
          status: 404,
          message: error.message || "product not found",
          code: ErrorCode.GENERAL_USER_ERROR,
        });
    }
  }
  async deleteProductById(id) {
    const response = await productModel.findByIdAndDelete(id);
    try {
      return {
        message:
          "product " + (response ? " eliminated properly" : " not found"),
        content: response,
      };
    } catch (error) {
      if (error.name === "CastError")
        em.generateValidationDataError(
          id,
          "it seems there is no coincidence with this id"
        );
      throw em.createError({
        name: "Error",
        message: "Error trying to delete product",
        code: ErrorCode.DATABASE_ERROR,
        status: 500,
      });
    }
  }
  async addProduct(product) {
    try {
      let newProduct = new productModel(product);
      newProduct = await newProduct.save();
      return {
        message: "product properly added, id: " + newProduct._id,
        content: newProduct,
      };
    } catch (error) {
      if (error.name === "CastError") em.generateProductError(product);
      throw em.createError({
        name: "Error",
        message: "Error trying to add product",
        code: ErrorCode.DATABASE_ERROR,
        status: 500,
      });
    }
  }
  async updateProduct(id, updates) {
    try {
      let response = await productModel.updateOne(
        { _id: id },
        { $set: updates }
      );
      return {
        message: "product properly updated",
        content: response,
      };
    } catch (error) {
      if (error.name === "CastError")
        em.generateValidationDataError(
          id,
          "there is not product with the given id: " + id
        );
      throw em.createError({
        name: "Error",
        message: "Error trying to update product",
        code: ErrorCode.DATABASE_ERROR,
        status: 500,
      });
    }
  }
}

