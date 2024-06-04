import dotenvConfig from '../../src/config/dotenv.config.js'
import UsserMannager from '../../src/dao/db/usserMannagerM.js'
import Assert from 'assert'
import connectDB from '../../src/utils/connectDB.js'

const um = new UsserMannager()
const assert = Assert.strict

before((done) => {
    connectDB(dotenvConfig.db)
        .then((_e) => done())
        .catch((e) => {
            logger.error('error trying to connect db')
            done(e)
        })
})

describe('Test user Mannager', async () => {
    const usserInfo = {
        first_name: 'test',
        last_name: 'test',
        email: 'test3@test.com',
        age: 20,
        password: 'testeuifhdwkjcnsdkjcw00' // hashed password simulation
    }
    it('Test SetUsser method', async () => {
        let usser = await um.setUsser(usserInfo)
        usser = usser.content
        assert.ok(usser)
        assert.strictEqual(usser.first_name, usserInfo.first_name)
        assert.strictEqual(usser.last_name, usserInfo.last_name)
        assert.strictEqual(usser.email, usserInfo.email)
        assert.strictEqual(usser.age, usserInfo.age)
        assert.strictEqual(usser.password, usserInfo.password)
    })
    it('Test getUsser method', async () => {
        const usser = await um.getUsser(usserInfo.email)
        assert.ok(usser)
        assert.strictEqual(usser.first_name, usserInfo.first_name)
        assert.strictEqual(usser.last_name, usserInfo.last_name)
        assert.strictEqual(usser.email, usserInfo.email)
        assert.strictEqual(usser.age, usserInfo.age)
        assert.strictEqual(usser.password, usserInfo.password)
    })
    it('Test updateUsser method', async () => {
        await um.updateUsser(usserInfo.email, { first_name: 'test2' })
        const usser = await um.getUsser(usserInfo.email)
        assert.ok(usser)
        assert.strictEqual(usser.first_name, 'test2')
    })
    it('Test deleteUsser method', async () => {
        const usser = await um.deleteUsser(usserInfo.email)
        assert.ok(usser)
    })
})
