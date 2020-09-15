const config = require('./config')
const mongoose = require('mongoose');
const url = `mongodb://${config.mongodb.user}:${config.mongodb.password}@${config.mongodb.host}/${config.mongodb.database}`
const conn = mongoose.createConnection(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {
    if (err) console.log('fail to connect:', err)
});
mongoose.Promise = global.Promise

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
    isGroup: mongoose.Schema.Types.Number
}, { collection: 'shops' })
const shopModel = conn.model('shops', shopSchema)

var lines = require('fs').readFileSync('./crawler_data/shopData.txt', 'utf-8').split('\n');
var obj_array = []
for (var i = 0; i < lines.length - 1; i += 10) {
    var myobj = {
        name: lines[i],
        starNum: parseFloat(lines[i + 1]),
        priceNum: parseInt(lines[i + 2]),
        commentNum: parseInt(lines[i + 3]),
        openTime: lines[i + 4],
        addr: lines[i + 5],
        img: lines[i + 6],
        tag: lines[i + 7],
        shopType: lines[i + 8],
        isGroup: parseInt(lines[i + 9]),
    }
    obj_array.push(myobj)
}
var async = require('async');
var cnt = 0;
async.eachSeries(obj_array, function updateObject(obj, done) {
    ++cnt;
    console.log(cnt);
    shopModel.updateOne({ "name": obj.name }, { $setOnInsert: obj }, { upsert: true }, done);
}, function allDone(err) {
    // this will be called when all the updates are done or an error occurred during the iteration
    if(err) throw err;
});