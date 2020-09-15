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
    items: [item]
}, { strict: false }, { collection: 'shops' })
const shopModel = conn.model('shops', shopSchema)

var lines = require('fs').readFileSync('./crawler_data/itemData.txt', 'utf-8').split('\n');
var shop_array = []
var count_array = []
var items_array = []
var item_array = []
var count = 0
var item = {
    id: 0,
    name: "",
    intro: "",
    price: 0,
    img: ""
}
for (var i = 0; i < lines.length - 1; ++i) {
    if (lines[i].indexOf("shopName=") !== -1) {
        console.log(count / 4);
        count_array.push(count / 4);
        items_array.push(item_array)
        shop_array.push(lines[i].split("shopName=")[1]);
        count = 0;
        item_array = []
    }
    else {
        ++count;
        switch (count % 4) {
            case 1:
                {
                    item['name'] = lines[i];
                    break;
                }
            case 2:
                {
                    item['intro'] = lines[i];
                    break;
                }
            case 3:
                {
                    item['price'] = parseInt(lines[i]);
                    break;
                }
            case 0:
                {
                    item['img'] = lines[i];
                    item['id'] = count / 4;
                    // console.log(JSON.stringify(item))
                    item_array.push(item)
                    item = {
                        id: 0,
                        name: "",
                        intro: "",
                        price: 0,
                        img: ""
                    }
                }
        }
    }
}
console.log(count / 4);
count_array.push(count / 4);
items_array.push(item_array)
count_array.splice(0, 1)
items_array.splice(0, 1)
console.log(shop_array.length)
console.log(count_array.length)
console.log(items_array.length)
console.log(
    count_array.reduce((a, b) => a + b, 0)
)

// for (var i = 0; i < items_array.length; ++i) {
//     for (var j = 0; j < items_array[i].length; ++j) {
//         console.log(JSON.stringify(items_array[i][j]))
//     }
//     console.log("\n");
// }

var async = require('async');
var i = 0;
async.eachSeries(shop_array, function updateShop(shop, done) {
    console.log(i);
    shopModel.updateOne({ "name": shop }, { items: items_array[i] }, done);
    ++i;
}, function allDone(err) {
    // this will be called when all the updates are done or an error occurred during the iteration
    if (err) throw err;
});