const express = require('express');
const db = require('../database/db');
//const authorization = require("../middlewares/authorization");
//const getPost = require('../middlewares/getOne').getOnePost;
const postRouter = express.Router();

// postRouter
//     .route("/:id")
//     .get(getPost)
//     //.post(authorization)
//     //.put([authorization, getPost])
//     .put([getPost])
//     .delete([authorization, getPost]);


// Blog posts routes:

postRouter.get('/', (req, res, next) => {
    db.query(`SELECT posts.id, posts.name, posts.featured_image, posts.author_id, posts.date_created, posts.description, authors.first_name,  authors.last_name, authors.email, authors.twitter FROM posts JOIN authors ON authors.id=posts.author_id ORDER BY posts.id ASC`)
    .then((data) => res.json(data.rows))
    .catch(next);
    
});

postRouter.get('/:id', ( req, res, next) => {
    const {id} = req.params;
    const singlePost = { 
        text : "SELECT * FROM posts WHERE id = $1",
        values: [id],
    }
    db.query(singlePost)
    .then((data) => res.status(200).json(data.rows))
    .catch(next);
    //res.json(req.post)
});

postRouter.post('/', (req, res, next) => {
    const { name, featured_image, author_id, date_created, description } = req.body;

    const newPost = {
        text: `INSERT INTO posts (name, featured_image, author_id, date_created, description)
        VALUES($1,$2,$3,$4,$5)
        RETURNING *
        `,
        values: [name, featured_image, author_id, date_created, description],
    }
    db.query(newPost)
    .then((data) => res.status(201).json(data.rows))
    .catch(next);
})

postRouter.put('/:id', (req, res, next) => {
    const { name, featured_image, author_id, date_created, description } = req.body;
    const {id} = req.params;
    const updatePost = {
        text: `
        UPDATE posts
        SET name=$1, featured_image=$2, author_id=$3, date_created=$4, description=$5
        WHERE id=$6
        RETURNING *
        `,
        values:[name, featured_image, author_id, date_created, description, id]
    }
    db.query(updatePost)
    .then((data) => res.status(201).json(data.rows))
    .catch(next);
})

postRouter.delete('/:id', (req, res, next) => {
    const {id} = req.params;
    const deletePost = {
        text:`
        DELETE FROM posts
        WHERE id=$1
        RETURNING *`,
        values: [id],
    }
    db.query(deletePost)
    .then((data) => {
        if(!data.rows.length) {
            res.status(404).send(`The requested post does not exist!! Please checkout our latest posts.`)
        } else {
            res.status(200).json(data.rows)
        }
    })
    .catch(next);
});

module.exports = postRouter;