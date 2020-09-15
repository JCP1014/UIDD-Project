const config = require('./config')
const mongoose = require('mongoose');
const url = `mongodb://${config.mongodb.user}:${config.mongodb.password}@${config.mongodb.host}/${config.mongodb.database}`
const conn = mongoose.createConnection(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {
    if (err) console.log('fail to connect:', err)
});
mongoose.Promise = global.Promise

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

var groups_array = []
var group_array = []
var group = {
  name: "",
  target: 0,
  discount: 0,
  station: "",
  lockerNum: 0,
  arrivalTime: "",
  addr: "",
  people: 0
}
var shop_count = 1392;
var station_count = 67;
while(shop_count > 0)
{
  var group_count = Math.floor(Math.random()*3)+1;
  while(group_count > 0)
  {
    
  }
}
shopModel.updateMany({}, { items: items_array[i] }, done);