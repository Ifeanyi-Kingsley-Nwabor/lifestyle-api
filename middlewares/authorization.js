const authorization = (req, res, next) => {
    const {token} = req.body;
    console.log({token});
    if(!token || token !== process.env.SECRET_TOKEN) {
        return res.status(401).send("You are not authorized to perfom this action! Please contact admin.")
    } 
    next();
}

module.exports = authorization;