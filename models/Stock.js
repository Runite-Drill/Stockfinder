const mongoose = require('mongoose');

const stockSchema = mongoose.Schema({

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

stockSchema.methods.formatValue = function(val) {
    let valStr = '???';
    if (val) {
        val = +val.toPrecision(3);
        let appStr = '';
        while (val > 1000) {
            val /= 1000;
            switch (appStr) {
                case '': appStr = 'K'; break;
                case 'K': appStr = 'M'; break;
                case 'M': appStr = 'B'; break;
                case 'B': appStr = 'T'; break;
                case 'T': appStr = 'Q'; break;
            }
        }
        valStr = val+appStr;
    }
    return valStr;
}

const Stock = mongoose.model("Stock", stockSchema);

module.exports = Stock;