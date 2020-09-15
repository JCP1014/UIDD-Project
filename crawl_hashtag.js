const request = require('request');
const cheerio = require("cheerio");
var root = "https://www.tagsfinder.com/en-tw/related/"
const getRelated = function () {
    var keyword = encodeURIComponent("炸雞")
    request({
        url: root+keyword,
        method: "GET",
    }, function (error, response, body) {
        if (error || !body) {
            return;
        }
        const $ = cheerio.load(body);
        const elements = $(".card-table a")
        var result = elements.text().split("#")
        for (let i = 1; i < result.length; i++) {
            console.log(result[i])
        }
    });
};

getRelated();