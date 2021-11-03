const express = require('express');
const db = require('../database/db');
//const upload = require('../utils/imageUploader')
const path = require("path");

const messageRouter = express.Router();


messageRouter.get('/', (req, res, next) => {
    db.query("SELECT * FROM contact_messages ORDER BY id ASC")
    .then ((data) => res.json(data.rows))
    .catch(next);
})

messageRouter.get("/:id", (req, res, next) =>{
    const {id} = req.params;
    const getMessage = {
        text: `SELECT * FROM contact_messages WHERE id = $1`,
        values: [id],
    }
    db
    .query(getMessage)
    .then((data)=> res.status(200).json(data.rows))
    .catch((err) => res.sendStatus(500));
    
});

messageRouter.post('/', (req, res, next) => {
    const { first_name, last_name, email, message } = req.body;
    const newMessage = {
        text: `
        INSERT INTO contact_messages (first_name, last_name, email, message)
        VALUES($1,$2,$3,$4)
        RETURNING *`,
        values: [first_name, last_name, email, message],
    }
    db.query(newMessage)
    .then((data) => res.status(201).json(data.rows))
    .catch(next);
});

messageRouter.put('/:id', (req, res, next) => {
    const { first_name, last_name, email, message } = req.body;
    const {id} = req.params;
    const editMessage = {
        text:`
        UPDATE contact_messages 
        SET first_name = $1, last_name = $2, email = $3, message = $4
        WHERE id = $5
        RETURNING *`,
        values:[first_name, last_name, email, message, id],
    }
    db.query(editMessage)
    .then((data) => res.status(201).json(data.rows))
    .catch(next);
})

messageRouter.delete("/:id", (req, res, next) =>{
    const {id} = req.params;
    const deleteMessages = {
      text:`DELETE FROM contact_messages WHERE id = $1
      RETURNING *`,
      values: [id],
    }
    db
    .query(deleteMessages)
    .then((data) => {
        if(!data.rows.length) {
            res.status(404).send(`We can not find the requested message!!!`)
        } else {
            res.status(200).json(data.rows)
        }
    })
    .catch(next)
});

module.exports = messageRouter;