/**
 * Created by lawrenceackner on 6/7/18.
 */
class TradeDataRepository {
    constructor() {
        this.currentPrice;
        this.tradePeriods = [];
        this.tradePeriodsDate = [];
        this.tdpMap = [];
    }
}

module.exports = {TradeDataRepository};