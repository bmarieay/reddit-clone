import ExpressError from "./ExpressError.js";

class UnauthorizedError extends ExpressError{
    constructor(message = "You do not have enough permissions", status = 401){
        super(message, status);
    }
}

export default UnauthorizedError;