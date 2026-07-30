const adminOnly = (req, res, next) => {
    // check if req.user exists
    if (!req.user){
        const error = new Error("An unauthorized user cannot continue!")
        error.statusCode = 401
        throw error;
    }

    // check if this user is an admin
    if (req.user.role !== "admin"){
        const error = new Error("Only admin has the permission to do this operation!")
        error.statusCode = 403
        throw error;
    }

    next();
}

module.exports = {adminOnly}