export default class CustomError {
    static generateUserError = (user) => {
        const message = `One or more properties were incomplete or not valid.
            List of required properties:
            * first_name : needs to be a string, received ${user.first_name}
            * last_name  : needs to be a string, received ${user.last_name}
            * email      : needs to be a string, received ${user.email}`;
        throw CustomError.createError({ code: ErrorCode.INVALID_TYPE_ERROR, status: 400, message });
    };

    static generateValidationDataError = (fieldName, errorMessage) => {
        const message = `Validation error for '${fieldName}': ${errorMessage}.`;
        throw CustomError.createError({ code: ErrorCode.INVALID_TYPE_ERROR, status: 400, message });
    };

    static generateAuthenticationError = () => {
        const message = `Authentication error: You need to log in to access this resource.`;
        throw CustomError.createError({ code: ErrorCode.NOT_AUTHORIZATION, status: 401, message });
    };

    static generateAuthorizationError = () => {
        const message = `Authorization error: You are not authorized to access this resource.`;
        throw CustomError.createError({ code: ErrorCode.NOT_AUTHORIZATION, status: 403, message });
    };

    static generateExternalServiceError = (serviceName) => {
        const message = `Error communicating with ${serviceName} service.`;
        throw CustomError.createError({ code: ErrorCode.INTERNAL_SERVER_ERROR, status: 500, message });
    };

    static generateRateLimitError = () => {
        const message = `Rate limit exceeded: Too many requests. Please try again later.`;
        throw CustomError.createError({ code: ErrorCode.INTERNAL_SERVER_ERROR, status: 429, message });
    };

    static createError({ cause, message, name = "Error", code = 1, status = 404 }) {
        const error = new Error(message, { cause });
        error.name = name;
        error.code = code;
        error.status = status;
        return error;
    }
}

export const ErrorCode = {
    ROUTING_ERROR:1,
    INVALID_TYPE_ERROR:2,
    NOT_AUTHORIZATION:3,
    DATABASE_ERROR:4,
    INTERNAL_SERVER_ERROR:5
}

export const errorMidleware = (error, req, res, next) =>{
    if(error.status){
        return res.status(error.status).send(error)
    }
    return res.status(500).send("something went wrong, please reload")
}
