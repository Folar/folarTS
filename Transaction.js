/**
 * Created by lawrenceackner on 6/7/18.
 */
class Transaction {

    constructor(strike, qty, type, action, symbol, price, expiration, transTime, idTrans) {
        this.strike = strike;
        this.qty = qty;
        if(action == "Sell")
            this.qty = qty * -1;
        this.buy = this.qty < 0 ? false : true;
        this.mag = this.qty < 0 ? -1 * this.qty : this.qty;
        this.type = type;
        this.action = action;
        this.symbol = symbol;
        this.priceDisplay = price;
        this.price = price;
        if (this.buy)
            this.price *= -1;
        this.expiration = expiration;
        this.transTime = transTime;
        this.idTrans = idTrans;
    }

    getExpiration() {
        return this.expiration;
    }

    getStrike() {
        return this.strike;
    }

    getQty() {
        return this.qty;
    }

    getType() {
        return this.type;
    }

    getAction() {
        return this.action;
    }

    getSymbol() {
        return this.symbol;
    }


}
module.exports = {Transaction};