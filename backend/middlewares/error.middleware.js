export const logError = (err, req, res, next) => {
    console.error("%%%%%%%%%%ERROR%%%%%%%%%%");
    console.error(err.stack);
    next(err);
}

export const finalErrorHandler = (err, req, res, next) => {
    const {status = 500, message = "Something went wrong"} = err;
    res.status(status).json({error: message});
}