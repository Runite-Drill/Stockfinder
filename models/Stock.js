const mongoose = require('mongoose');
const Search = require("../helper/search");

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
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],

},
    {timestamps: true}
)

stockSchema.methods.formatValue = Search.formatValue;


const Stock = mongoose.model("Stock", stockSchema);

module.exports = Stock;