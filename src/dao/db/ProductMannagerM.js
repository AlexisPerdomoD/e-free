import productModel from "../models/product.model.js";

export default class ProductMannagerM {
  async getProductsPaginate(querys) {
    const options = { limit: 10, page: 1 };
    if (querys?.limit) {
      options.limit = +querys.limit;
      delete querys.limit;
    }
    if (querys?.page) {
      options.page = +querys.page;
      delete querys.page;
    }
    if (querys?.sort) {
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
    return {
      message: "product found",
      content: await productModel.findById(id),
    };
  }
  async deleteProductById(id) {
    const response = await productModel.findByIdAndDelete(id);
    return {
      message: "product " + (response ? " eliminated properly" : " not found"),
      content: response,
    };
  }
  async addProduct(product) {
    let newProduct = new productModel(product);
    newProduct = await newProduct.save();
    return {
      message: "product properly added, id: " + newProduct._id,
      content: newProduct,
    };
  }
  async updateProduct(id, updates) {
    await productModel.updateOne({ _id: id }, { $set: updates });
    return {
      message: "product properly updated",
      content: await productModel.findById(id),
    };
  }
}
