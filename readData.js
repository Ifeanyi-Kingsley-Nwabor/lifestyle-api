const fs = require ('fs')
fs.readFile('data.json', 'utf8', (err, data) => {
    if(err) {
        console.log(err)
    } else {
        console.log(JSON.parse(data))
    }
})