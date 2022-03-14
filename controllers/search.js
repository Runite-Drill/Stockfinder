//Include models
// const User = require("../models/User"); 
const Stock = require("../models/Stock");
const moment = require("moment");
// const Search = require("../helper/search");
const yahooFinance = require('yahoo-finance');

const axios = require('axios');

//Alpha Vantage
const baseURL = 'https://www.alphavantage.co/query?';
const apiKey = "VUVZJ3W07OZ6RWKY";

//HTTP GET - load homepage
exports.search_home_get = (req, res) => {
    res.render("search/home");
}
//HTTP GET - load search results
exports.search_results_get = (req, res) => {
    //parse search string and get results
    let sStr = req.query.searchStr; //turn search into a database objkect as well?
    let stocks =[];

    // res.render("search/results", {searchStr:sStr,stocks,moment});

    //Get relevant search results
    let func = 'SYMBOL_SEARCH';
    let keys = sStr;
    let symb = sStr;
    let inte = '60min';

    axios({
        method: 'get',
        url: baseURL+"function="+func+"&keywords="+keys+"&apikey="+apiKey,
    })
    .then(response => {
        // console.log(response.data.bestMatches);
        let relevantStocks = response.data.bestMatches;
        relevantStocks=relevantStocks.filter(stock=>stock['3. type']=="Equity");
        relevantStocks=relevantStocks.filter(stock=>stock['8. currency']=="USD");
        relevantStocks=relevantStocks.filter(stock=>Number(stock['9. matchScore'])>0.65);
        relevantStocks.forEach(stock=>{
            yahooFinance.quote({
                symbol: stock['1. symbol'],
                modules: [ 'price', 'summaryDetail' , 'earnings', 'summaryProfile' , 'financialData']
            }, function(error, quotes) {
                if (error) {return}
                if (quotes.price.exchangeName == "NasdaqGS") {quotes.price.exchangeName="Nasdaq"};
                let coreData = {
                    symbol: quotes.price.symbol,
                    name: quotes.price.longName,
                    type: quotes.price.quoteType,
                    exchange: quotes.price.exchangeName,
                    currentPrice: quotes.financialData.currentPrice,
                    priceChange: -(quotes.summaryDetail.previousClose - quotes.financialData.currentPrice)/quotes.summaryDetail.previousClose,
                    marketCap: quotes.summaryDetail.marketCap,
                    volume: quotes.summaryDetail.volume,
                    revenuePerShare: quotes.financialData.revenuePerShare,
                    
                }
                let stockConstructor = {
                    core: coreData,
                    companyInfo: quotes.summaryProfile,
                    priceData: quotes.price,
                    earningData: quotes.earnings,
                    financialData: quotes.financialData,
                    summaryData: quotes.summaryDetail,
                }

                // Stock.find()
                // .then()
                // .catch()
                let newStock = new Stock(stockConstructor);
                // newStock.save(); //DON'T SAVE TO MONGO DB YET
                stocks.push(newStock);
            })
        })

        setTimeout(() => {
            res.render("search/results", {searchStr:sStr,stocks,moment});
        }, 1000);

    })
    .catch(err=>{console.log(err); res.send("Error searching for stock: " + err._message+'.')})

}