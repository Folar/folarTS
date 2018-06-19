/**
 * Created by lawrenceackner on 6/7/18.
 */
class Config {

    constructor() {
        this.setCol1("iv");
        this.setCol2("mid");
        this.setCol3("delta");
        this.setCol4("gamma");
        this.setCol5("trade");
        this.setStocks("RUT");
        this.id = 0;
        this.configNames = [];
    }

    setStocks(stocks) {
        this.stocks = stocks;
    }

    setCol1(col1) {
        this.col1 = col1;
    }

    setCol2(col2) {
        this.col2 = col2;
    }

    setCol3(col3) {
        this.col3 = col3;
    }

    setCol4(col4) {
        this.col4 = col4;
    }

    setCol5(col5) {
        this.col5 = col5;
    }
}
module.exports = {Config};