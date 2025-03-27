import ExpressError from "./ExpressError.js";

class NotFoundEror extends ExpressError{
    constructor(message = "Resource can't be found", status = 404){
        super(message, status);
    }
}

export default NotFoundEror;