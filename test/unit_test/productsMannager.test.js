import Assert from 'assert'
import ProductManager from '../../src/dao/db/ProductMannagerM.js'
import connectDB from '../../src/utils/connectDB.js'
import logger from '../../src/config/winston.config.js'
import dotenvConfig from '../../src/config/dotenv.config.js'
const pm = new ProductManager()
const assert = Assert.strict

before((done) => {
    connectDB(dotenvConfig.db)
        .then((_e) => done())
        .catch((e) => {
            logger.error('error trying to connect db')
            done(e)
        })
})

describe('Testing Product Mannager', async () => {
    const productInfo = {
        title: 'test2',
        description: 'test2',
        price: 10,
        code: 'test2',
        stock: 10,
        category: 'test'
    }
    let product
    it('Testing getProducts function with no query', async () => {
        const response = await pm.getProductsPaginate()
        assert.ok(response)
        assert.strictEqual(response.status, 'success')
        // default limit is 10 and page is 1
        assert.strictEqual(response.page, 1)
        assert.strictEqual(response.products.length, 10)
    })
    it('Testing getProducts function with query including category', async () => {
        const query = { category: 'sides' }
        const response = await pm.getProductsPaginate(query)
        assert.ok(response)
        assert.strictEqual(response.status, 'success')
        for (const product of response.products) {
            assert.strictEqual(product.category, 'sides')
        }
    })
    it('Testing getProducts function with query including limit and page', async () => {
        const query = { limit: 5, page: 2 }
        const response = await pm.getProductsPaginate(query)
        assert.ok(response)
        assert.strictEqual(response.status, 'success')
        assert.strictEqual(response.page, 2)
        assert.strictEqual(response.products.length, 5)
    })
    it('testing addProduct function', async () => {
        const response = await pm.addProduct(productInfo)
        assert.ok(response)
        assert.strictEqual(response.content.title, productInfo.title)
        assert.strictEqual(response.content.description, productInfo.description)
        assert.strictEqual(response.content.price, productInfo.price)
        assert.strictEqual(response.content.code, productInfo.code)
        assert.ok(response.message)
        product = response.content
    })
    it('testing getProductById function', async () => {
        const response = await pm.getProductById(product._id)
        assert.ok(response)
        assert.strictEqual(response.content.title, productInfo.title)
        assert.strictEqual(response.content.description, productInfo.description)
        assert.strictEqual(response.content.price, productInfo.price)
        assert.strictEqual(response.content.code, productInfo.code)
        assert.ok(response.message)
    })
    it('testing updateProduct function', async () => {
        const response = await pm.updateProduct(product._id, { title: 'test2' })
        assert.ok(response)
        assert.strictEqual(response.content.title, 'test2')
        assert.strictEqual(response.content.description, productInfo.description)
        assert.strictEqual(response.content.price, productInfo.price)
        assert.strictEqual(response.content.code, productInfo.code)
        assert.ok(response.message)
    })
    it('delete one product', async () => {
        const response = await pm.deleteProductById(product._id)
        assert.ok(response)
        assert.strictEqual(response.content.title, 'test2')
        assert.strictEqual(response.content.description, productInfo.description)
        assert.strictEqual(response.content.price, productInfo.price)
        assert.strictEqual(response.content.code, productInfo.code)
        assert.ok(response.message)
    })
})
