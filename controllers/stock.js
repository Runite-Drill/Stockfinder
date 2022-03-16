//Include models
// const User = require("../models/User"); 
const Stock = require("../models/Stock");
const moment = require("moment");
// const Search = require("../helper/search");
const yahooFinance = require('yahoo-finance');

const axios = require('axios');


//HTTP GET - load stock detail
exports.stock_detail_get = (req, res) => {

    yahooFinance.quote({
        symbol: req.params.symbol,
        modules: [ 'price', 'summaryDetail' , 'earnings', 'summaryProfile' , 'financialData']
    }, function(error, quotes) {
        if (error) {return}
        if (quotes.price.exchangeName == "NasdaqGS") {quotes.price.exchangeName="Nasdaq"};
        // console.log(quotes.price.longName)
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
        res.render("stock/detail", {stock: newStock});
    })
}

exports.stock_follow_get = (req,res) => {
    //either set the stock model here when the stock is followed, or create in the database when searched

    console.log(req.body);
    console.log(req.query.symbol);

    let stock = new Stock(req.body);
    stock.save() 

    .then(()=>{

        req.body.followers.forEach(user=> {
            User.findById(user, (error, user) => {
                user.following.push(stock);
                user.save();
            })
        })
        res.redirect("back");
    })
    .catch((err)=>{console.log(err); res.send("Error following stock.")})
}