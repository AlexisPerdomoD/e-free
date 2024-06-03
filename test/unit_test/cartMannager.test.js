import CartMannagerM from '../../src/dao/db/CartMannagerM.js'
import ProductMannagerM from '../../src/dao/db/ProductMannagerM.js'
import Assert from 'assert'
import connectDB from '../../src/utils/connectDB.js'
import dotenvConfig from '../../src/config/dotenv.config.js'
const assert = Assert.strict
const cm = new CartMannagerM()
const pm = new ProductMannagerM()
let product
before((done) => {
    connectDB(dotenvConfig.db)
        .then((_e) => {
            pm.addProduct({
                title: 'test',
                description: 'test',
                price: 100,
                thumbnail: 'test',
                code: 100,
                stock: 100,
                status: true
            })
                .then((p) => {
                    product = p.content
                    done()
                })
                .catch((e) => done(e))
        })
        .catch((e) => done(e))
})
after((done) => {
    pm.deleteProductById(product._id)
        .then((_e) => done())
        .catch((e) => done(e))
})
describe('Testing cart Mannager', async () => {
    let cart
    it('testing create cart', async () => {
        const response = await cm.addCart()
        assert.ok(response)
        assert.strictEqual(response.message, 'cart properly added, id: ' + response.content._id)
        cart = response.content
    })
    it('Testing getCartById function', async () => {
        const response = await cm.getCartById(cart._id)
        assert.ok(response)
        assert.deepEqual(response._id, cart._id)
    })
    it('Testing add product to cart with quantity 1, updateCartProduct method', async () => {
        const response = await cm.updateCartProduct(cart._id, product._id)
        assert.ok(response)
        assert.strictEqual(response.message, 'cart properly updated')
    })
    it('Testing cart checkout method', async () => {
        const response = await cm.cartCheckOut(cart._id)
        assert.ok(response)
        assert.strictEqual(response.ticket.products.length, 1)
        assert.strictEqual(response.ticket.amount, product.price)
    })

    it('Testing add product to cart with quantity 2, updateCartProduct method', async () => {
        const response = await cm.updateCartProduct(cart._id, product._id, 2)
        assert.ok(response)
        assert.strictEqual(response.message, 'cart properly updated')
    })

    it('Delete cart', async () => {
        const response = await cm.deleteCartById(cart._id)
        assert.ok(response)
    })
})
