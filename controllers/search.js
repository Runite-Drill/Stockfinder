//Include models
// const User = require("../models/User"); 
const Stock = require("../models/Stock");
const moment = require("moment");
const Search = require("../helper/search");
const finnhub = require('finnhub');
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = "c8ntb0qad3iep4jeef40"
const finnhubClient = new finnhub.DefaultApi()

const axios = require('axios');

//Alpha Vantage
const baseURL = 'https://www.alphavantage.co/query?';
const apiKey = "VUVZJ3W07OZ6RWKY";

//HTTP GET - load homepage
exports.search_home_get = (req, res) => {
    res.render("search/home");
}
//HTTP GET - load search results
exports.search_results_get = async(req, res) => {
    //parse search string and get results
    let sStr = req.query.searchStr; //turn search into a object model as well to store in user history
    let stocks = [];

    //FUNNHUB SEARCH
    // finnhubClient.symbolSearch(sStr, (error, data, response) => {
    //     let stocksFound = data.result;
    //     stocksFound = stocksFound.filter(stock=>{stock.type=="Common Stock"})
    //     stocksFound.forEach((stock)=>{
    //         console.log('Search 1')
    //         let newStock = Search.getStockInfo(stock.symbol);
    //         stocks.push( newStock);
    //     })
    // });

    // setTimeout(() => {
    //     console.log(stocks);
    // }, 1000);

    //ALPHA VANTAGE SEARCH
    //Get relevant search results
    let func = 'SYMBOL_SEARCH';
    let keys = sStr;
    axios({
        method: 'get',
        url: baseURL+"function="+func+"&keywords="+keys+"&apikey="+apiKey,
    })
    .then(async(response) => {
        // console.log('Search 2:')
        // console.log(response);
        // console.log(response.data.bestMatches);
        let relevantStocks = response.data.bestMatches;
        relevantStocks=relevantStocks.filter(stock=>stock['3. type']=="Equity");
        relevantStocks=relevantStocks.filter(stock=>stock['8. currency']=="USD");
        relevantStocks=relevantStocks.filter(stock=>Number(stock['9. matchScore'])>0.65);

        // console.log(relevantStocks);
        var itemsProcessed = 0;
        // const stockPromise = new Promise((resolve,reject) => {
            await relevantStocks.forEach(async(stock)=>{
                let newStock = await Search.getStockInfo(stock['1. symbol']);
                stocks.push(newStock);
                // console.log('Inside for each: ' + newStock.summaryData)
                itemsProcessed++;
                // console.log('Stock foreach ' + newStock.price.symbol)
                // res.redirect("search/results", {searchStr:sStr,stocks,moment});
                if(itemsProcessed === relevantStocks.length) {
                    callback(stocks, res, sStr);
                  }
            })
            // resolve(relevantStocks)
            // return stocks;
        // })
         
        // stocks = stockPromise(relevantStocks)
        // console.log(relevantStocks)
        // console.log('Stock then: ' + stocks)
        
    })
    // .then(stocks => {
    //     // console.log(stocks)
    //     console.log('RENDER');
    //     console.log('Stock Render: ' + stocks);
    //     // setTimeout(()=>{
    //         console.log('RENDERING')
    //         res.render("search/results", {searchStr:sStr,stocks: [],moment})

    //     // },10000)

    // })
    .catch(err=>{console.log(err); res.send("Error searching for stock: " + err._message+'.')})

}

function callback(stocks, res, sStr) {
    // console.log('RENDER');
    // console.log('Stock Render: ' + stocks.core);
    // console.log('RENDERING')
    // console.log(stocks);
    res.render("search/results", {searchStr:sStr,stocks,moment})
}