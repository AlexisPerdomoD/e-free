import logger from "../config/winston.config.js"

export default class CustomError {
    static generateUserError = (user) => {
        const message = `One or more properties were incomplete or not valid.
            List of required properties:
            * first_name : needs to be a string, received ${user.first_name}
            * last_name  : needs to be a string, received ${user.last_name}
            * email      : needs to be a string, received ${user.email}`
        throw CustomError.createError({
            code: ErrorCode.INVALID_TYPE_ERROR,
            status: 400,
            message,
        })
    }
    static generateProductError = (productInfo) => {
        const message = `One or more properties were incomplete or not valid.
            List of required properties:
            * title : needs to be string received: ${productInfo.title}
            * description: needs to be string, received ${productInfo.description}
            * category needs to be string, received ${productInfo.category}
            * code: needs to be string, received ${productInfo.code}
            * price: needs to be number higher than 0, received ${productInfo.price}`
        throw CustomError.createError({
            status: 400,
            message,
            code: ErrorCode.INVALID_TYPE_ERROR,
        })
    }
    static generateValidationDataError = (fieldName, errorMessage) => {
        const message = `Validation error for '${fieldName}': ${errorMessage}.`
        throw CustomError.createError({
            code: ErrorCode.INVALID_TYPE_ERROR,
            status: 400,
            message,
        })
    }

    static generateAuthenticationError = () => {
        const message = `Authentication error: You need to log in to access this resource.`
        throw CustomError.createError({
            code: ErrorCode.NOT_AUTHORIZATION,
            status: 401,
            message,
        })
    }

    static generateAuthorizationError = () => {
        const message = `Authorization error: You are not authorized to access this resource.`
        throw CustomError.createError({
            code: ErrorCode.NOT_AUTHORIZATION,
            status: 403,
            message,
        })
    }

    static generateExternalServiceError = (serviceName) => {
        const message = `Error communicating with ${serviceName} service.`
        throw CustomError.createError({
            code: ErrorCode.INTERNAL_SERVER_ERROR,
            status: 500,
            message,
        })
    }

    static generateRateLimitError = () => {
        const message = `Rate limit exceeded: Too many requests. Please try again later.`
        throw CustomError.createError({
            code: ErrorCode.INTERNAL_SERVER_ERROR,
            status: 429,
            message,
        })
    }

    static createError({ message, name = "Error", code = 1, status = 404 }) {
        const error = new Error()
        error.message = message
        error.name = name 
        error.code = code
        error.status = status
        return error
    }
}

export const ErrorCode = {
    ROUTING_ERROR: 1,
    INVALID_TYPE_ERROR: 2,
    NOT_AUTHORIZATION: 3,
    DATABASE_ERROR: 4,
    INTERNAL_SERVER_ERROR: 5,
    GENERAL_USER_ERROR: 6,
}

export const errorMidleware = (error, _req, res, _next) => {
    if (error.code) {
        logger.info(`error incomming status:${error.status} ${error.name}`)
        return res.status(error.status).send({
            name: error.name || "Error",
            message: error.message,
            status: error.status,
            code: error.code,
        })
    }
    if(error instanceof Error){
    //mongose validation errors
        if(error.errors){
            const response ={
                name: error._message || "Error",
                errors:[]
            }
            for (const k in error.errors){
                let cur = error.errors[k]
                response.errors.push({
                    message: cur.properties.message,
                    type: cur.properties.type,
                    field: cur.properties.path,
                    value: cur.properties.value,
                    path: cur.path
                })
            }
            return res.status(400).send(response)
        }
        logger.error(`error status 500 or lost: ${error.status} 
            ${error.name} 
            ${error.message}
        `)
        return res.status(error.status || 500).send({
            name: error.name || "ERROR INTERNAL_SERVER_ERROR",
            message: error.message ,
        })
    }
    logger.log("fatal", `error status lost: ${error.status} process probably dead
        ${error.name} 
        ${error.message}
        ${error.cause}
        `)
    return res.status(500).send("something went wrong, please reload")
}

// mongose errors validations
//error.errors.[key]{
//   properties: {
//     validator: [Function (anonymous)],
//     message: 'must be older than 18 to buy in our store',
//     type: 'min',
//     min: 18,
//     path: 'age',
//     fullPath: undefined,
//     value: 2
//   },
//   kind: 'min',
//   path: 'age',
//   value: 2,
//   reason: undefined,
//   [Symbol(mongoose#validatorError)]: true
// }

