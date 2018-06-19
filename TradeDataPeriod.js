/**
 * Created by lawrenceackner on 6/7/18.
 */

class TradeDataPeriod {


    constructor(arr) {
        this.arr = arr;
        this.tdr = arr[0];
        this.expiration = tdr.expiration;
        this.type;
        this.callArr = [];
        this.putArr = [];
        this.callMap = [];
        this.putMap = [];
    }

    setExp(exp) {

        this.expiration = exp;
    }
}
module.exports = {TradeDataPeriod};