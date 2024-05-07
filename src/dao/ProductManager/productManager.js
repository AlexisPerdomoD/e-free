import fs from "fs"
import crypto from "crypto"
import { checkLocalDbFile as checkDb } from "../../utils/utils.js"
import envOptions from "../../config/dotenv.config.js"
import em, { ErrorCode } from "../../utils/error.manager.js"

export default class ProductManager {
    constructor(path) {
        this.path = path
    }
    async getProductsPaginate(querys) {
        if (fs.existsSync(this.path))
            return em.createError({
                name: "CastError",
                code: ErrorCode.DATABASE_ERROR,
                message: "there is not file found",
                status: 500,
            })
        const { limit, page, sort, category } = querys
        const { products, payload } = await checkDb(this.path)
        const response = { products, payload, status: "success" }
        response.totalPages = 1
        response.nextPage = null
        response.prevPage = null
        response.hasPrevPage = false
        response.hasNextPage = false
        if (sort && sort === "1")
            response.products.sort((a, b) => a.price - b.price)
        if (sort && sort === "-1")
            response.products.sort((a, b) => b.price - a.price)
        if (!limit || limit > 100) limit = 100 //dont want anything broken
        if (category) {
            response.products = products.filter((p) => (p.category = category))
            response.payload = response.products.length
        }
        if (limit && limit < payload) {
            response.totalPages = Number.isInteger(response.payload / limit)
                ? response.payload / limit
                : Math.floor(response.payload / limit) + 1
            if (page && page - 1 > 1) {
                response.products = response.products.slice(
                    (page - 1) * limit - 1,
                    page * limit > products.length - 1
                        ? products.length - 1
                        : page * limit
                )
            } else {
                response.products = response.products.slice(0, limit - 1)
            }
        }
        if (page && page > 1) {
            response.hasPrevPage = true
            response.prevPage = envOptions.host + "/?page=" + parseInt(page) - 1
        }
        if (page && page < response.totalPages) {
            response.hasNextPage = true
            response.nextPage = envOptions.host + "/?page=" + parseInt(page) + 1
        }

        if (category && response.prevPage)
            response.prevPage += `&20category=${category}&20`
        if (category && response.nextPage)
            response.nextPage += `&20category=${category}&20`
        if (limit && response.prevPage)
            response.prevPage += `&20limit=${limit}&20`
        if (limit && response.nextPage)
            response.nextPage += `&20limit=${limit}&20`
        return response
    }
    async addProduct({
        title,
        description,
        price,
        category,
        thumbnail,
        code,
        stock,
        status = true,
    }) {
        try {
            const m = await checkDb(this.path)
            // VALIDACIONES
            if (m.products.find((p) => p.code === code)) {
                return em.createError({
                    message:
                        "code already used in the catalogo, in order to add a new product must have an unique code",
                    name: "CastError",
                    code: ErrorCode.GENERAL_USER_ERROR,
                    status: 400,
                })
            } else {
                const id = crypto.randomBytes(16).toString("hex")
                const newProduct = {
                    id,
                    title,
                    description,
                    price,
                    category,
                    thumbnail,
                    code,
                    stock,
                    status,
                }
                m.products.push(newProduct)
                // AGREGAR EL PRODUCTO
                await fs.promises.writeFile(
                    this.path,
                    JSON.stringify({ products: m.products })
                )
                return {
                    message: `product ${newProduct.code} correctly added`,
                    content: newProduct,
                }
            }
        } catch (error) {
            return em.createError({
                name: "Error",
                message: "Error trying to add product",
                code: ErrorCode.DATABASE_ERROR,
                status: 500,
            })
        }
    }
    async getProductById(id) {
        try {
            const m = await checkDb(this.path)
            const res = m.products.find((p) => p.id.toString() === id)
            return res
                ? res
                : em.createError({
                      name: "CastError",
                      message: "product not found",
                      status: 404,
                  })
        } catch (error) {
            return em.createError({
                name: "Error",
                message: "Error trying to add product",
                code: ErrorCode.DATABASE_ERROR,
                status: 500,
            })
        }
    }
    async updateProduct(id, updates) {
        try {
            const m = await checkDb(this.path)

            if (
                updates.code &&
                m.products.find((product) => product.code === updates.code)
            )
                return em.createError({
                    name: "CastError",
                    status: 400,
                    message:
                        "this code is already in other product, need a newone",
                    code: ErrorCode.GENERAL_USER_ERROR,
                })
            if (m.products.find((p) => p.id === id)) {
                let index = m.products.findIndex((p) => p.id === id)
                for (const key in updates) {
                    if (key in m.products[index][key]) {
                        m.products[index][key] = updates[key]
                    }
                }
                await fs.promises.writeFile(
                    this.path,
                    JSON.stringify({
                        products: m.products,
                        payload: m.products.length,
                    })
                )
                return {
                    message: `  update at id : ${id} properly made`,
                    content: pManager.products[index],
                }
            } else {
                return em.createError({
                    name: "CastError",
                    status: 404,
                    message: "not product with the given id: " + id,
                    code: ErrorCode.GENERAL_USER_ERROR,
                })
            }
        } catch (error) {
            return em.createError({
                name: "Error",
                message: "Error trying to delete product",
                code: ErrorCode.DATABASE_ERROR,
                status: 500,
            })
        }
    }
    async deleteProductById(id) {
        try {
            const m = await checkDb(this.path)
            let product = m.products.find((p) => p.id.toString() === id)
            if (product) {
                m.products = m.products.filter(
                    (p) => p.id.toString() !== product.id
                )
                await fs.promises.writeFile(
                    this.path,
                    JSON.stringify({
                        products: m.products,
                        payload: m.products.length,
                    })
                )
                return { message: "product deleted", content: product }
            } else {
                return em.createError({
                    name: "CastError",
                    status: 404,
                    message: "not product with the given id: " + id,
                    code: ErrorCode.GENERAL_USER_ERROR,
                })
            }
        } catch (error) {
            return em.createError({
                name: "Error",
                message: "Error trying to delete product",
                code: ErrorCode.DATABASE_ERROR,
                status: 500,
            })
        }
    }
}

