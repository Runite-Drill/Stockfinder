const mongoose = require('mongoose');

const stockSchema = mongoose.Schema({

    symbol: {
        type: String,
    },
    core: {
        type: Object,
    },
    companyInfo: {
        type: Object,
    },
    priceData: {
        type: Object,
    },
    earningData: {
        type: Object,
    },
    financialData: {
        type: Object,
    },
    summaryData: {
        type: Object,
    },

},
    {timestamps: true}
)

const Stock = mongoose.model("Stock", stockSchema);

module.exports = Stock;