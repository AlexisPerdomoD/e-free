import swaggerJSDoc from "swagger-jsdoc"
import __dirname from "../dirname.js"
const swaggerOptions = {
    definition:{
        openapi: '3.0.1',
        info:{
            title: "API REST E-free",
            version: "1.0.0",
            description: "API REST Express Server, for open source projects",
        }
    },
    apis:[`${__dirname}/documentation/swagger/*.yaml`]
}

const specs = swaggerJSDoc(swaggerOptions)

export default specs
