//utility to catch async errors instead of try catch
export const catchAsyncError = function(fn){
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    }
}