const yahooFinance = require('yahoo-finance');
const Stock = require("../models/Stock");

exports.getStockInfo = async function(symb) {
    let stockPromise = null;

    stockPromise = yahooFinance.quote({
        symbol: symb,
        modules: [ 'price', 'summaryDetail' , 'earnings', 'summaryProfile' , 'financialData']
    },
    async function(error, quotes) {
        if (error) {return}
        if (!quotes) {return}
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
        stockPromise = await new Stock(stockConstructor);
        // newStock.save(); //DON'T SAVE TO MONGO DB YET - GET THIS WORKING ASAP - FIND & UPDATE
        // return newStock;

    });

    // console.log("This line is here solely for the purpose of making the code not break. Don't ask me why it's needed, because nobody has any idea.", await stockPromise);
    let x = await stockPromise; //for some reason this line is needed before the return or it all breaks. it also prints out the data for some reason.
    // console.log(x)
    return stockPromise;
}