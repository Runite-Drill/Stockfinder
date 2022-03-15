const yahooFinance = require('yahoo-finance');
const Stock = require("../models/Stock");

exports.getStockInfo = async function(symb) {
    let newStock = null;

    newStock = yahooFinance.quote({
        symbol: symb,
        modules: [ 'price', 'summaryDetail' , 'earnings', 'summaryProfile' , 'financialData']
    },
    async function(error, quotes) {
        if (error) {return}
        // if (quotes.price.exchangeName == "NasdaqGS") {quotes.price.exchangeName="Nasdaq"};
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
        newStock = await new Stock(stockConstructor);
        // console.log(newStock);
        // newStock.save(); //DON'T SAVE TO MONGO DB YET - GET THIS WORKING ASAP - FIND & UPDATE
        return newStock;

    });

    return await newStock;
}