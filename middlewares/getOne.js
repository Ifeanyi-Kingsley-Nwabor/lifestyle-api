const db = require("../database/db");



const getOnePost = (req, res, next) => {
    const {id} = req.params;

    const getPost = {
        text: "SELECT * FROM posts WHERE id = 1$",
        values: [id],
    }
    db.query(getPost)
    .then((data) => {
        if(!data.rows.length) {
            return res.status(404).send("The requested post does not exist");
        }
        req.post = data.rows[0];
        next();
    })
    .catch(next);
}

const getOneAuthor = (req, res, next) => {
    const {id} = req.params;

    const getAuthor = {
        text: "SELECT * FROM authors WHERE id = 1$",
        values: [id],
    }
    db.query(getAuthor)
    .then((data) => {
        if(!data.rows.length) {
            return res.status(404).send("We do not have the requested Author at the moment!");
        }
        req.author = data.rows[0];
        next();
    })
    .catch(next);
}


module.exports = {
    getOnePost,
    getOneAuthor
}