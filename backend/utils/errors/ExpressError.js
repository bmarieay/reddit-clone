class ExpressError extends Error{
    constructor(message = "Interal server error", status = 500){
        super();
        this.message = message;
        this.status = status;
    }
}

export default ExpressError;