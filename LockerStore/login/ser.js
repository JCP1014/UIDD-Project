#!/usr/bin/env node

const express = require('express')
const app = express()
const fs = require('fs')
const config= require('./config')
const port = config.port

app.use(express.static(`${__dirname}/dist`))

app.get('/hello', (req, res) => {
  msg = 'hello'
  setTimeout(()=>res.send(msg) , 500);
})

// Step 1 code here //
const https = require('https')

const options = {
  ca: fs.readFileSync(config.ssl.ca),
  cert: fs.readFileSync(config.ssl.cert),
  key: fs.readFileSync(config.ssl.key),
}

https.createServer(options, app).listen(port,()=>{
  console.log(`listen on port:${port}`)
})
