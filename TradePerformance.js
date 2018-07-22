/**
 * Created by lawrenceackner on 6/7/18.
 */

class TradePerformance {

    constructor(name, cost, currentCost, id,openDate,closed) {
        this.name = name;
        this.cost = cost ;
        this.currentCost = currentCost ;  //lma todo
        this.id = id;
        this.openDate = openDate;
        this.status = closed?"Closed":"Open";
    }
}

module.exports = {TradePerformance};