// include `express`
const express = require('express')

// create an express, aka web server, instance
const app = express()

const port = process.argv[2]

const config = require('./config')
const mysql = require('mysql')

const connection = mysql.createConnection(config.mysql)

// start the server
app.listen(port, () => {
  console.log(`listening on port: ${port}`)
})

// handle other urls
app.use(express.static(`${__dirname}/LockerStore`))

connection.connect(err => {
  if (err) {
    console.log('fail to connect:', err)
    process.exit()
  }
})

app.get('/sign_up', (req, res) => {
  res.send(`${req.query.account}`)
})

app.get('/insertLocker', (req, res) => {
  connection.query(
    `INSERT INTO lockers (id, lat, lng, name, addr) 
    SELECT NULL, '${req.query.lat}', '${req.query.lng}', '${req.query.name}', '${req.query.addr}' FROM DUAL
    WHERE NOT EXISTS (SELECT 1 FROM lockers WHERE name = '${req.query.name}' LIMIT 1);`, (err, result) => {
    if (err) console.log('fail to insert:', err)
  })
  res.send(`ok`)
})

app.get('/searchLocker', (req, res) => {
  connection.query(
    `SELECT name, addr FROM lockers WHERE lat = '${req.query.lat}' AND lng = '${req.query.lng}'`, function (error, results, fields) {
      if (error) throw error
      res.send({
        name: results[0].name,
        addr: results[0].addr,
      })
    })
})

app.get('/searchTag', (req, res) => {
  var arr = req.query.keywords.split('#');
  var keywords = arr.join('');
  var queryString;
  if (req.query.sorter === 'priceNum') {
    queryString = `SELECT * FROM shops WHERE MATCH (name, tag) AGAINST ('${keywords}' IN BOOLEAN MODE) ORDER BY ${req.query.sorter} ASC`;
  }
  else {
    queryString = `SELECT * FROM shops WHERE MATCH (name, tag) AGAINST ('${keywords}' IN BOOLEAN MODE) ORDER BY ${req.query.sorter} DESC`;
  }
  // console.log(queryString)
  connection.query(
    queryString, function (error, results, fields) {
      if (error) throw error
      res.send({
        results: results,
      })
    })
})

app.get('/searchShop', (req, res) => {
  var t1 = new Date();
  connection.query(
    `SELECT * FROM shops WHERE name = '${req.query.name}'`, function (error, results, fields) {
      if (error) throw error;
      console.log(new Date() - t1);
      res.send({
        id: results[0].id,
        name: results[0].name,
        starNum: results[0].starNum,
        priceNum: results[0].priceNum,
        commentNum: results[0].commentNum,
        tag: results[0].tag,
        addr: results[0].addr,
        tel: results[0].tel,
        img: results[0].img,
      })
    })
})

app.get('/getItem_single', (req, res) => {
  connection.query(
    `SELECT * FROM shop_${req.query.id} WHERE isGroup = 0`, function (error, results, fields) {
      // if (error) throw error
      res.send({
        results: results,
      })
    })
})

app.get('/getItem_group', (req, res) => {
  connection.query(
    `SELECT * FROM shop_${req.query.id} WHERE isGroup = 1`, function (error, results, fields) {
      // if (error) throw error
      res.send({
        results: results,
      })
    })
})