const express = require('express');

const fs = require ('fs')

const app = express();

app.get('/blogPosts', (req, res) => {
    fs.readFile('data.json', 'utf8', (err, data) => {
        if(err) {
            console.log(err)
        } else {
            const parsedData = JSON.parse(data)
            res.send(parsedData);
        }
    })
    
})

const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
})