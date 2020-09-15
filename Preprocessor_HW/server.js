// include `express`
const express = require('express')

// create an express, aka web server, instance
const app = express()

const port = process.argv[2]

// start the server
app.listen(port, () => {
  console.log(`listening on port: ${port}`)
})

// handle other urls
app.use(express.static(`${__dirname}/dst`))

app.get('/sign_up', (req, res) => {
  res.send(`${req.query.account}`)
})
