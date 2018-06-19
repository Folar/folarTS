/**
 * Created by lawrenceackner on 6/7/18.
 */
const {Config} = require('./Config.js');
class TradeInfo {
    constructor() {
        this.call = [];
        this.put = []
        this.configNames = [];
        this.positionNames = [];
        this.stockNames = [];
        this.transactions = [];
        this.stkData = null;
        this.expNames =[];
        this.idConfig;
        this.idPosition;
        this.tradingPeriodCount;
        this.underlyingLast;
        this.period1;
        this.period2;
        this.period3;
        this.expDay1;
        this.expDay2;
        this.expDay3;
        this.currentStock;
        this.offset = 0;;
        this.idUser;
        this.currentStock ;
        this.currentPosition;
        this.fname;
        this.currentConfig;
        this.config ;
    }
}
module.exports = {TradeInfo};