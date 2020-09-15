const request = require('request');
const cheerio = require("cheerio");
// include `express`
const express = require('express')

// create an express, aka web server, instance
const app = express()

const port = process.argv[2]

const config = require('./config')
const mongoose = require('mongoose');

const url = `mongodb://${config.mongodb.user}:${config.mongodb.password}@${config.mongodb.host}/${config.mongodb.database}`

const conn = mongoose.createConnection(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {
  if (err) console.log('fail to connect:', err)
});
mongoose.Promise = global.Promise

const lockerSchema = new mongoose.Schema({
  name: String,
  addr: String,
  lat: mongoose.Schema.Types.Number,
  lng: mongoose.Schema.Types.Number
}, { collection: 'lockers' })
const lockerModel = conn.model('lockers', lockerSchema)

var item = new mongoose.Schema({
  id: mongoose.Schema.Types.Number,
  name: String,
  introduce: String,
  price: mongoose.Schema.Types.Number,
  img: String,
  // isGroup: mongoose.Schema.Types.Number,
  // groupAmount: mongoose.Schema.Types.Number
})
var group = new mongoose.Schema({
  name: String,
  target: mongoose.Schema.Types.Number,
  discount: mongoose.Schema.Types.Number,
  station: String,
  lockerNum: mongoose.Schema.Types.Number,
  arrivalTime: String,
  addr: String,
  people: mongoose.Schema.Types.Number
})
const shopSchema = new mongoose.Schema({
  name: String,
  starNum: mongoose.Schema.Types.Number,
  priceNum: mongoose.Schema.Types.Number,
  commentNum: mongoose.Schema.Types.Number,
  openTime: String,
  addr: String,
  img: String,
  tag: String,
  shopType: String,
  isGroup: mongoose.Schema.Types.Number,
  items: [item],
  groups: [group]
}, { strict: false }, { collection: 'shops' })
const shopModel = conn.model('shops', shopSchema)

// const orderSchema = new mongoose.Schema({
//   userID: String,
//   shop: String,
//   station: String,
//   addr: String,
//   goods: 
// }, { collection: 'lockers' })
// const lockerModel = conn.model('lockers', lockerSchema)

// start the server
app.listen(port, () => {
  console.log(`listening on port: ${port}`)
})

// handle other urls
app.use(express.static(`${__dirname}/LockerStore`))

app.get('/sign_up', (req, res) => {
  res.send(`${req.query.account}`)
})

var userID = 0;
app.get('/getNewID', (req, res) => {
  ++userID;
  res.send(`${userID}`);
  console.log(userID)
})

app.get('/insertLocker', (req, res) => {
  try {
    var myobj = { lat: req.query.lat, lng: req.query.lng, name: req.query.name, addr: req.query.addr };
    lockerModel.updateOne({ "name": req.query.name }, { $setOnInsert: myobj }, { upsert: true }, function (err, result) {
      if (err) return res.json(err);
      if (result === null) return res.json(err);
      res.send(`ok`);
    });
  }
  catch (e) {
    res.send(`fail`);
  }

})

app.get('/searchLocker', (req, res) => {
  try {
    lockerModel.findOne({ lat: req.query.lat, lng: req.query.lng }).select({ name: 1, addr: 1 }).exec(function (err, result) {
      if (err) return res.json(err);
      if (result === null) return res.json(err);
      res.send({
        name: result.name,
        addr: result.addr,
      });
    });
  }
  catch (e) {
    res.send(`fail`);
  }

})

app.get('/getLockerInfo', (req, res) => {
  try {
    lockerModel.findOne({ name: req.query.name }).select({ lat: 1, lng: 1, addr: 1 }).exec(function (err, result) {
      if (err) return res.json(err);
      if (result === null) return res.json(err);
      res.send({
        lat: result.lat,
        lng: result.lng,
        addr: result.addr
      });
    });
  }
  catch (e) {
    res.send(`fail`);
  }

})

app.get('/searchTag', (req, res) => {
  try {
    var arr = req.query.keywords.split('#');
    var keywords = arr.join('');
    var sorter = req.query.sorter;
    var query = {};
    if (req.query.sorter === 'priceNum') {
      query[sorter] = 1;
      shopModel.find({ $text: { $search: keywords } }).sort(query).exec(function (err, results) {
        if (err) return res.json(err);
        if (results.length < 1) return res.json(err);
        if (results.length > 60) {
          res.send({
            results: results.slice(0, 60),
          })
        }
        else {
          res.send({
            results: results,
          })
        }
      });
    }
    else {
      query[sorter] = -1;
      shopModel.find({ $text: { $search: keywords } }).sort(query).exec(function (err, results) {
        if (err) return res.json(err);
        if (results.length < 1) return res.json(err);
        if (results.length > 60) {
          res.send({
            results: results.slice(0, 60),
          })
        }
        else {
          res.send({
            results: results,
          })
        }
      });
    }
  }
  catch (e) {
    res.send(`fail`);
  }

})

app.get('/searchShop', (req, res) => {
  try {
    shopModel.findOne({ name: req.query.name }, function (err, result) {
      if (err) return res.json(err);
      if (result === null) return res.json(err);
      res.send({
        id: result._id,
        name: result.name,
        starNum: result.starNum,
        priceNum: result.priceNum,
        commentNum: result.commentNum,
        openTime: result.openTime,
        addr: result.addr,
        img: result.img,
        tag: result.tag,
        shopType: result.shopType
      });
    });
  }
  catch (e) {
    res.send(`fail`);
  }

})

app.get('/getItem_single', (req, res) => {
  try {
    shopModel.findOne({ _id: req.query.id }).select({ items: 1 }).exec(function (err, result) {
      if (err) return res.json(err);
      if (result === null) return res.json(err);
      res.send({
        results: result
      });
    });
  }
  catch (e) {
    res.send(`fail`);
  }

})

const crawl_root = "https://www.tagsfinder.com/en-tw/related/"
const english = /^[A-Za-z0-9]*$/;
app.get('/getRelatedTag', (req, res) => {
  try {
    var keyword = encodeURIComponent(req.query.keyword)
    request({
      url: crawl_root + keyword,
      method: "GET",
    }, function (error, response, body) {
      if (error || !body) {
        res.send('');
        return;
      }
      const $ = cheerio.load(body);
      const elements = $(".card-table a")
      var tags = elements.text().split("#")
      if (!english.test(req.query.keyword)) {
        var result = []
        for (let i = 2; i < tags.length && result.length < 3; i++) {
          if (!english.test(tags[i]))
            result.push(tags[i])
        }
        res.send(result);
      }
      else {
        res.send(tags.slice(1, 4))
      }
    });
  }
  catch (e) {
    res.send(`fail`);
  }
})

