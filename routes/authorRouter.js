const express = require('express');
const db = require('../database/db');
const upload = require('../utils/imageUploader')
const path = require("path");
// const authorization = require("../middlewares/authorization");
// const getAuthor = require('../middlewares/getOne').getOneAuthor;

const authorRouter = express.Router();

// authorRouter
//     .route("/:id?")
//     .get(getAuthor)
//     .post(authorization)
//     .put([authorization, getAuthor])
//     .delete([authorization, getAuthor]);


// Authors routes

authorRouter.get('/', (req, res, next) => {
    db.query("SELECT * FROM authors ORDER BY id ASC")
    .then ((data) => res.json(data.rows))
    .catch(next);
})

authorRouter.get("/:id", (req, res, next) =>{
    const {id} = req.params;
    const getAuthor = {
        text: `SELECT * FROM authors WHERE id = $1`,
        values: [id],
    }
    db
    .query(getAuthor)
    .then((data)=> res.status(200).json(data.rows))
    .catch((err) => res.sendStatus(500));
     //res.json(req.author);
});

authorRouter.post('/', (req, res, next) => {
    const { first_name, last_name, email, twitter } = req.body;
    const newAuthor = {
        text: `
        INSERT INTO authors (first_name, last_name, email, twitter)
        VALUES($1,$2,$3,$4)
        RETURNING *`,
        values: [first_name, last_name, email, twitter],
    }
    db.query(newAuthor)
    .then((data) => res.status(201).json(data.rows))
    .catch(next);
});

authorRouter.put('/:id', (req, res, next) => {
    const { first_name, last_name, email, twitter } = req.body;
    const {id} = req.params;
    const updateAuthor = {
        text:`
        UPDATE authors 
        SET first_name = $1, last_name = $2, email = $3, twitter = $4
        WHERE id = $5
        RETURNING *`,
        values:[first_name, last_name, email, twitter, id],
    }
    db.query(updateAuthor)
    .then((data) => res.status(201).json(data.rows))
    .catch(next);
})

authorRouter.delete("/:id", (req, res, next) =>{
    const {id} = req.params;
    const deleteAuthor = {
      text:`DELETE FROM authors WHERE id = $1
      RETURNING *`,
      values: [id],
    }
    db
    .query(deleteAuthor)
    .then((data) => {
        if(!data.rows.length) {
            res.status(404).send(`The requested Author does not exist!! Please contact admin.`)
        } else {
            res.status(200).json(data.rows)
        }
    })
    .catch(next)
});

module.exports = authorRouter;