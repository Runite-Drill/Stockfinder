//Include models
const User = require("../models/User"); 
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
    let searchComplete = [false, false];
    // res.render("search/loading")

    let itemsProcessed = 0;

    //save search query to user profile so they can return to it later
    if (req.user) {
        console.log('Updating search history...')
        User.findById(req.user.id, ((err, user)=>{
            user.searchHistory.push(sStr);
            user.save();
        }))
    }

    //FUNNHUB SEARCH
    finnhubClient.symbolSearch(sStr, async(error, data, response) => {
        // console.log('Search 1')
        if (data) {
            let stocksFound = data.result;
            // console.log(typeof(stocksFound))
            // stocksFound.forEach(stock=>{console.log(stock["type"])})
            // stocksFound.forEach(stock=>{console.log(typeof(stock.type))})
            // console.log(stocksFound.filter(stock=>{stock.type!="Common Stock"}))
            stocksFound = await stocksFound.filter(stock=>{stock["type"]=="Common Stock"})
            // stocksFound.forEach(stock=>{console.log(stock.type)})
            // console.log('filtered stocks: ' + await stocksFound)

            if (stocksFound.length > 0) {
                console.log('STOCKS FOUND')
                await stocksFound.forEach(async(stock)=>{
                    console.log(stock.symbol)
                    let newStock = await Search.getStockInfo(stock.symbol);
                    stocks.push( newStock);
                    itemsProcessed++
                    if(itemsProcessed === stocksFound.length) {
                        searchComplete[0] = true;
                        callback(stocks, res, sStr, searchComplete);
                    }
                })
            } else {
                searchComplete[0] = true;
                callback(stocks, res, sStr, searchComplete);
            }
        } else {
            searchComplete[0] = true;
            callback(stocks, res, sStr, searchComplete);
        }
    });

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
        let itemsProcessed = 0;
        // const stockPromise = new Promise((resolve,reject) => {
            await relevantStocks.forEach(async(stock)=>{
                let newStock = await Search.getStockInfo(stock['1. symbol']);
                stocks.push(newStock);
                // console.log('Inside for each: ' + newStock.summaryData)
                itemsProcessed++;
                // console.log('Stock foreach ' + newStock.price.symbol)
                if(itemsProcessed === relevantStocks.length) {
                    searchComplete[1] = true;
                    callback(stocks, res, sStr, searchComplete);
                }
            })
        
    })
    .catch(err=>{console.log(err); res.send("Error searching for stock: " + err._message+'.')})

}

async function callback(stocks, res, sStr, searchComplete) {
    // console.log(searchComplete)
    if (searchComplete.every(el=>el===true)) {
        //Search is complete
        console.log('Displaying search results...')
        let stockModels = [];
        let itemsProcessed = 0;
        stocks.forEach(async(stock)=>{
            await Stock.updateOne({symbol: stock.core.symbol}, stock)
            .then(async(response)=>{
                if (response.modifiedCount < 1) {
                    let newStock = new Stock(stock);
                    // console.log(newStock)
                    await newStock.save() 
                    .then((savedStock)=>{
                        stockModels.push(savedStock);
                        // console.log('Models 1a: ' + stockModels);
                        console.log(`Successfully added ${stock.core.symbol} to the database.`);
                        // itemsProcessed++
                    })
                    .catch((err)=>{
                        console.log(err); 
                        // res.send("Error saving stock to database.")
                        console.log(`Error saving ${stock.core.symbol} to the database.`); 
                    })
                } else {
                    await Stock.findOne({symbol: stock.core.symbol})
                    .then((stockFound)=>{
                        // console.log(stockFound)
                        stockModels.push(stockFound);
                        // console.log('1xxxxxxx: ' + stockModels)
                        // stockPromise = stockModels;
                        // return stockModels
                    })

                    // console.log('Models 1b: ' + stockModels);
                    console.log(`Successfully updated ${stock.core.symbol} in the database.`);
                }
            })
            .catch((err)=>{
                console.log(err); 
                // res.send("Error finding stock in database. Creating a new entry...")
                console.log("Error saving stock to database.");
            })

            itemsProcessed++
            if(itemsProcessed === stocks.length) {
                // console.log('Models 2: ' + stockModels)
                // renderResults(stockModels, res, sStr);
                res.render("search/results", {searchStr:sStr,stocks:stockModels,moment})
            } else {
                // res.redirect("/search/loading")
            }

        })
        // res.render("search/results", {searchStr:sStr,stocks,moment, Stock})
    }
}